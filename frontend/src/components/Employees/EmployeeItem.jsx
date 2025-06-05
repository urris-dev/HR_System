import React from 'react';

const EmployeeItem = ({ employee, onClick }) => {
  return (
        <tr className="employees_list__employee" onClick={onClick}>
          <td className="employee-fio">{employee.fio}</td>
          <td className="employee-email">{employee.email}</td>
          <td className="employee-factory">{employee.factory_name}</td>
          <td>
            <div className="employee-aceess-level">{employee.access_level}</div>
          </td>
          <td>
            <div className="employee-status">{employee.status}</div>
          </td>
        </tr>
  );
};

export default EmployeeItem;