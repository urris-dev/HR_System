import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import closeIcon from '@/assets/cross.svg';
import './DismissalForm.css';
import { createDismissal } from '@/api/dismissals.js';
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
    factory_id: 0,
    department: "",
    position: "",
    criticality: "false",
    hiring_form: "Штат",
    dismissal_date: "",
    employee_fio: "",
    dismissal_reason: "",
    responsible_id: 0,
    comment: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  function validateForm() {
    let departmentValidate = formData.department.length <= 256;
    let positionValidate = formData.position.length <= 100;
    let employeeValidate = formData.employee_fio.length <= 100;
    let dismissalValidate = formData.dismissal_reason.length <= 100;

    return departmentValidate && positionValidate && employeeValidate && dismissalValidate;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Ошибка длины входных данных");
      return;
    } 

    setLoading(true);
    try {
      await createDismissal(formData);
      alert("Увольнение успешно создано!");
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
    <div className="dismissal-modal-overlay">
      <div className="dismissal-modal-content">
        <div className="dismissal-modal-title">
            <span>Новое увольнение</span>
            <button className="close-btn" onClick={onClose}>
                <img src={closeIcon} alt="x"/>
            </button>
        </div>
        <form className="dismissal-modal-form" onSubmit={handleSubmit} id="dismissal-modal-form">
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
            <label>Дата увольнения</label>
            <input
              type="date"
              name="dismissal_date"
              value={formData.dismissal_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>ФИО увольняемого работника</label>
            <input
              type="text"
              name="employee_fio"
              value={formData.employee_fio}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Причина увольнения</label>
            <input
              type="text"
              name="dismissal_reason"
              value={formData.dismissal_reason}
              onChange={handleInputChange}
              required
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
        <button type="submit" className="submit-btn" form="dismissal-modal-form">
          {loading ? "Загрузка..." : "Добавить увольнение"}
        </button>
      </div>
    </div>
  );
};

export default CreateRequestForm;