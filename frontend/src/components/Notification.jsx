import React from 'react';

// eslint-disable-next-line react/prop-types
const Notification = ({ message, style }) => (
  <div className={style}>{message}</div>
);

export default Notification;
