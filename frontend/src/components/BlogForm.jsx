import React, { useState } from 'react';
import Togglable from './Togglable';

const BlogForm = ({ user, createBlog, notify, blogFormRef }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = async (event) => {
    if (title.length > 0 && author.length > 0 && url.length > 0) {
      event.preventDefault();
      createBlog({
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

  if (user !== null) {
    return (
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <form onSubmit={addBlog}>
          <p>
            title:{' '}
            <input
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </p>
          <p>
            author:{' '}
            <input
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </p>
          <p>
            url:{' '}
            <input
              type="text"
              value={url}
              name="URL"
              onChange={({ target }) => setUrl(target.value)}
            />
          </p>
          <button type="submit">create</button>
        </form>
      </Togglable>
    );
  } else {
    return <></>;
  }
};

export default BlogForm;
