import React, { useState } from 'react';
import DeleteButton from './DeleteButton';

const BlogDetails = (props) => {
  const [visible, setVisible] = useState(true);
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  console.log('BlogDetails props: ', props);

  return (
    <>
      {visible && (
        <div className="blogDetails">
          {props.blog.title}
          <button onClick={toggleVisibility}>{props.buttonLabel}</button>
          <br />
          {props.blog.author}
        </div>
      )}
      {!visible && (
        <div className="blogDetails">
          {props.blog.title}
          <button onClick={toggleVisibility}>hide</button>
          <br />
          {props.blog.url}
          <br />
          likes {props.blog.likes}
          <button onClick={() => props.addVote(props.blog)}>like</button>
          <br />
          {props.blog.author}
          <br />
          <DeleteButton
            removeBlog={props.removeBlog}
            username={props.blog.user.username}
            id={props.blog.id}
          />
        </div>
      )}
    </>
  );
};

export default BlogDetails;
