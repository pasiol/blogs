import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const getAsyncAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  console.log('create object, token:', newObject, config);
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (blogObject) => {
  const config = {
    headers: { authorization: token },
  };
  console.log('create object, token:', blogObject, config);
  const response = await axios.put(
    `${baseUrl}/${blogObject.id}`,
    blogObject,
    config
  );
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { authorization: token },
  };
  console.log('blog:', id);
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default { getAll, setToken, create, update, remove, getAsyncAll };
