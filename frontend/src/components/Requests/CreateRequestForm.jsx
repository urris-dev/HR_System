import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import closeIcon from '@/assets/cross.svg';
import './RequestForm.css';
import { createRequest } from '@/api/requests.js';
import { getEmployees, getFactories } from "@/api/data.js"

const CreateRequestForm = ({ onClose }) => {
  let navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [factories, setFactories] = useState([]);
  useEffect(() => {
    const loadData = async () => {
    try {
        const response = await getEmployees();
        formData.responsible_id = response.at(0).id;

        const resp = await getFactories();
        if (localStorage.getItem("userAccessLevel") != "Пользователь") {
          formData.factory_id = resp.at(0).id;
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
    position: "",
    criticality: "false",
    responsible_id: 0,
    factory_id: 0,
    comment: "",
    department: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  function validateForm() {
    let positionValidate = formData.position.length <= 100;
    let departmentValidate = formData.department.length <= 256;

    return positionValidate && departmentValidate;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Ошибка длины входных данных");
      return;
    } 

    setLoading(true);
    try {
      await createRequest(formData);
      alert("Заявка успешно создана!");
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
            <span>Новая заявка</span>
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
          {loading ? "Загрузка..." : "Добавить заявку"}
        </button>
      </div>
    </div>
  );
};

export default CreateRequestForm;