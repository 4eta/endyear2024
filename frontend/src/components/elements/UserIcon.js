import React, { useState } from 'react';
import '../css/userIcon.css';
import DepartmentList from '../templates/DepartmentList';

const UserIcon = ({ user }) => {
  const [isActive, setIsActive] = useState(false);
  const departmentColor = DepartmentList.find(department => department.label === user.department)?.color;
  const departmentNameJP = DepartmentList.find(department => department.label === user.department)?.name;
  const lastName = user.last_name || '';
  const firstName = user.first_name || '';
  const fullName = lastName + firstName;
  const displayName = fullName.length <= 4 ? fullName : lastName.slice(0, 2) + firstName.slice(0, 2);

  const handleTouchStart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsActive(true);
  };

  const handleTouchEnd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsActive(false);
  };

  if (user.is_admin) {
    return (
      <div
        className="userIconMiniAdmin"
        style={{ background: 'white', border: `1px solid ${departmentColor}` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isActive && (
          <div className="tooltip">
            <p className='tooltipFullName'>{fullName}</p>
            <p className='tooltipDepartment'>{user.department}</p>
          </div>
        )}
        <p className="userIconNameMiniAdmin" style={{ color: departmentColor }}>{displayName}</p>
        <p className="userIconDepartmentMiniAdmin" style={{ color: departmentColor }}>{user.department}</p>
      </div>
    );
  } else {
    return (
      <div
        className="userIconMini"
        style={{ background: departmentColor }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isActive && (
          <div className="tooltip">
            <p className='tooltipFullName'>{fullName}</p>
            <p className='tooltipDepartment'>{user.department}</p>
          </div>
        )}
        <p className="userIconNameMini">{displayName}</p>
        <p className="userIconDepartmentMini">{user.department}</p>
      </div>
    );
  }
};

export default UserIcon;