import { useState, useEffect } from "react";
import closeIcon from '@/assets/cross.svg';
import './RequestForm.css';
import { editRequest } from '@/api/requests.js';
import { getEmployees, getFactories } from "@/api/data.js";

const EditRequestForm = ({ requestData, onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [factories, setFactories] = useState([]);
  useEffect(() => {
    const loadData = async () => {
    try {
        const response = await getEmployees();
        for (let item of response) {
            if (item.fio == requestData.responsible_name) {
                formData.responsible_id = item.id;
            }
        }

        const resp = await getFactories();
        for (let item of resp) {
          if (item.name == requestData.factory_name) {
              formData.factory_id = item.id;
          }
        }

        setEmployees(response);        
        setFactories(resp);        
    } catch (err) {
        if (err.message == 'Unauthorized') {
            navigate('/login');
        }
    }
    };
    loadData();
  }, []);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: requestData.id,
    position: requestData.position,
    criticality: requestData.criticality == "Низкая" ? "false" : "true",
    status: requestData.status,
    employee_fio: requestData.employee_fio || "",
    closing_type: requestData.closing_type || "",
    comment: requestData.comment || "",
    department: requestData.department,
    factory_id: "",
    responsible_id: ""
  });
  const [changedFields, setChangedFields] = useState([]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setChangedFields(changedFields.concat([e.target.name]));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    let payload = {id: formData.id};
    for (let key of Object.keys(formData)) {
      if (changedFields.includes(key)) {
        payload[key] = formData[key];
      }
    }
    if (Object.keys(payload).length == 1) {
      alert("Измените хотя бы одно из полей");
    } else { 
      try {
        await editRequest(payload, changedFields);
        alert("Заявка успешно отредактирована!");
        window.location.reload();
      } catch (err) {
        if (err.message == 'Unauthorized') {
          navigate('/login');
        } else {
          alert(err.message);
        }
      }
    }
      
    setLoading(false);
  };

  return (
    <div className="request-modal-overlay">
      <div className="request-modal-content">
        <div className="request-modal-title">
            <span>Редактирование заявки</span>
            <button className="close-btn" onClick={onClose}>
                <img src={closeIcon} alt="x"/>
            </button>
        </div>
        <form className="request-modal-form" onSubmit={handleSubmit} id="request-modal-form">
          {localStorage.getItem("userAccessLevel") != "Пользователь" && (
            <div className="form-group">
              <label>Завод</label>
              <select
                name="factory_id"
                value={formData.factory_id}
                onChange={handleInputChange}
              >
                {factories.map((fact, index) => (
                  <option key={index} value={fact.id}>{fact.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label>Подразделение</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Должность</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Критичность</label>
            <select
              name="criticality"
              value={formData.criticality}
              onChange={handleInputChange}
            >
              <option value="false">Низкая</option>
              <option value="true">Высокая</option>
            </select>
          </div>
          <div className="form-group">
            <label>Статус</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="Открыта">Открыта</option>
              <option value="В работе">В работе</option>
              <option value="Закрыта">Закрыта</option>
            </select>
          </div>
          <div className="form-group">
            <label>ФИО нанятого работника</label>
            <input
              type="text"
              name="employee_fio"
              value={formData.employee_fio}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Тип закрытия</label>
            <select
              name="closing_type"
              value={formData.closing_type}
              onChange={handleInputChange}
            >
              <option value="Найм">Найм</option>
              <option value="Аутсорс">Аутсорс</option>
            </select>
          </div>
          <div className="form-group">
            <label>Ответственный</label>
            <select
                name="responsible_id"
                value={formData.responsible_id}
                onChange={handleInputChange}
            >
                {employees.map((emp, index) => (
                <option key={index} value={emp.id}>{emp.fio}</option>
                ))}
            </select>
            </div>
          <div className="form-group">
            <label>Комментарий</label>
            <textarea 
                name="comment" 
                value={formData.comment}
                onChange={handleInputChange}>
            </textarea>
          </div>
        </form>
        <button type="submit" className="submit-btn" form="request-modal-form">
          {loading ? "Загрузка..." : "Отредактировать заявку"}
        </button>
      </div>
    </div>
  );
};

export default EditRequestForm;