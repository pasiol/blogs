const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./testHelper');
const helperUser = require('./testHelperUser');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const logger = require('../utils/logger');

const api = supertest(app);

beforeAll(async () => {
  await User.deleteMany({});
  const testUsers = await helperUser.getTestUsers();
  await User.insertMany(testUsers);
});

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogs = await helper.getTestBlogs();
  await Blog.insertMany(blogs);
  await helper.updateUsersWithBlogs();
});

describe('getting data', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    const blogsInDB = await helper.getBlogsInDB();
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body).toHaveLength(blogsInDB.length);
  });

  test('blogs has id field', async () => {
    const response = await api.get('/api/blogs');
    const blog = response.body[0];
    expect(blog['id']).toBeDefined();
  });
});

describe('adding data', () => {
  test('posting a new valid document', async () => {
    const tokenAndUserId = await helper.getTokenAndUserId();
    logger.info('tokenAndUserId', tokenAndUserId);
    let newBlog = await helper.getTestBlog();
    newBlog.user = tokenAndUserId.userId;
    console.log('newBlog', newBlog);
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${tokenAndUserId.token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAfterPost = await helper.getBlogsInDB();
    const testBlogs = await helper.getTestBlogs();
    expect(blogsAfterPost).toHaveLength(testBlogs.length + 1);
    const titles = blogsAfterPost.map(b => b.title);
    expect(titles).toContain(newBlog['title']);
  });

  test('posting a new document without likes-property', async () => {
    const tokenAndUserId = await helper.getTokenAndUserId();
    const testBlog = await helper.getTestBlog();
    let newBlog = new Blog({
      title: testBlog.title,
      author: testBlog.author,
      url: testBlog.url,
      user: tokenAndUserId.userId
    });
    console.log('newBlog', newBlog);
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${tokenAndUserId.token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAfterPost = await helper.getBlogsInDB();
    const addedBlog = blogsAfterPost.filter(b => b.title === newBlog['title'])[0];
    console.log('addedBlog', addedBlog);
    expect(addedBlog['likes']).toBeDefined();
    expect(addedBlog.likes).toEqual(0);
  });

  test('posting a new document without title-property', async () => {
    const tokenAndUserId = await helper.getTokenAndUserId();
    const testBlog = await helper.getTestBlog();
    let newBlog = new Blog({
      author: testBlog.author,
      url: testBlog.url,
      user: tokenAndUserId.userId
    });
    console.log('newBlog', newBlog);
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${tokenAndUserId.token}`)
      .send(newBlog)
      .expect(400);
  });

  test('posting a new document without url-property', async () => {
    const tokenAndUserId = await helper.getTokenAndUserId();
    const testBlog = await helper.getTestBlog();
    let newBlog = new Blog({
      title: testBlog.title,
      author: testBlog.author,
      user: tokenAndUserId.userId
    });
    console.log('newBlog', newBlog);
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${tokenAndUserId.token}`)
      .send(newBlog)
      .expect(400);
  });

  test('updating likes property', async () => {
    const tokenAndUserId = await helper.getTokenAndUserId();
    const blogs = await helper.getBlogsInDB();
    console.log('blogs length', blogs.length);
    let randomBlog = blogs[Math.floor((Math.random() * blogs.length))];
    randomBlog.likes = 100000;
    console.log('randomBlog', randomBlog);

    let updatedLikes = {likes: 10000};
    let url = `/api/blogs/${randomBlog.id}`;
    await api
      .put(url)
      .set('Authorization', `bearer ${tokenAndUserId.token}`)
      .set('Accept', 'application/json')
      .send(updatedLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const dataAfterUpdate = await helper.getBlogsInDB();
    const updatedBlog = dataAfterUpdate.filter(b => b.id === randomBlog.id)[0];
    console.log('updatedBlog', updatedBlog);
    expect(updatedBlog.likes).toEqual(10000);
  });
});

describe('deleting data', () => {

  test('deleting blog by id', async () => {
    const tokenAndUserId = await helper.getTokenAndUserId();
    logger.info('tokenAndUserId', tokenAndUserId);
    let newBlog = await helper.getTestBlog();
    newBlog.user = tokenAndUserId.userId;
    console.log('newBlog', newBlog);
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${tokenAndUserId.token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsCount = (await helper.getBlogsInDB()).length;

    await api
      .delete(`/api/blogs/${response.body.id}`)
      .set('Authorization', `bearer ${tokenAndUserId.token}`)
      .expect(204);

    const blogsAfterDelete = await helper.getBlogsInDB();

    expect(blogsAfterDelete).toHaveLength(blogsCount - 1);

  });
});

afterAll(() => {
  mongoose.connection.close();
});