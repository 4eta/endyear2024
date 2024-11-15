import React from 'react';
import '../css/header.css';
import DepartmentList from '../templates/DepartmentList';

const HeaderUserIcon = ({ user }) => {
  const bxdColor = DepartmentList.find(department => department.label === user.department)?.color;
  return (
    <div className="userIcon" style={{backgroundColor:bxdColor}}>
      <p className="userIconName">{user.last_name}{user.first_name}</p>
      <p className="userIconDepartment">{user.department}</p>
    </div>
  );
};

export default HeaderUserIcon;
