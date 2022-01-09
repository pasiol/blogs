import React from 'react';

const DeleteButton = (props) => {
  console.log('DeleteButton props', props);
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
  if (loggedUserJSON !== null) {
    const user = JSON.parse(loggedUserJSON);
    console.log('user', user);
    if (props.username === user.username) {
      return <button onClick={props.deleteBlog}>delete</button>;
    }
    return <></>;
  }
  return <></>;
};

export default DeleteButton;
