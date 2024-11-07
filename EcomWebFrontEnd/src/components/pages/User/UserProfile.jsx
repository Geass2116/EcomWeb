import React, { useEffect, useState } from 'react';
import UserInfo from './UserInfo';
import OrderInfo from './OrderInfo';
import './css/UserProfile.css';
import api from '../../../API/api'

const UserProfile = () => {

  const [userInfo,setUserInfo] = useState({})
  
  useEffect(()=>{
    const getInfo = async()=>{
      try{
        const response = await api.get('user_info');
        setUserInfo(response.data) 
      }
      catch(e){
        console.log(e.message);
      }
    }
    getInfo();
  },[])
  return (
    <div className="user-profile">
      <UserInfo userInfo={userInfo}/>
      <OrderInfo />
    </div>
  );
};

export default UserProfile;
