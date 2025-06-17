import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import closeIcon from '@/assets/cross.svg';
import './EmployeeForm.css';
import { editEmployee } from '@/api/employees.js';
import { getFactories } from '@/api/data.js';

const EditEmployeeForm = ({ onClose, employeeData }) => {
  let navigate = useNavigate();
  const [factories, setFactories] = useState([]);
    useEffect(() => {
      const loadData = async () => {
      try {
          const response = await getFactories();
          for (let item of response) {
            if (item.name == employeeData.factory_name) {
                formData.factory_id = item.id;
            }
          }
          setFactories(response);
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
    id: employeeData.id,
    fio: employeeData.fio,
    email: employeeData.email,
    password: "",
    factory_id: 0,
    access_level: employeeData.access_level,
    status: employeeData.status == "Активный" ? true : false,
  });
  const [changedFields, setChangedFields] = useState([]);

  const [passwordType, setPasswordType] = useState('password');
  function switchPasswordVisibility() {
    passwordType == 'password' ? setPasswordType('text') : setPasswordType('password'); 
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setChangedFields(changedFields.concat([e.target.name]));
  };

  function validateForm() {
    let fioValidate, emailValidate, passwordValidate;
    if (changedFields.includes("fio")) {fioValidate = formData.fio.length <= 100;} 
    if (changedFields.includes("email")) {emailValidate = formData.email.length <= 256};
    if (changedFields.includes("password")) {passwordValidate = formData.password.length >= 8 && formData.password.length <= 60};

    return fioValidate || emailValidate || passwordValidate;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    let payload = {id: formData.id};
    for (let key of Object.keys(formData)) {
      if (changedFields.includes(key)) {
        payload[key] = formData[key];
      }
    }
    
    if (validateForm()) {
        if (Object.keys(payload).length == 1) {
          alert("Измените хотя бы одно из полей");
        } else {
          try {
            await editEmployee(payload, changedFields);
            alert("Сотрудник успешно отредактирован!");
            window.location.reload();
          } catch (err) {
            if (err.message == 'Unauthorized') {
              navigate('/login');
            } else {
              alert(err.message);
            }
          }
        }
    } else {
      alert("Ошибка входных данных");
    }

    setLoading(false);
  };

  return (
    <div className="employee-modal-overlay">
      <div className="employee-modal-content">
        <div className="employee-modal-title">
            <span>Редактирование сотрудника</span>
            <button className="close-btn" onClick={onClose}>
                <img src={closeIcon} alt="x"/>
            </button>
        </div>
        <form className="employee-modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ФИО</label>
            <input
              type="text"
              name="fio"
              value={formData.fio}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Почта</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input
              type={passwordType}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <span>Пароль должен содержать от 8 до 60 символов</span>
            <div className="show-password">
              <input
                type="checkbox"
                id="showPassword"
                onClick={switchPasswordVisibility}
                />
              <label htmlFor="showPassword">Показать пароль</label>
            </div>
          </div>
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
          <div className="form-group">
            <label>Уровень доступа</label>
            <select
              name="access_level"
              value={formData.access_level}
              onChange={handleInputChange}
            >
              <option value="Пользователь">Пользователь</option>
              <option value="Админ">Админ</option>
              <option value="Суперадмин">Суперадмин</option>
            </select>
          </div>
          <div className="form-group">
            <label>Статус</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="true">Активный</option>
              <option value="false">Неактивный</option>
            </select>
          </div>
        <button type="submit" className="submit-btn">
            {loading ? "Загрузка" : "Отредактировать сотрудника"}
        </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeForm;