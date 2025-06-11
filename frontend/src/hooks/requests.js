import { useState, useEffect } from "react";

import { getRequests } from "@/api/requests.js";

export const useRequests = () => {
    const [requests, setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);

    useEffect(() => {
        const loadData = async () => {
        try {
            const response = await getRequests();
            setRequests(response.map(value => {return {...value, criticality: value.criticality ? "Высокая" : "Низкая"}}))
        } catch (err) {
            if (err.message == 'Unauthorized') {
                navigate('/login');
            }
        }
        };
        loadData();
    }, []);

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
        closeModal
    };
};