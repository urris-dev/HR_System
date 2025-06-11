import { useState, useEffect } from "react";

import { getRequests } from "@/api/requests.js";

export const useRequests = () => {
    const [requests, setRequests] = useState([]);    
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
            const response = await getRequests(filters, filterableFields);
            setRequests(response.map(value => {return {...value, criticality: value.criticality ? "Высокая" : "Низкая"}}))
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
    const [editingRequest, setEditingRequest] = useState(null);

    const openCreateModal = () => {
        setEditingRequest(null);
        setIsModalOpen(true);
    };

    const openEditModal = (index) => {
        setEditingRequest(requests.at(index));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return {
        requests,
        isModalOpen,
        editingRequest,
        openCreateModal,
        openEditModal,
        closeModal,
        handleFilterChange,
        handleApplyFilters,
        handleResetFilters
    };
};