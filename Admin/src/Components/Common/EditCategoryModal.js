import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box
} from '@mui/material';

export default function EditCategoryModal({ open, onClose, category, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        status: ''
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                status: category.status
            });
        }
    }, [category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                Chỉnh sửa danh mục
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Tên danh mục"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                label="Trạng thái"
                                required
                            >
                                <MenuItem value={1}>Hoạt động</MenuItem>
                                <MenuItem value={0}>Ngưng hoạt động</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="inherit">
                        Hủy
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Lưu thay đổi
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
