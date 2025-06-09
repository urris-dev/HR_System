import "./Employees.css";
import EmployeeItem from './EmployeeItem.jsx';
import { useEmployees } from '@/hooks/employees.js';
import CreateEmployeeForm from "./CreateEmployeeForm.jsx";
import EditEmployeeForm from "./EditEmployeeForm.jsx";

export const EmployeesList = () => {
    const { 
        employees,
        editingEmployee,
        isModalOpen,
        openCreateModal,
        openEditModal,
        closeModal
    } = useEmployees();

    return <>
        <div className="employees-list__title">
            <span>Сотрудники</span>
            <button className="add-employee-btn" onClick={openCreateModal}>Добавить сотрудника</button>
        </div>
        <table className="employees-list">
            <thead className="employee-list__headers">
                <tr>
                    <th>ФИО</th>
                    <th>Почта</th>
                    <th>Завод</th>
                    <th>
                        <div className="headers__access-level">Уровень доступа</div>
                    </th>
                    <th>
                        <div className="headers__status">Статус</div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {employees.map((emp, index) => (
                <EmployeeItem key={index} employee={emp} onClick={() => openEditModal(index)} />
                ))}
            </tbody>
        </table>
        {!editingEmployee && isModalOpen && 
            <CreateEmployeeForm
            onClose={closeModal}
            />
        }
        {editingEmployee && isModalOpen && 
            <EditEmployeeForm
            onClose={closeModal}
            employeeData={editingEmployee}
            />
        }
    </>
}