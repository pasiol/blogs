import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import './style.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('');
  const [notificationStyle, setNotificationStyle] = useState('');
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort(function (a, b) {
        return b.likes - a.likes;
      });
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user.name);
      blogService.setToken(user.token);
    }
  }, []);

  const notify = (message, style) => {
    setTimeout(() => {
      setNotification(message);
      setNotificationStyle(style);
      setTimeout(() => {
        setNotification('');
        setNotificationStyle('');
      }, 10000);
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password);
    try {
      const user = await loginService.login({
        username: username,
        password: password,
      });
      blogService.setToken(user.token);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      setUser(user.name);
      setUsername('');
      setPassword('');
      console.log('login before filtering', blogs);
      console.log('user before filtering', user);
      const usersBlogs = blogs.filter((b) => b.user.username === user.username);
      setBlogs(usersBlogs);
      console.log('login after filtering', blogs);
    } catch (exception) {
      notify('wrong username or password', 'error');
    }
  };

  const addBlog = async (blogObject) => {
    try {
      await blogService.create(blogObject);
      setBlogs(blogs.concat(blogObject));
      notify(`a new blog ${blogObject.title} added`, 'success');
      blogFormRef.current.toggleVisibility();
    } catch (error) {
      notify(`a new blog ${blogObject.title} cannot save: ${error}`, 'error');
    }
  };

  const updateBlog = async (blogObject) => {
    try {
      await blogService.update(blogObject);
      blogs.sort(function (a, b) {
        return b.likes - a.likes;
      });
      setBlogs(blogs);
      notify(`updating ${blogObject.title} succesfully`, 'success');
    } catch (error) {
      notify(`updating ${blogObject.title} failed: ${error}`, 'error');
    }
  };

  const removeBlog = async (blogObject) => {
    try {
      await blogService.remove(blogObject);
      const updatedBlogs = await blogService.getAsyncAll();
      setBlogs(updatedBlogs);
      blogs.sort(function (a, b) {
        return b.likes - a.likes;
      });
      notify(`removing ${blogObject.title} succesfully`, 'success');
    } catch (error) {
      notify(`deleting ${blogObject.title} failed: ${error}`, 'error');
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    blogService.setToken(null);
    setUser(null);
    window.localStorage.removeItem('loggedBlogappUser');
    await blogService.getAll().then((blogs) => setBlogs(blogs));
  };

  const addVote = async (blog) => {
    await updateBlog({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: ++blog.likes,
    });
  };

  return (
    <div>
      <Notification message={notification} style={notificationStyle} />
      <LoginForm
        user={user}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
      <BlogForm
        user={user}
        createBlog={addBlog}
        nofify={notify}
        blogFormRef={blogFormRef}
      />
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog
          key={blog.title}
          blog={blog}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
          addVote={addVote}
        />
      ))}
    </div>
  );
};

export default App;
