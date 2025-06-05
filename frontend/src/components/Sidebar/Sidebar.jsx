import React from "react";
import CompanyLogo from '@/assets/company.svg';
import RequestIcon from '@/assets/request.svg';
import DismissalIcon from '@/assets/dismissal.svg';
import EmployeesIcon from '@/assets/employees.svg';
import ProfileIcon from '@/assets/profile.svg';
import './Sidebar.css';

export const Sidebar = () => {
  const userAccessLevel = localStorage.getItem("userAccessLevel");

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="company-logo">
          <img src={CompanyLogo} alt="РУСЭЛПРОМ" />
        </div>
        
        <ul className="sidebar__options">
            <li>
              <a href="#" className="option">
                <img src={RequestIcon} alt="+"/>
                ЗАЯВКИ
              </a>
            </li>
            <li>
              <a href="#" className="option">
                <img src={DismissalIcon} alt="-"/>
                УВОЛЬНЕНИЯ
              </a>
            </li>
            {userAccessLevel != "user" &&
              <li>
                <a href="#" className="option">
                  <img src={EmployeesIcon} alt="/\"/>
                  СОТРУДНИКИ
                </a>
              </li>
            }
          </ul>
      </div>
      
      <div className="sidebar__footer">
        <a href="#" className="profile">
          <img src={ProfileIcon} alt="/\"/>
          <span>ПРОФИЛЬ</span>
        </a>
      </div>
    </aside>
  );
};