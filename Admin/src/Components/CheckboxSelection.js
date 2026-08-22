// useCheckboxSelection.js
import { useState } from 'react';

export default function useCheckboxSelection(items, onDelete) {
    const [selectedItems, setSelectedItems] = useState([]);

    // Hàm để chọn một mục
    const handleSelectItem = (itemId) => {
        setSelectedItems(prevSelected =>
            prevSelected.includes(itemId)
                ? prevSelected.filter(id => id !== itemId)
                : [...prevSelected, itemId]
        );
    };

    // Hàm để chọn tất cả mục
    const handleSelectAll = () => {
        setSelectedItems(
            selectedItems.length === items.length ? [] : items.map(item => item.id)
        );
    };

    // Hàm để xóa các mục đã chọn
    const handleDeleteSelected = async () => {
        await onDelete(selectedItems);
        setSelectedItems([]); // Reset sau khi xóa
    };

    return {
        selectedItems,
        handleSelectItem,
        handleSelectAll,
        handleDeleteSelected,
        allSelected: selectedItems.length === items.length,
    };
}
