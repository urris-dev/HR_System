import "./Requests.css";
import RequestItem from './RequestItem.jsx';
import { useRequests } from '@/hooks/requests.js';
import CreateRequestForm from './CreateRequestForm.jsx';
import EditRequestForm from "./EditRequestForm.jsx";

export const RequestsList = () => {
    const {
        requests,
        isModalOpen,
        editingRequest,
        openCreateModal,
        openEditModal,
        closeModal,
    } = useRequests();

    return <>
        <div className="requests-list__title">
            <span>Заявки</span>
            <button className="add-request-btn" onClick={openCreateModal}>Добавить заявку</button>
        </div>
        <form className="requests-list__filters">
            <div className="filters__position-search">
                <input type="text" placeholder="Название должности"/>
                <button>Поиск</button>
            </div>
            <div className="filters__categories">
                {localStorage.getItem("userAccessLevel") != "Пользователь" && (
                    <select name="factory_name">
                    <option selected disabled>Завод</option>
                    <option value="СЭЗ">СЭЗ</option>
                    <option value="ЛЭЗ">ЛЭЗ</option>
                    <option value="ВЭМЗ">ВЭМЗ</option>
                    <option value="ВЗТО">ВЗТО</option>
                    <option value="АЛВЭМЗ">АЛВЭМЗ</option>
                    <option value="ЭЛЕКТРОМАШ">ЭЛЕКТРОМАШ</option>
                    <option value="СЭЗ-ЭНЕРГО">СЭЗ-ЭНЕРГО</option>
                </select>
                )}
                <select name="criticality">
                    <option selected disabled>Критичность</option>
                    <option value="false">Низкая</option>
                    <option value="true">Высокая</option>
                </select>
                <select name="status">
                    <option selected disabled>Статус</option>
                    <option value="Открыта">Открыта</option>
                    <option value="В работе">В работе</option>
                    <option value="Закрыта">Закрыта</option>
                </select>
                <button className="apply-filters">Применить фильтр</button>
                <button className="reset-filters">Сбросить фильтр</button>
            </div>
        </form>
        <table className="requests-list">
            <thead className="requests-list__headers">
                <tr>
                {localStorage.getItem("userAccessLevel") != "Пользователь" && (  
                    <th>Завод</th>
                )}
                    <th>Подразделение</th>
                    <th>Должность</th>
                    <th>
                        <div className="headers__criticality">Критичность</div>
                    </th>
                    <th>
                        <div className="headers__status">Статус</div>
                    </th>
                    <th>Ответственный</th>
                    <th>Дата создания</th>
                    <th>Дата закрытия</th>
                </tr>
            </thead>
            <tbody>
                {requests.map((req, index) => (
                <RequestItem key={index} request={req} onClick={() => openEditModal(index)}/>
                ))}
            </tbody>
        </table>
        {!editingRequest && isModalOpen && 
            <CreateRequestForm
            onClose={closeModal}
            />
        }
        {editingRequest && isModalOpen && 
            <EditRequestForm
            onClose={closeModal}
            requestData={editingRequest}
            />
        }
    </>
}