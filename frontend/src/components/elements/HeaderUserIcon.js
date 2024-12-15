import React from 'react';
import '../css/header.css';
import DepartmentList from '../templates/DepartmentList';

const HeaderUserIcon = ({ user }) => {
  const bxdColor = DepartmentList.find(department => department.label === user.department)?.color;
  const lastName = user.last_name || '';
  const firstName = user.first_name || '';
  const fullName = lastName + firstName;
  const displayName = fullName.length <= 4 ? fullName : lastName.slice(0, 2) + firstName.slice(0, 2);

  return (
    <div className="userIcon" style={{ backgroundColor: bxdColor }}>
      <p className="userIconName">
        {displayName}
      </p>
      <p className="userIconDepartment">{user.department}</p>
    </div>
  );
};

export default HeaderUserIcon;
