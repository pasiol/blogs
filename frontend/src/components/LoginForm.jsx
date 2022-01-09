import React from 'react';
import LogoutButton from './LogoutButton';

const LoginForm = ({
  user,
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
  handleLogout,
}) => {
  console.log('username and password: ', username, password);
  if (user === null) {
    return (
      <div id="loginForm">
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <p>
            username{' '}
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </p>
          <p>
            password{' '}
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </p>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <h2>Blogs</h2>
        <p>
          {user} has logged in.
          <LogoutButton user={user} handleLogout={handleLogout} />
        </p>
      </div>
    );
  }
};

export default LoginForm;
