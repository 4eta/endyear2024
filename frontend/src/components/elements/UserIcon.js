import React from 'react';
import '../css/userIcon.css';
import DepartmentList from '../templates/DepartmentList';

const UserIcon = ({ user }) => {
  const bxdColor = DepartmentList.find(department => department.label === user.department)?.color;
  return (
    <div className="userIconMini" style={{backgroundColor:bxdColor}}>
      <p className="userIconNameMini">{user.last_name}{user.first_name}</p>
      <p className="userIconDepartmentMini">{user.department}</p>
    </div>
  );
};

export default UserIcon;
