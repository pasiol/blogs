import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import './style.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('');
  const [notificationStyle, setNotificationStyle] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [author, setAuthor] = useState('');
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
      const allBlogs = await blogService.getAsyncAll();
      setBlogs(allBlogs);
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

  const removeBlog = async (id) => {
    console.log('removeBlog blogobject: ', id);
    try {
      await blogService.remove(id);
      const updatedBlogs = await blogService.getAsyncAll();
      setBlogs(updatedBlogs);
      blogs.sort(function (a, b) {
        return b.likes - a.likes;
      });
      notify(`removing ${id} succesfully`, 'success');
    } catch (error) {
      notify(`deleting ${id} failed: ${error}`, 'error');
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    blogService.setToken(null);
    setUser(null);
    window.localStorage.removeItem('loggedBlogappUser');
    await blogService.getAll().then((blogs) => setBlogs(blogs));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (title.length > 0 && author.length > 0 && url.length > 0) {
      await addBlog({
        title: title,
        author: author,
        url: url,
        likes: 0,
      });
      setTitle('');
      setAuthor('');
      setUrl('');
    } else {
      notify('missing information, can not save the blog', 'error');
    }

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
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <BlogForm
          user={user}
          handleSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          url={url}
          setUrl={setUrl}
          author={author}
          setAuthor={setAuthor}
          blogFormRef={blogFormRef}
        />
      </Togglable>
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
