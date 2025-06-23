import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import { getDismissals } from "@/api/dismissals.js";

export const useDismissals = () => {
    let navigate = useNavigate();
    const [dismissals, setDismissals] = useState([]);    
    const [filters, setFilters] = useState({});
    const [filterableFields, setFilterableFields] = useState(new Set());

    function handleFilterChange(event) {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value,
        });
        setFilterableFields(filterableFields.add(event.target.name));
    }

    async function handleApplyFilters(e) {
        e.preventDefault();

        try {
            const response = await getDismissals(filters, filterableFields);
            setDismissals(response.map(value => {return {...value, criticality: value.criticality ? "Высокая" : "Низкая"}}))
        } catch (err) {
            if (err.message == 'Unauthorized') {
                navigate('/login');
            }
        }
    }

    function handleResetFilters(e) {
        e.preventDefault();
        window.location.reload();
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDismissal, setEditingDismissal] = useState(null);

    const openCreateModal = () => {
        setEditingDismissal(null);
        setIsModalOpen(true);
    };

    const openEditModal = (index) => {
        setEditingDismissal(dismissals.at(index));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return {
        dismissals,
        isModalOpen,
        editingDismissal,
        openCreateModal,
        openEditModal,
        closeModal,
        handleFilterChange,
        handleApplyFilters,
        handleResetFilters
    };
};