from typing import Text, Dict, List, Any
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests
import unicodedata
import re
from difflib import SequenceMatcher

API_BASE = "http://localhost:3307/api"


# =========================
# ACTIONS - TÌM KIẾM MÓN ĂN
# =========================

class ActionFallback(Action):
    """Xử lý khi bot không hiểu"""
    
    def name(self) -> Text:
        return "action_fallback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        dispatcher.utter_message(
            text="""Xin lỗi bạn, mình chưa hiểu câu hỏi của bạn. Bạn có thể nói lại không? 😅 Hoặc

Bạn có thể hỏi mình về:
• Menu nhà hàng
• Giờ mở cửa & địa chỉ
• Giá món ăn (VD: "lẩu trường thọ giá bao nhiêu")
• Khuyến mãi hiện tại  

Hoặc gọi hotline: **0123.546.789** để được hỗ trợ trực tiếp nhé!"""
        )
        return []

# =========================
# NORMALIZE TEXT
# =========================
def normalize_text(text: str) -> str:
    if not text:
        return ""

    text = text.lower().strip()

    # bỏ dấu tiếng Việt
    text = unicodedata.normalize('NFD', text)
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')

    text = text.replace("đ", "d")

    # remove ký tự đặc biệt
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()

    return text


# =========================
# EXTRACT DISH NAME
# =========================
def extract_dish_name(text: str) -> str:
    text = normalize_text(text)

    stopwords = [
        "gia", "bao nhieu", "gia bao nhieu",
        "toi", "muon", "tim", "kiem",
        "giup", "lam on", "cho toi", 
        "hom", "nay", "hom nay co",
        "co", "khong", "mon",
        "a", "ah", "uh"
    ]

    # Cố gắng lọc chính xác hơn với các từ "chay" hay món gốc
    if "chay" in text:
        stopwords.append("chay")
    
    words = text.split()
    filtered_words = [w for w in words if w not in stopwords]

    return " ".join(filtered_words)


# =========================
# FUZZY MATCH (CỰC QUAN TRỌNG)
# =========================
def is_match(user_text: str, product_name: str) -> float:
    user_text = normalize_text(user_text)
    product_name = normalize_text(product_name)

    # Kiểm tra nếu user_text là một phần trong product_name
    if user_text in product_name:
        # Kiểm tra nếu tỷ lệ độ dài hợp lý
        if len(user_text) / len(product_name) > 0.3:  # Chỉ chấp nhận khi tỷ lệ này lớn hơn 30%
            return 1.0
    
    # Nếu không tìm thấy chính xác, sử dụng fuzzy match (so khớp gần đúng)
    return SequenceMatcher(None, user_text, product_name).ratio()

# =========================
# ACTION SEARCH MÓN
# =========================
class ActionFindDishesByName(Action):

    def name(self) -> Text:
        return "action_find_dishes_by_name"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        raw_text = tracker.latest_message.get("text", "")
        slot_name = tracker.get_slot("dish_name")

        dish_name = slot_name if slot_name else raw_text
        dish_name = extract_dish_name(dish_name)

        print("🔍 USER INPUT:", dish_name)

        if not dish_name:
            dispatcher.utter_message(text="Bạn muốn tìm món gì?")
            return []

        try:
            # =========================
            # LOAD ALL PRODUCTS & SEARCH WITH MORE PRECISION
            # =========================
            products = []
            page = 1

            while True:
                res = requests.get(f"{API_BASE}/public/product?page={page}")

                if res.status_code != 200:
                    break

                data = res.json()
                results = data.get("results", [])

                if not results:
                    break

                products.extend(results)

                total_pages = data.get("totalPages", 1)
                if page >= total_pages:
                    break

                page += 1

            print(f"📦 TOTAL PRODUCTS LOADED: {len(products)}")

            # =========================
            # FILTER AND MATCH ONLY RELEVANT RESULTS
            # =========================
            scored = []

            for p in products:
                name = p.get("name", "")
                score = is_match(dish_name, name)

                print(f"➡️ {normalize_text(name)} | score={score}")

                if score >= 0.8:  # Điều chỉnh mức độ chính xác nếu cần
                    scored.append((score, p))

            scored.sort(reverse=True, key=lambda x: x[0])

            # =========================
            # LIMIT RESULTS TO MOST RELEVANT
            # =========================
            top_matches = [p for _, p in scored[:2]]  # Giới hạn 2 món tốt nhất

            if top_matches:
                msg = f"🔍 Tìm thấy {len(top_matches)} món:\n"

                # =========================
                # Gửi thông tin về các món ăn với ảnh
                # =========================
                for f in top_matches:
                    print("🔍 Dữ liệu sản phẩm trả về:", f)  # In ra toàn bộ dữ liệu để kiểm tra file_id và image

                    image_path = f.get('image', '')  # Kiểm tra trường 'image'
                    print(f"Ảnh sản phẩm: {image_path}")  # In ra đường dẫn ảnh để kiểm tra

                    if image_path:  # Nếu có ảnh trả về từ API
                        # Thay thế mode=admin thành mode=public
                        image_url = image_path.replace("mode=admin", "mode=public")
                        print(f"✅ Gửi ảnh từ URL: {image_url}")  # In ra URL ảnh để kiểm tra

                        # Kiểm tra ảnh có thể truy cập công khai không
                        try:
                            res = requests.get(image_url)
                            if res.status_code == 200:
                                print("✅ Ảnh có thể truy cập công khai!")
                                dispatcher.utter_message(
                                    text=f"{f['name']} - {f['price']}đ",
                                    image=image_url  # Gửi ảnh trực tiếp
                                )
                            else:
                                print(f"❌ Ảnh không thể truy cập được từ URL: {image_url}")
                                dispatcher.utter_message(
                                    text=f"{f['name']} - {f['price']}đ",
                                    image="https://example.com/default-image.png"  # Ảnh mặc định
                                )
                        except Exception as e:
                            print("ERROR kiểm tra ảnh:", e)
                            dispatcher.utter_message(
                                text=f"{f['name']} - {f['price']}đ",
                                image="https://example.com/default-image.png"  # Ảnh mặc định
                            )
                    else:  # Nếu không có ảnh trả về từ API
                        print("❌ Không có ảnh trả về từ API.")
                        dispatcher.utter_message(
                            text=f"{f['name']} - {f['price']}đ",
                            image="https://example.com/default-image.png"  # Ảnh mặc định
                        )

            else:
                dispatcher.utter_message(
                    text=f"Không tìm thấy '{dish_name}'."
                )

        except Exception as e:
            print("ERROR:", e)
            dispatcher.utter_message(text="Lỗi khi tìm món.")

        return []


# =========================
# CATEGORY (GIỮ NGUYÊN - OK)
# =========================
import requests

class ActionFindDishesByCategory(Action):

    def name(self) -> Text:
        return "action_find_dishes_by_category"

    def run(self, dispatcher, tracker, domain):
        category_name = tracker.get_slot("category_name")

        if not category_name:
            dispatcher.utter_message(text="Bạn muốn xem danh mục nào?")
            return []

        try:
            # Lấy dữ liệu danh mục
            cat_res = requests.get(f"{API_BASE}/public/category-product")

            # Kiểm tra nếu không lấy được danh mục
            if not cat_res.ok:
                dispatcher.utter_message(text="Không thể lấy danh mục từ hệ thống.")
                return []

            categories = cat_res.json().get("results", [])

            target_cat = None

            # Tìm danh mục tương ứng
            for c in categories:
                if normalize_text(category_name) in normalize_text(c.get("name", "")):
                    target_cat = c
                    break

            if not target_cat:
                dispatcher.utter_message(text="Không tìm thấy danh mục.")
                return []

            cat_id = target_cat.get("id")

            # Lấy tất cả sản phẩm từ các trang
            all_products = []
            page = 1

            while True:
                # Lấy dữ liệu sản phẩm từ trang hiện tại
                prod_res = requests.get(f"{API_BASE}/public/product?page={page}")

                # Kiểm tra nếu API trả về lỗi
                if not prod_res.ok:
                    dispatcher.utter_message(text="Không thể lấy sản phẩm từ hệ thống.")
                    return []

                products = prod_res.json().get("results", [])
                all_products.extend(products)  # Ghép tất cả sản phẩm lại với nhau

                # Nếu không có sản phẩm trên trang này, dừng lại
                if len(products) == 0:
                    break

                page += 1  # Chuyển sang trang tiếp theo

            # Lọc các sản phẩm theo danh mục
            filtered = [p for p in all_products if p.get("categories_id") == cat_id]

            # Gửi phản hồi với danh sách món ăn
            dispatcher.utter_message(
                text=f"📂 {target_cat.get('name')} ({len(filtered)} món)",
                json_message={"products": filtered}
            )

        except requests.exceptions.RequestException as e:
            # Xử lý lỗi khi gặp sự cố kết nối với API và in lỗi ra console để kiểm tra
            dispatcher.utter_message(text="Lỗi hệ thống, vui lòng thử lại.")
            print(f"Lỗi kết nối API: {e}")

        except Exception as e:
            # Xử lý các lỗi không mong đợi khác
            dispatcher.utter_message(text="Lỗi hệ thống.")
            print(f"Lỗi không mong đợi: {e}")

        return []
    
