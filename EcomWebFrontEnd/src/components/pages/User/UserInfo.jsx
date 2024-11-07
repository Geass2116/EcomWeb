import React, { useEffect } from 'react';
import './css/UserInfo.css';
import userPhoto from '../../../assets/images/ganja.jpg'

const UserInfo = ({userInfo}) => {
  console.log(userInfo);
  
  return (
    <div className="user-info">
      <div className="profile-card">
        <img src={userPhoto} alt="Profile" className="profile-image" />
        <h2></h2>
        <p>{userInfo.email}</p>
        <button className="edit-button">Edit Profile</button>
      </div>
      <div className="account-overview">
        <h3>Account Overview</h3>
        <div className="overview-details">
          <p><strong>Full Name:</strong> {userInfo.first_name} {userInfo.last_name}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Phone:</strong> {userInfo.phone}</p>
          <p><strong>Address:</strong> {userInfo.address}</p>
          <p><strong>City:</strong> {userInfo.city}</p>
          <p><strong>Country:</strong> {userInfo.state}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
