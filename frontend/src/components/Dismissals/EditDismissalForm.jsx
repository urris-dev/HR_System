import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import closeIcon from '@/assets/cross.svg';
import './DismissalForm.css';
import { editDismissal } from '@/api/dismissals.js';
import { getEmployees, getFactories } from "@/api/data.js";

const EditRequestForm = ({ dismissalData, onClose }) => {
  let navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [factories, setFactories] = useState([]);
  useEffect(() => {
    const loadData = async () => {
    try {
        const response = await getEmployees();
        for (let item of response) {
            if (item.fio == dismissalData.responsible_name) {
                formData.responsible_id = item.id;
            }
        }

        const resp = await getFactories();
        for (let item of resp) {
          if (item.name == dismissalData.factory_name) {
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
  const [day, month, year] = dismissalData.dismissal_date.split(".");
  const isoDate = `${year}-${month}-${day}`;
  const [formData, setFormData] = useState({
    id: dismissalData.id,
    factory_id: "",
    department: dismissalData.department,
    position: dismissalData.position,
    criticality: dismissalData.criticality == "Низкая" ? "false" : "true",
    hiring_form: dismissalData.hiring_form,
    dismissal_date: isoDate,
    employee_fio: dismissalData.employee_fio,
    dismissal_reason: dismissalData.dismissal_reason,
    responsible_id: "",
    comment: dismissalData.comment || "",
  });
  const [changedFields, setChangedFields] = useState(new Set());

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setChangedFields(changedFields.add(e.target.name));
  };

  function validateForm() {
    let departmentValidate, positionValidate, employeeValidate, dismissalValidate;

    if (changedFields.has("department")) {departmentValidate = formData.department.length <= 256;}
    if (changedFields.has("position")) {positionValidate = formData.position.length <= 100;}
    if (changedFields.has("employee_fio")) {employeeValidate = formData.employee_fio.length <= 100;}
    if (changedFields.has("dismissal_reason")) {dismissalValidate = formData.dismissal_reason.length <= 100;}

    return [departmentValidate, positionValidate, employeeValidate, dismissalValidate].every(st => st == true || st == undefined);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      alert("Ошибка длины входных данных");
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
        await editDismissal(payload, changedFields);
        alert("Увольнение успешно отредактировано!");
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
            <span>Редактирование увольнения</span>
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
          {loading ? "Загрузка..." : "Отредактировать увольнение"}
        </button>
      </div>
    </div>
  );
};

export default EditRequestForm;