# =========================
# PRICE RANGE SEARCH
# =========================

import re

class ActionFindDishesByPriceRange(Action):

    def name(self) -> Text:
        return "action_find_dishes_by_price_range"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Lấy câu hỏi từ người dùng
        user_message = tracker.latest_message.get("text", "").lower()

        # Sử dụng biểu thức chính quy để tìm khoảng giá
        price_match = re.search(r"(\d+)(?:\s*đ)?\s*(?:[-–]|đến)\s*(\d+)(?:\s*đ)?", user_message)
        
        if not price_match:
            dispatcher.utter_message(text="Xin vui lòng cung cấp một khoảng giá hợp lệ.")
            return []

        # Xử lý giá trị khoảng giá (từ giá đến giá)
        from_price = price_match.group(1)
        to_price = price_match.group(2)
        
        try:
            from_price = float(from_price)
            to_price = float(to_price) if to_price else float('inf')  # Nếu không có giá trị max, gán giá trị tối đa là vô hạn
        except ValueError:
            dispatcher.utter_message(text="Giá không hợp lệ. Vui lòng cung cấp giá hợp lệ.")
            return []

        # Tìm từ khóa chính trong câu yêu cầu
        search_keyword = self.extract_dish_keyword(user_message)

        # Nếu không tìm thấy từ khóa, yêu cầu người dùng nhập lại
        if not search_keyword:
            dispatcher.utter_message(text="Xin vui lòng cung cấp một từ khóa tìm món ăn.")
            return []

        try:
            # =========================
            # LẤY TOÀN BỘ DỮ LIỆU SẢN PHẨM VỚI PHÂN TRANG
            # =========================
            products = []
            page = 1

            while True:
                res = requests.get(f"{API_BASE}/public/product?page={page}")

                if res.status_code != 200:
                    break

                data = res.json()
                results = data.get("results", [])

                if not results:
                    break

                products.extend(results)

                total_pages = data.get("totalPages", 1)
                if page >= total_pages:
                    break

                page += 1

            print(f"📦 TOTAL PRODUCTS LOADED: {len(products)}")

            # =========================
            # LỌC CÁC MÓN ĂN THEO KHOẢNG GIÁ VÀ TỪ KHÓA
            # =========================
            filtered = []

            for p in products:
                price = float(p.get("price") or 0)
                name = p.get("name", "").lower()

                # Kiểm tra nếu món có trong khoảng giá và tên món có chứa từ khóa tìm kiếm
                if from_price <= price <= to_price and search_keyword in name:
                    filtered.append(p)

            # =========================
            # GIỚI HẠN KẾT QUẢ
            # =========================
            top_matches = filtered[:4]  # Giới hạn tối đa 4 món phù hợp nhất

            # Cập nhật cách hiển thị khoảng giá
            to_price_display = to_price if to_price != float('inf') else "không giới hạn"

            if top_matches:
                msg = f"💰 Tìm thấy {len(top_matches)} món trong khoảng giá {from_price}đ - {to_price_display}đ:\n"
                for f in top_matches:
                    msg += f"• {f['name']} - {f['price']}đ\n"

                dispatcher.utter_message(
                    text=msg,
                    json_message={"products": top_matches}
                )
            else:
                dispatcher.utter_message(
                    text=f"Không tìm thấy món ăn nào trong khoảng giá từ {from_price}đ đến {to_price_display} với tên '{search_keyword}'."
                )

        except Exception as e:
            print("ERROR:", e)
            dispatcher.utter_message(text="Lỗi hệ thống. Vui lòng thử lại sau.")

        return []

    def extract_dish_keyword(self, message: str) -> str:
        """Tách từ khóa tìm kiếm chính từ câu hỏi của người dùng."""
        # Tìm các từ khóa cơ bản như "đồ uống", "cơm", "lẩu", v.v...
        keywords = ["bún", "cơm", "mì", "lẩu", "bún", "kem", "gỏi", "bánh", "trái cây", "salad", "trà", "nước", "cafe", "bạc sỉu", "snack"]
        for keyword in keywords:
            if keyword in message:
                return keyword
        return ""

