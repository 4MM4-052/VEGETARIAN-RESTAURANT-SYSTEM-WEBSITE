import AdminConfig from '../Config/index';
import Dashboard from '../Pages/Dashboard';
import Acount from '../Pages/Authentication/Acount';

import ProductList from '../Pages/Product/ProductList';
import ProductAdd from '../Pages/Product/ProductAdd';
import ProductEdit from '../Pages/Product/ProductEdit';
import ProductTamXoa from '../Pages/Product/ProductTamXoa';

import CategoryProduct from '../Pages/CategoryProduct/CategoryProductList';
import categoryProductAdd from '../Pages/CategoryProduct/CategoryProductAdd';
import categoryProductEdit from '../Pages/CategoryProduct/CategoryProductEdit';

import CategoryBlogList from '../Pages/CategoryBlog/CategoryBlogList';
import CategoryBlogAdd from '../Pages/CategoryBlog/CategoryBlogAdd';
import CategoryBlogEdit from '../Pages/CategoryBlog/CategoryBlogEdit';
import CategoryBlogDelete from '../Pages/CategoryBlog/CategoryBlogDelete';

import TableList from '../Pages/Tables/TableList';
import TableAdd from '../Pages/Tables/TableAdd';
import TableEdit from '../Pages/Tables/TableEdit';
import TableDelete from '../Pages/Tables/TableDelete';

import ReservationList from '../Pages/Reservations/ReservationList';
import ReservationAdd from '../Pages/Reservations/ReservationAdd';
import ReservationEdit from '../Pages/Reservations/ReservationEdit';
import ReservationDelete from '../Pages/Reservations/ReservationDelete';

import OrderList from '../Pages/Orders/OrderList';
import OrderAdd from '../Pages/Orders/OrderAdd';
import OrderEdit from '../Pages/Orders/OrderEdit';
import OrderDelete from '../Pages/Orders/OrderDelete';

import OrderDetailList from '../Pages/OrderDetails/OrderDetailList';
import OrderDetailAdd from '../Pages/OrderDetails/OrderDetailAdd';
import OrderDetailDelete from '../Pages/OrderDetails/OrderDetailDelete';

import PromotionList from '../Pages/Promotions/PromotionList';
import PromotionAdd from '../Pages/Promotions/PromotionAdd';
import PromotionEdit from '../Pages/Promotions/PromotionEdit';
import PromotionDelete from '../Pages/Promotions/PromotionDelete';

import PayMethodList from '../Pages/PayMethod/PayMethodList';
import PayMethodAdd from '../Pages/PayMethod/PayMethodAdd';
import PayMethodEdit from '../Pages/PayMethod/PayMethodEdit';
import PayMethodDelete from '../Pages/PayMethod/PayMethodDelete';

import CustomerGroupList from '../Pages/CustomerGroup/CustomerGroupList';
import CustomerGroupAdd from '../Pages/CustomerGroup/CustomerGroup';
import CustomerGroupEdit from '../Pages/CustomerGroup/CustomerGroupEdit';
import CustomerGroupDelete from '../Pages/CustomerGroup/CustomerGroupDelete';

import PlacesList from '../Pages/Places/PlacesList';
import PlacesAdd from '../Pages/Places/PlacesAdd';
import PlacesEdit from '../Pages/Places/PlacesEdit';
import PlacesDelete from '../Pages/Places/PlacesDelete';

import RolesList from '../Pages/Roles/RolesList';
import RolesAdd from '../Pages/Roles/RolesAdd';
import RolesEdit from '../Pages/Roles/RolesEdit';
import RolesDelete from '../Pages/Roles/RolesDelete';

import BlogList from '../Pages/Blog/BlogList';
import BlogAdd from '../Pages/Blog/BlogAdd';
import BlogEdit from '../Pages/Blog/BlogEdit';
import BlogDelete from '../Pages/Blog/BlogDelete';

import PermissionsList from '../Pages/Permissions/PermissionsList';

