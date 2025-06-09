import React, { useEffect } from 'react';
import CompanyLogo from '@/assets/company.svg';
import RequestIcon from '@/assets/request.svg';
import DismissalIcon from '@/assets/dismissal.svg';
import EmployeesIcon from '@/assets/employees.svg';
import LogoutIcon from '@/assets/logout.svg';
import './Sidebar.css';
import { useSidebar } from "@/hooks/sidebar";

export const Sidebar = ({activeTab, changeActiveTab}) => {
  const { handleLogout, checkLogged } = useSidebar();
  useEffect(() => 
    checkLogged()
  )

  const userAccessLevel = localStorage.getItem("userAccessLevel");

  function handleOptionClick(tab) {
    document.getElementById(activeTab)?.removeAttribute("clicked");
    document.getElementById(tab).setAttribute("clicked", "");
    changeActiveTab(tab);
  }

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className="company-logo">
          <img src={CompanyLogo} alt="РУСЭЛПРОМ" />
        </div>
        
        <ul className="sidebar__options">
            <li>
              <a className="option" id="requests" onClick={() => handleOptionClick("requests")}>
                <img src={RequestIcon} alt="+"/>
                ЗАЯВКИ
              </a>
            </li>
            <li>
              <a className="option" id="dismissals" onClick={() => handleOptionClick("dismissals")}>
                <img src={DismissalIcon} alt="-"/>
                УВОЛЬНЕНИЯ
              </a>
            </li>
            {userAccessLevel == "Суперадмин" &&
              <li>
                <a className="option" id="employees" onClick={() => handleOptionClick("employees")}>
                  <img src={EmployeesIcon} alt="/\"/>
                  СОТРУДНИКИ
                </a>
              </li>
            }
          </ul>
      </div>
      
      <div className="sidebar__footer">
        <a className="logout" id="logout" onClick={handleLogout}>
          <img src={LogoutIcon} alt="[->"/>
          <span>ВЫЙТИ</span>
        </a>
      </div>
    </div>
  );
};