# =========================
# CATEGORY LIST
# =========================

class ActionAskAboutCategories(Action):

    def name(self) -> Text:
        return "action_ask_about_categories"

    def run(self, dispatcher, tracker, domain):

        try:
            res = requests.get(f"{API_BASE}/public/category-product")
            data = res.json()

            categories = data.get("results", data)

            dispatcher.utter_message(
                text=f"Có {len(categories)} danh mục",
                json_message={"category": categories}
            )

        except:
            dispatcher.utter_message(text="Lỗi lấy danh mục")

        return []

class ActionSuggestFood(Action):
    """Gợi ý món ăn - Có thể kết hợp API và logic tĩnh"""
    
    def name(self) -> Text:
        return "action_suggest_food"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        latest_message = tracker.latest_message.get('text', '').lower()
        
        # Xác định ngữ cảnh
        if any(word in latest_message for word in ['2 người', 'hai người', 'cặp đôi']):
            suggestion_text = self._suggest_for_2()
        elif any(word in latest_message for word in ['nhóm', 'đông', 'gia đình', '4 người', '5 người', '6 người']):
            suggestion_text = self._suggest_for_group()
        elif any(word in latest_message for word in ['rẻ', 'sinh viên', 'tiết kiệm', 'giá rẻ']):
            suggestion_text = self._suggest_cheap()
        else:
            # Mặc định gợi ý best-seller (có thể gọi API lấy món nổi bật)
            suggestion_text = self._suggest_popular()
        
        dispatcher.utter_message(text=suggestion_text)
        return []
    
    def _suggest_for_2(self) -> str:
        return """💑 **Gợi ý cho 2 người** (~300-400k):

🍲 **Combo Lẩu Đôi:**
• Lẩu Trường Thọ - 300k
• Gỏi Ngó Sen - 55k
• 2 Trà Cam Quế - 70k
💰 **Tổng: ~425k**

💡 Bạn có thể đặt bàn cho 2 người qua hotline: 0123.546.789"""

    def _suggest_for_group(self) -> str:
        return """👨‍👩‍👧‍👦 **Gợi ý cho nhóm 4-6 người** (~600-900k):

🍲 **Combo Gia Đình:**
• Lẩu Thập Cẩm - 200k
• Nem Cuốn - 150k
• Gỏi Nấm Sốt Thái - 50k
• Cơm Chiên Cốm Sen - 55k
• Bún Bò Huế x 2 - 90k
• Chè Hạt Sen x 3 - 147k
• Nước Ngọt x 6 - 120k
💰 **Tổng: ~812k**

✨ Đặt bàn trước để được giữ chỗ tốt nhất!"""

    def _suggest_cheap(self) -> str:
        return """💰 **Gợi ý món ngon giá rẻ** (dưới 50k):

🍜 **Món chính:**
• Cơm Chiên Thảo Mộc - 35k ⭐
• Bún Bò Huế - 45k
• Cơm Tấm Chay - 35k
• Hủ Tiếu Khô - 40k

🥤 **Đồ uống:**
• Cafe Đen - 25k
• Nước Suối - 15k

💡 Combo tiết kiệm: Cơm Chiên + Cafe = 60k no bụng!"""

    def _suggest_popular(self) -> str:
        return """⭐ **Top món best-seller của Hương Sen:**

🥇 **Lẩu Trường Thọ** - 300k (Công thức 20 năm)
🥈 **Gỏi Ngó Sen** - 55k (Ngó sen Đồng Tháp)
🥉 **Bún Bò Huế Chay** - 45k (Chuẩn vị Huế)
4️⃣ **Chè Hạt Sen Yến** - 49k (Hạt sen Bá Thiện)
5️⃣ **Mì Ý Sốt Kem** - 60k (Sốt kem homemade)

Bạn muốn xem chi tiết món nào không?"""

