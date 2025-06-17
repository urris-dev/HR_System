import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import { getEmployees } from "@/api/employees.js";

export const useEmployees = () => {
    let navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    useEffect(() => {
        const loadData = async () => {
        try {
            const response = await getEmployees();
            setEmployees(response.map(value => {return {...value, status: value.status ? "Активный" : "Неактивный"}}))
        } catch (err) {
            if (err.message == 'Unauthorized') {
                navigate('/login');
            }
        }
        };
        loadData();
    }, []);

    const openCreateModal = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };
    
    const openEditModal = (index) => {
        setEditingEmployee(employees.at(index));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return {
        employees,
        editingEmployee,
        isModalOpen,
        openCreateModal,
        openEditModal,
        closeModal
    };
};