import React from 'react';

const DismissalItem = ({ dismissal, onClick }) => {
  return (
        <tr className="dismissals_list__dismissal" onClick={onClick}>
          {localStorage.getItem("userAccessLevel") != "Пользователь" && (
            <td className="dismissal-factory">{dismissal.factory_name}</td>
          )}
          <td className="dismissal-department">{dismissal.department}</td>
          <td className="dismissal-position">{dismissal.position}</td>
          <td>
            <div className="dismissal-criticality">{dismissal.criticality}</div>
          </td>
          <td className="dismissal-responsible">{dismissal.responsible_name}</td>
          <td className="dismissal-creation_date">{dismissal.creation_date}</td>
          <td className="dismissal-dismissal_date">{dismissal.dismissal_date}</td>
          <td className="dismissal-dismissal_reason">{dismissal.dismissal_reason}</td>
        </tr>
  );
};

export default DismissalItem;