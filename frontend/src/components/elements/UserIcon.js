import React from 'react';
import '../css/userIcon.css';
import DepartmentList from '../templates/DepartmentList';

const UserIcon = ({ user }) => {
  const departmentColor = DepartmentList.find(department => department.label === user.department)?.color;
  const lastName = user.last_name || '';
  const firstName = user.first_name || '';
  const fullName = lastName + firstName;
  const displayName = fullName.length <= 4 ? fullName : fullName.slice(0, 4);

  if (user.is_admin) {
    return (
      <div className="userIconMiniAdmin" style={{ background: departmentColor }} >
        <p className="userIconNameMiniAdmin">{displayName}</p>
        <p className="userIconDepartmentMiniAdmin">{user.department}</p>
      </div >
    );
  } else {
    return (
      <div className="userIconMini" style={{ background: departmentColor }}>
        <p className="userIconNameMini">{displayName}</p>
        <p className="userIconDepartmentMini">{user.department}</p>
      </div>
    );
  }
};

export default UserIcon;
