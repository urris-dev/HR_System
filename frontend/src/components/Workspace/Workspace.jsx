import { useState } from 'react';
import './Workspace.css';
import { Sidebar } from '@/components/Sidebar/Sidebar.jsx';
import { EmployeesList } from '@/components/Employees/Employees.jsx';

export default function Workspace() {
    const [activeTab, changeActiveTab] = useState(localStorage.getItem('activeTab') || null);
    function changeTab(tab) {
      localStorage.setItem('activeTab', tab);
      changeActiveTab(tab);
    }

    const renderContent = () => {
        switch (activeTab) {
          case 'requests':
            return null;
          case 'dismissals':
            return null;
          case 'employees':
            return <EmployeesList />;
          case 'profile':
            return null;
          default:
            return null;
        }
      };
    
    return (
        <div className='workspace'>
            <aside className="workspace__aside"><Sidebar activeTab={activeTab} changeActiveTab={changeTab} /></aside>
            <main className="workspace__main">{renderContent()}</main>
        </div>
    )
}