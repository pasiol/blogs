import React from 'react';
import BlogDetails from './BlogDetails';
import PropTypes from 'prop-types';
const Blog = (props) => {
  console.log('Blog props', props);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <BlogDetails
        buttonLabel="view"
        blog={props.blog}
        updateBlog={props.updateBlog}
        addVote={props.addVote}
        removeBlog={props.removeBlog}
      />
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object,
  updateBlog: PropTypes.func,
  removeBlog: PropTypes.func,
};

export default Blog;
