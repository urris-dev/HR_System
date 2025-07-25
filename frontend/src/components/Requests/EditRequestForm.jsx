import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import closeIcon from '@/assets/cross.svg';
import './RequestForm.css';
import { editRequest } from '@/api/requests.js';
import { getEmployees, getFactories } from "@/api/data.js";

const EditRequestForm = ({ requestData, onClose }) => {
  let navigate = useNavigate();
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
    hiring_form: requestData.hiring_form || "Штат",
    employee_fio: requestData.employee_fio || "",
    comment: requestData.comment || "",
    department: requestData.department,
    factory_id: "",
    responsible_id: ""
  });
  const [changedFields, setChangedFields] = useState(new Set());

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setChangedFields(changedFields.add(e.target.name));
  };

  const handleStatusChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.value != 'Открыта') {
      setChangedFields(changedFields.add('status'));
      setChangedFields(changedFields.add('hiring_form'));
      document.getElementsByName('employee_fio').item(0).setAttribute("required", "");
    } else {
      setChangedFields(changedFields.add('status'));
      changedFields.delete('hiring_form');
      document.getElementsByName('employee_fio').item(0).removeAttribute("required");
    }
  }

  function validateForm() {
    let positionValidate, departmentValidate, employeeValidate;
    if (changedFields.has("position")) {positionValidate = formData.position.length <= 100;}
    if (changedFields.has("department")) {departmentValidate = formData.department.length <= 256;}
    if (changedFields.has("employee_fio")) {employeeValidate = formData.employee_fio.length <= 100;}

    return [positionValidate, departmentValidate, employeeValidate].every(st => st == true || st == undefined);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      alert("Ошибка входных данных");
      return;
    }

    if (changedFields.size == 0) {
      alert("Измените хотя бы одно из полей");
      return;
    }

    setLoading(true);
    let payload = {id: formData.id};
    for (let key of Object.keys(formData)) {
      if (changedFields.has(key)) {
        payload[key] = formData[key];
      }
    }

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
              onChange={handleStatusChange}
            >
              <option value="Открыта">Открыта</option>
              <option value="В работе">В работе</option>
              <option value="Закрыта">Закрыта</option>
            </select>
          </div>
          <div className="form-group">
            <label>Форма найма</label>
            <select
              name="hiring_form"
              value={formData.hiring_form}
              onChange={handleInputChange}
            >
              <option value="Штат">Штат</option>
              <option value="Договор ГПХ">Договор ГПХ</option>
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