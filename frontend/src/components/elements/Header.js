import React from 'react';
import '../css/header.css';
import HeaderUserIcon from './HeaderUserIcon';

const Header = ({ user }) => {
  return (
    <div className="headerBlur">
      <div className="header">
        <HeaderUserIcon user={user}  />
        <p className="scores">
          総合 <span style={{ fontSize: '20px', fontWeight: '700' }}>{user.rank === 0 ? '--' : user.rank}</span> 位　
          <span style={{ fontSize: '16px', fontWeight: '700' }}>{user.total_score}</span> pt
        </p>
      </div>
    </div>
  );
};

export default Header;
