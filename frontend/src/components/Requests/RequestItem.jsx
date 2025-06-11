import React from 'react';

const RequestItem = ({ request, onClick }) => {
  return (
        <tr className="requests_list__request" onClick={onClick}>
          {localStorage.getItem("userAccessLevel") != "Пользователь" && (
            <td className="request-factory">{request.factory_name}</td>
          )}
          <td className="request-department">{request.department}</td>
          <td className="request-position">{request.position}</td>
          <td>
            <div className="request-criticality">{request.criticality}</div>
          </td>
          <td>
            <div className="request-status">{request.status}</div>
          </td>
          <td className="request-responsible">{request.responsible_name}</td>
          <td className="request-creation_date">{request.creation_date}</td>
          <td className="request-closing_date">{request.closing_date}</td>
        </tr>
  );
};

export default RequestItem;