import CommentBlogList from '../Pages/CommentBlog/CommentBlogList';
import CommentBlogAdd from '../Pages/CommentBlog/CommentBlogAdd';
import CommentBlogEdit from '../Pages/CommentBlog/CommentBlogEdit';
import CommentBlogDelete from '../Pages/CommentBlog/CommentBlogDelete';

import UsersList from "../Pages/Users/UserList";
import UsersAdd from "../Pages/Users/UserAdd";
import UsersEdit from "../Pages/Users/UserEdit";
import UsersDelete from "../Pages/Users/UserDelete";

import UserChatsList from '../Pages/UserChats/UserChatsList';

import Review from '../Pages/CustomerPrediction/Review';
import Review1 from '../Pages/CustomerPrediction/Review1';

import CustomerPrediction from '../Pages/CustomerPrediction/CustomerPrediction';
import MenuPrediction from '../Pages/CustomerPrediction/MenuPrediction';

// Public routes
const publicAdminRoutes = [
    // *Admin routes
    { path: AdminConfig.routes.acount, component: Acount },
    { path: AdminConfig.routes.dashboard, component: Dashboard},

    { path: AdminConfig.routes.product, component: ProductList, permissions: ['Xem sản phẩm'] },
    { path: AdminConfig.routes.productAdd, component: ProductAdd, permissions: ['Thêm sản phẩm'] },
    { path: AdminConfig.routes.productEdit, component: ProductEdit, permissions: ['Sửa sản phẩm'] },
    { path: AdminConfig.routes.productTamXoa, component: ProductTamXoa, permissions: ['Khôi phục sản phẩm'] },

    { path: AdminConfig.routes.categoryProduct, component: CategoryProduct, permissions: ['Xem danh mục sản phẩm'] },
    { path: AdminConfig.routes.categoryProductAdd, component: categoryProductAdd, permissions: ['Thêm danh mục sản phẩm'] },
    { path: AdminConfig.routes.categoryProductEdit, component: categoryProductEdit, permissions: ['Sửa danh mục sản phẩm'] },

    { path: AdminConfig.routes.blog, component: BlogList, permissions: ['Xem bài viết'] },
    { path: AdminConfig.routes.blogAdd, component: BlogAdd, permissions: ['Thêm bài viết'] },
    { path: AdminConfig.routes.blogEdit, component: BlogEdit, permissions: ['Sửa bài viết'] },
    { path: AdminConfig.routes.blogDelete, component: BlogDelete },

    { path: AdminConfig.routes.categoryBlog, component: CategoryBlogList, permissions: ['Xem danh mục bài viết'] },
    { path: AdminConfig.routes.categoryBlogAdd, component: CategoryBlogAdd, permissions: ['Thêm danh mục bài viết'] },
    { path: AdminConfig.routes.categoryBlogEdit, component: CategoryBlogEdit, permissions: ['Sửa danh mục bài viết'] },
    { path: AdminConfig.routes.categoryBlogDelete, component: CategoryBlogDelete },

    { path: AdminConfig.routes.table, component: TableList, permissions: ['Xem bàn ăn'] },
    { path: AdminConfig.routes.tableAdd, component: TableAdd },
    { path: AdminConfig.routes.tableEdit, component: TableEdit },
    { path: AdminConfig.routes.tableDelete, component: TableDelete },

    { path: AdminConfig.routes.reservation, component: ReservationList, permissions: ['Xem đặt bàn'] },
    { path: AdminConfig.routes.reservationAdd, component: ReservationAdd, permissions: ['Thêm đặt bàn'] },
    { path: AdminConfig.routes.reservationEdit, component: ReservationEdit, permissions: ['Sửa đặt bàn'] },
    { path: AdminConfig.routes.reservationDelete, component: ReservationDelete },

    { path: AdminConfig.routes.order, component: OrderList },
    { path: AdminConfig.routes.orderAdd, component: OrderAdd },
    { path: AdminConfig.routes.orderEdit, component: OrderEdit },
    { path: AdminConfig.routes.orderDelete, component: OrderDelete },

    { path: AdminConfig.routes.orderDetail, component: OrderDetailList },
    { path: AdminConfig.routes.orderDetailAdd, component: OrderDetailAdd },
    { path: AdminConfig.routes.orderDetailDelete, component: OrderDetailDelete },

    { path: AdminConfig.routes.promotion, component: PromotionList, permissions: ['Xem mã khuyến mãi'] },
    { path: AdminConfig.routes.promotionAdd, component: PromotionAdd, permissions: ['Thêm mã khuyến mãi'] },
    { path: AdminConfig.routes.promotionEdit, component: PromotionEdit, permissions: ['Sửa mã khuyến mãi'] },
    { path: AdminConfig.routes.promotionDelete, component: PromotionDelete },

    { path: AdminConfig.routes.payMethod, component: PayMethodList },
    { path: AdminConfig.routes.payMethodAdd, component: PayMethodAdd },
    { path: AdminConfig.routes.payMethodEdit, component: PayMethodEdit },
    { path: AdminConfig.routes.payMethodDelete, component: PayMethodDelete },

    { path: AdminConfig.routes.customerGroup, component: CustomerGroupList },
    { path: AdminConfig.routes.customerGroupAdd, component: CustomerGroupAdd },
    { path: AdminConfig.routes.customerGroupEdit, component: CustomerGroupEdit },
    { path: AdminConfig.routes.customerGroupDelete, component: CustomerGroupDelete },

    { path: AdminConfig.routes.places, component: PlacesList },
    { path: AdminConfig.routes.placesAdd, component: PlacesAdd },
    { path: AdminConfig.routes.placesEdit, component: PlacesEdit },
    { path: AdminConfig.routes.placesDelete, component: PlacesDelete },

    { path: AdminConfig.routes.role, component: RolesList, permissions: ['Xem vai trò'] },
    { path: AdminConfig.routes.roleAdd, component: RolesAdd, permissions: ['Thêm vai trò'] },
    { path: AdminConfig.routes.roleEdit, component: RolesEdit, permissions: ['Sửa vai trò'] },
    { path: AdminConfig.routes.roleDelete, component: RolesDelete },

    { path: AdminConfig.routes.permissions, component: PermissionsList, permissions: ['Phân quyền'] },

    { path: AdminConfig.routes.commentBlogView, component: CommentBlogList, permissions: ['Xem bình luận bài viết']},
    { path: AdminConfig.routes.commentBlog, component: CommentBlogList, permissions: ['Xem bình luận bài viết'] },
    { path: AdminConfig.routes.commentBlogAdd, component: CommentBlogAdd },
    { path: AdminConfig.routes.commentBlogEdit, component: CommentBlogEdit },
    { path: AdminConfig.routes.commentBlogDelete, component: CommentBlogDelete },

    { path: AdminConfig.routes.users, component: UsersList, permissions: ['Xem tài khoản'] },
    { path: AdminConfig.routes.usersAdd, component: UsersAdd, permissions: ['Thêm tài khoản'] },
    { path: AdminConfig.routes.usersEdit, component: UsersEdit, permissions: ['Sửa tài khoản'] },
    { path: AdminConfig.routes.usersDelete, component: UsersDelete, permissions: ['Xóa tài khoản'] },

    { path: AdminConfig.routes.userChats, component: UserChatsList, permissions: ['Tư vấn khách hàng'] },

    {
        path: '/customer-prediction',
        component: CustomerPrediction,
        // permissions: ['Dự đoán khách hàng'] // nếu muốn bảo vệ bằng quyền
    },

    {
        path: '/menu-prediction',
        component: MenuPrediction,
        // permissions: ['Dự đoán món ăn'] // nếu muốn bảo vệ quyền
    },
    {
        path: '/Review',
        component: Review,
        // permissions: ['Dự đoán món ăn'] // nếu muốn bảo vệ quyền
    },
    {
        path: '/Review1',
        component: Review1,
        // permissions: ['Dự đoán món ăn'] // nếu muốn bảo vệ quyền
    },

];

export { publicAdminRoutes };
