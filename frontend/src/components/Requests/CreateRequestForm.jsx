import { useState, useEffect } from "react";
import closeIcon from '@/assets/cross.svg';
import './RequestForm.css';
import { createRequest } from '@/api/requests.js';
import { getEmployees } from "@/api/requests.js"

const CreateRequestForm = ({ onClose }) => {
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    const loadData = async () => {
    try {
        const response = await getEmployees();
        formData.responsible_id = response.at(0).id;
        setEmployees(response);        
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
    responsible_id: "",
    factory_name: localStorage.getItem("userAccessLevel") != "Пользователь" ? "СЭЗ" : "",
    comment: "",
    department: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
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
                name="factory_name"
                value={formData.factory_name}
                onChange={handleInputChange}
              >
                  <option value="СЭЗ">СЭЗ</option>
                  <option value="ЛЭЗ">ЛЭЗ</option>
                  <option value="ВЭМЗ">ВЭМЗ</option>
                  <option value="ВЗТО">ВЗТО</option>
                  <option value="АЛВЭМЗ">АЛВЭМЗ</option>
                  <option value="ЭЛЕКТРОМАШ">ЭЛЕКТРОМАШ</option>
                  <option value="СЭЗ-ЭНЕРГО">СЭЗ-ЭНЕРГО</option>
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