# =========================
# ACTIONS - ĐẶT BÀN (RESERVATIONS)
# =========================

class ActionAskReservationQuantity(Action):
    """Hỏi số lượng đơn đặt bàn của user"""

    def name(self) -> Text:
        return "action_ask_reservation_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        user_name = get_user_id(tracker)  # giả sử user_id là guest_name

        if not user_name:
            dispatcher.utter_message(text="Bạn cần đăng nhập để xem lịch sử đặt bàn.")
            return []

        try:
            response = requests.get(f"{API_BASE}/public/reservations")
            if response.status_code == 200:
                reservations = response.json()  # danh sách reservations
                # Lọc theo guest_name
                user_reservations = [r for r in reservations if r.get("guest_name") == user_name]

                dispatcher.utter_message(
                    text=f"Bạn có **{len(user_reservations)}** đơn đặt bàn trong hệ thống."
                )
            else:
                dispatcher.utter_message(text="Không thể lấy thông tin đặt bàn. Vui lòng thử lại sau.")

        except requests.exceptions.RequestException:
            dispatcher.utter_message(text="Lỗi kết nối. Vui lòng thử lại sau.")

        return []

class ActionAskPendingReservationsQuantity(Action):
    """Hỏi số lượng đơn đang chờ xác nhận"""

    def name(self) -> Text:
        return "action_ask_pending_reservations_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        user_name = get_user_id(tracker)

        if not user_name:
            dispatcher.utter_message(text="Bạn cần đăng nhập để xem thông tin.")
            return []

        try:
            response = requests.get(f"{API_BASE}/public/reservations")
            if response.status_code == 200:
                reservations = response.json()
                # status 1 = pending, lọc theo guest_name
                pending = [r for r in reservations if r.get("guest_name") == user_name and r.get("status") == 1]

                if pending:
                    dispatcher.utter_message(
                        text=f"Bạn có **{len(pending)}** đơn đặt bàn đang chờ xác nhận."
                    )
                else:
                    dispatcher.utter_message(text="Bạn không có đơn đặt bàn nào đang chờ xác nhận.")
            else:
                dispatcher.utter_message(text="Không thể lấy thông tin. Vui lòng thử lại sau.")
        except requests.exceptions.RequestException:
            dispatcher.utter_message(text="Lỗi kết nối. Vui lòng thử lại sau.")

        return []

class ActionAskPreparingOrdersQuantity(Action):
    """Hỏi số lượng món đang chế biến (đơn hàng đang xử lý)"""

    def name(self) -> Text:
        return "action_ask_preparing_orders_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        user_name = get_user_id(tracker)

        if not user_name:
            dispatcher.utter_message(text="Bạn cần đăng nhập để xem thông tin đơn hàng.")
            return []

        try:
            response = requests.get(f"{API_BASE}/public/orders")
            if response.status_code == 200:
                orders = response.json()
                # status 0 = preparing
                preparing = [o for o in orders if o.get("guest_name") == user_name and o.get("status") == 0]

                if preparing:
                    dispatcher.utter_message(
                        text=f"Bạn có **{len(preparing)}** món đang chế biến."
                    )
                else:
                    dispatcher.utter_message(text="Hiện tại bạn không có món nào đang chờ.")
            else:
                dispatcher.utter_message(text="Không thể lấy thông tin. Vui lòng thử lại sau.")
        except requests.exceptions.RequestException:
            dispatcher.utter_message(text="Lỗi kết nối. Vui lòng thử lại sau.")

        return []
    

