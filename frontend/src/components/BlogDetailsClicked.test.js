import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import BlogDetails from './BlogDetails';

test('renders content', () => {
  const blog = {
    title: 'JSON Web Token in a nutshell',
    author: 'Marc Backes',
    user: {
      username: 'teppo.testi@suomi.fi',
    },
    url:
        'https://dev.to/themarcba/secure-your-node-js-application-with-json-web-token-4d4e',
    likes: 10,
  };

  const component = render(<BlogDetails blog={blog}/>);

  component.debug();

  const button = component.container.querySelector('button');
  fireEvent.click(button);

  expect(component.container).toHaveTextContent('JSON Web Token in a nutshell');

  expect(component.container).toHaveTextContent('Marc Backes');

  expect(component.container).toHaveTextContent(
    'https://'
  );

  expect(component.container).toHaveTextContent('likes');
});
