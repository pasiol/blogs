import React from 'react';

const BlogForm = ({ user, handleSubmit, title, setTitle, url, setUrl, author, setAuthor }) => {
  if (user !== null) {
    return (
      <form onSubmit={handleSubmit}>
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
    );
  } else {
    return <></>;
  }
};

export default BlogForm;
