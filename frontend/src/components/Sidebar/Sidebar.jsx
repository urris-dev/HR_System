import React, { useEffect } from 'react';
import CompanyLogo from '@/assets/company-logo.svg';
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
              <a className="option" id="requests" onClick={() => handleOptionClick("requests")} title='ЗАЯВКИ'>
                <img src={RequestIcon} alt="+"/>
              </a>
            </li>
            <li>
              <a className="option" id="dismissals" onClick={() => handleOptionClick("dismissals")} title='УВОЛЬНЕНИЯ'>
                <img src={DismissalIcon} alt="-"/>
              </a>
            </li>
            {userAccessLevel == "Суперадмин" &&
              <li>
                <a className="option" id="employees" onClick={() => handleOptionClick("employees")} title='СОТРУДНИКИ'>
                  <img src={EmployeesIcon} alt="/\"/>
                </a>
              </li>
            }
          </ul>
      </div>
      
      <div className="sidebar__footer">
        <a className="logout" id="logout" onClick={handleLogout} title='ВЫХОД'>
          <img src={LogoutIcon} alt="[->"/>
        </a>
      </div>
    </div>
  );
};