class ActionAskCompletedOrdersQuantity(Action):
    """Hỏi số lượng đơn đã hoàn thành"""

    def name(self) -> Text:
        return "action_ask_completed_orders_quantity"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        user_name = get_user_id(tracker)

        if not user_name:
            dispatcher.utter_message(text="Bạn cần đăng nhập để xem lịch sử.")
            return []

        try:
            response = requests.get(f"{API_BASE}/public/orders")
            if response.status_code == 200:
                orders = response.json()
                # status khác 0 là completed / done
                completed = [o for o in orders if o.get("guest_name") == user_name and o.get("status") != 0]

                dispatcher.utter_message(
                    text=f"Bạn có **{len(completed)}** đơn đã hoàn thành."
                )
            else:
                dispatcher.utter_message(text="Không thể lấy thông tin. Vui lòng thử lại sau.")
        except requests.exceptions.RequestException:
            dispatcher.utter_message(text="Lỗi kết nối. Vui lòng thử lại sau.")

        return []



class ActionShowTables(Action):
    """Hiển thị danh sách bàn ăn từ API /tables"""

    def name(self) -> Text:
        return "action_show_tables"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        try:
            response = requests.get(f"{API_BASE}/tables")  # API Postman
            if response.status_code == 200:
                data = response.json()
                tables = data.get("results", [])

                if not tables:
                    dispatcher.utter_message(text="Hiện tại chưa có bàn nào.")
                    return []

                message_lines = ["🍽️ **Danh sách bàn hiện có:**"]
                for t in tables:
                    status_text = "Trống" if t.get("status") == 1 else "Đã đặt"
                    guest_name = t.get("guest_name") or "-"
                    message_lines.append(
                        f"• Bàn {t.get('number')} (Sức chứa: {t.get('capacity')} người) - {status_text} - Khách: {guest_name}"
                    )

                dispatcher.utter_message(text="\n".join(message_lines))
            else:
                dispatcher.utter_message(text="Không thể lấy thông tin bàn ăn. Vui lòng thử lại sau.")

        except requests.exceptions.RequestException:
            dispatcher.utter_message(text="Lỗi kết nối API. Vui lòng thử lại sau.")

        return []
    

class ActionShowPromotions(Action):
    """Hiển thị danh sách khuyến mãi từ API /promotions"""

    def name(self) -> Text:
        return "action_show_promotions"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        try:
            response = requests.get(f"{API_BASE}/promotions")
            if response.status_code == 200:
                data = response.json()
                promotions = data.get("results", [])

                if not promotions:
                    dispatcher.utter_message(text="Hiện tại chưa có khuyến mãi nào.")
                    return []

                message_lines = ["🎉 **Danh sách khuyến mãi hiện có:**"]
                for promo in promotions:
                    promo_type = "Giảm theo %" if promo.get("type") == 0 else "Giảm theo tiền"
                    message_lines.append(
                        f"• Mã: {promo.get('code_name')} - Giảm: {promo.get('discount')}{'%' if promo.get('type')==0 else 'k'} - Số lượng: {promo.get('quantity')} - Hạn: {promo.get('valid_to')[:10]} → {promo.get('valid_to')[:10]}"
                    )

                dispatcher.utter_message(text="\n".join(message_lines))
            else:
                dispatcher.utter_message(text="Không thể lấy danh sách khuyến mãi. Vui lòng thử lại sau.")

        except requests.exceptions.RequestException:
            dispatcher.utter_message(text="Lỗi kết nối API. Vui lòng thử lại sau.")

        return []