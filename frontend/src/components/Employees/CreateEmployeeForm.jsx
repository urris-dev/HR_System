import { useState } from "react";
import closeIcon from '@/assets/cross.svg';
import './EmployeeForm.css';
import { createEmployee } from '@/api/employees.js';

const CreateEmployeeForm = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fio: "",
    email: "",
    password: "",
    factory_name: "СЭЗ",
    access_level: "Пользователь",
    status: "true",
  });

  const [passwordType, setPasswordType] = useState('password');
  function switchPasswordVisibility() {
    passwordType == 'password' ? setPasswordType('text') : setPasswordType('password'); 
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  function validateForm() {
    const fioValidate = formData.fio.length <= 100;
    const emailValidate = formData.email.length <= 256;
    const passwordValidate = formData.password.length >= 8 && formData.password.length <= 60;

    return fioValidate && emailValidate && passwordValidate;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (validateForm()) {
        try {
          await createEmployee(formData);
          alert("Сотрудник успешно создан!");
          window.location.reload();
        } catch (err) {
          if (err.message == 'Unauthorized') {
            navigate('/login');
          } else {
            alert(err.message);
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
            <span>Новый сотрудник</span>
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
              required
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
          <div className="form-group">
            <label>Уровень доступа</label>
            <select
              name="access_level"
              value={formData.access_level}
              onChange={handleInputChange}
            >
              <option value="Админ">Админ</option>
              <option value="Пользователь">Пользователь</option>
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
          {loading ? "Загрузка..." : "Добавить сотрудника"}
        </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployeeForm;