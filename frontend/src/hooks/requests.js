import { useState, useEffect } from "react";

import { getRequests } from "@/api/requests.js";

export const useRequests = () => {
    const [requests, setRequests] = useState([]);

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

    return {
        requests,
    };
};