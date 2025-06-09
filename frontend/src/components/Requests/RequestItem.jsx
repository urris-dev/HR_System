import React from 'react';

const RequestItem = ({ request }) => {
  return (
        <tr className="requests_list__request">
          <td className="request-factory">{request.factory_name}</td>
          <td className="request-position">{request.position}</td>
          <td>
            <div className="request-criticality">{request.criticality}</div>
          </td>
          <td>
            <div className="request-status">{request.status}</div>
          </td>
          <td className="request-responsible">{request.responsible_name}</td>
        </tr>
  );
};

export default RequestItem;