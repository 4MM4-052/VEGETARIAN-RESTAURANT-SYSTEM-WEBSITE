import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Card,
    CardContent,
    Typography,
} from '@mui/material';

const DialogChangedishes = ({ open, onReject, onClose, changedishes, deposit, onConfirm }) => {
    const dishesArray = Array.isArray(changedishes) ? changedishes : JSON.parse(changedishes || '[]');

    // Tính toán tổng tiền, thuế và giảm giá
    const totalAmount = dishesArray.reduce((total, dish) => total + (dish.price * dish.quantity), 0);
    const totalTax = dishesArray.length > 0 ? dishesArray[0].taxMoney : 0;
    const totalDiscount = dishesArray.length > 0 ? dishesArray[0].reducedMoney : 0;
    const totalPayable = dishesArray.length > 0 ? dishesArray[0].total_amount : 0;
    const remainingAmount = totalPayable - deposit;
    const phanTramGiam = totalDiscount * 100 / totalAmount;

    const formatCurrency = (value) => {
        return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`;
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Thông tin thay đổi món</DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '300px' }}> {/* Thêm chiều cao cố định và cuộn */}
                    {dishesArray.map((dish, index) => (
                        <Card key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                            <img 
                                src={dish.productImage} 
                                alt={dish.productName} 
                                style={{ 
                                    width: '70px', 
                                    height: '70px', 
                                    margin: '10px', 
                                    borderRadius: '8px' // Bo góc nhẹ
                                }} 
                            />
                            <CardContent style={{ flexGrow: 1 }}>
                                <Typography variant="h6">{dish.productName}</Typography>
                                <Typography variant="body2">Giá: {formatCurrency(dish.price)}</Typography>
                                <Typography variant="body2">Số lượng: {dish.quantity}</Typography>
                                <Typography variant="body2">Tổng giá: {formatCurrency(dish.price * dish.quantity)}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div style={{ marginTop: '20px' }}>
                    <Typography variant="body1">Tạm tính: {formatCurrency(totalAmount)}</Typography>
                    <Typography variant="body1">Tiền thuế(10%): {formatCurrency(totalTax)}</Typography>
                    <Typography variant="body1">Tiền giảm giá({phanTramGiam}%): {formatCurrency(totalDiscount)}</Typography>
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                        Tổng tiền sau thay đổi: {formatCurrency(totalPayable)}
                    </Typography>
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                        Số tiền đã cọc: {formatCurrency(deposit)}
                    </Typography>
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                        Tiền còn lại khi đến ăn: {formatCurrency(remainingAmount)}
                    </Typography>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Đóng</Button>
                <Button onClick={onConfirm} color="primary">Xác nhận</Button>
                <Button onClick={onReject} color="primary">Không xác nhận</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogChangedishes;
