import React from 'react';

const LogoutButton = ({ user, handleLogout }) => {
  if (user !== null) {
    return (
      <>
        <button onClick={handleLogout}>logout</button>
      </>
    );
  } else {
    return <></>;
  }
};

export default LogoutButton;
