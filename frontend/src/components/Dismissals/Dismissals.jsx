import "./Dismissals.css";
import DismissalItem from './DismissalItem.jsx';
import { useDismissals } from '@/hooks/dismissals.js';
import CreateDismissalForm from './CreateDismissalForm.jsx';
import EditDismissalForm from "./EditDismissalForm.jsx";
import closeIcon from '@/assets/white_cross.svg';

export const DismissalsList = () => {
    const {
        dismissals,
        isModalOpen,
        editingDismissal,
        openCreateModal,
        openEditModal,
        closeModal,
        handleFilterChange,
        handleApplyFilters,
        handleResetFilters
    } = useDismissals();

    return <>
        <div className="dismissals-list__title">
            <span>Увольнения</span>
            <button className="add-dismissal-btn" onClick={openCreateModal}>Добавить увольнение</button>
        </div>
        <form className="dismissals-list__filters">
            <div className="filters__position-search">
                <input type="text" name="position" placeholder="Название должности" onChange={handleFilterChange}/>
                <button onClick={handleApplyFilters}>Поиск</button>
            </div>
            <div className="filters__categories">
                {localStorage.getItem("userAccessLevel") != "Пользователь" && (
                    <select name="factory_name" onChange={handleFilterChange}>
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
                <select name="criticality" onChange={handleFilterChange}>
                    <option selected disabled>Критичность</option>
                    <option value="false">Низкая</option>
                    <option value="true">Высокая</option>
                </select>
                <button className="apply-filters" onClick={handleApplyFilters}>Применить фильтры</button>
                <button className="reset-filters" onClick={handleResetFilters}><img src={closeIcon} alt="x" /></button>
            </div>
        </form>
        <table className="dismissals-list">
            <thead className="dismissals-list__headers">
                <tr>
                {localStorage.getItem("userAccessLevel") != "Пользователь" && (  
                    <th>Завод</th>
                )}
                    <th>Подразделение</th>
                    <th>Должность</th>
                    <th>
                        <div className="headers__criticality">Критичность</div>
                    </th>
                    <th>ФИО</th>
                    <th>Дата создания</th>
                    <th>Дата увольнения</th>
                    <th>Причина увольнения</th>
                </tr>
            </thead>
            <tbody>
                {dismissals.map((req, index) => (
                <DismissalItem key={index} dismissal={req} onClick={() => openEditModal(index)}/>
                ))}
            </tbody>
        </table>
        {!editingDismissal && isModalOpen && 
            <CreateDismissalForm
            onClose={closeModal}
            />
        }
        {editingDismissal && isModalOpen && 
            <EditDismissalForm
            onClose={closeModal}
            dismissalData={editingDismissal}
            />
        }
    </>
}