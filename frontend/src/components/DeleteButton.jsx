import React from 'react';

const DeleteButton = ({ removeBlog, username, id }) => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
  if (loggedUserJSON !== null) {
    const user = JSON.parse(loggedUserJSON);
    console.log('user', user);
    if (username === user.username) {
      return <button onClick={() => removeBlog(id)}>delete</button>;
    }
    return <></>;
  }
  return <></>;
};

export default DeleteButton;
