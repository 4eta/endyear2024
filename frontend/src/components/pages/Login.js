import React, { useState, useRef } from 'react'
import { useLogin } from '../hooks/useLogin';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import '../css/common.css';
import '../css/login.css';
import DepartmentList from '../templates/DepartmentList';

const Login = () => {
  const { login } = useLogin();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    department: ""
  });
  const departmentList = DepartmentList;

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [id]: value
    }));
  };

  const handleDepartmentChange = (event, newValue) => {
    setUser((prevUser) => ({
      ...prevUser,
      department: newValue ? newValue.label : ""
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(user);
    login(user);
  };

  return (
    <div className="background">
      <div className="blur">
        <div>
          <p className="gameTitle">オンリーワンゲーム</p>
          <p className="subTitle">の参加ページです。</p>
        </div>
        <div className="inputFrame">
          <form onSubmit={handleSubmit}>
            <div className="textfield-container">
              <TextField
                id="last_name"
                label="苗字"
                variant="outlined"
                className="textfield"
                onChange={handleInputChange}
                required
              />
              <TextField 
                id="first_name"
                label="名前"
                variant="outlined"
                className="textfield"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="autocomplete-container">
              <Autocomplete
                id="department"
                disablePortal
                options={departmentList}
                className="custom-dropdown"
                renderInput={(params) => <TextField {...params} label="所属" />}
                onChange={handleDepartmentChange}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn">
                入室する
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
