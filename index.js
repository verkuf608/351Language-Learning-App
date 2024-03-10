const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// 使用body-parser中间件解析POST请求的JSON数据
app.use(bodyParser.json());

// 模拟用户数据存储
let users = [
  { id: 1, username: 'john_doe', password: 'password123', courses: [] },
  // 添加更多用户数据...
];

// 模拟课程和测验数据存储
let courses = [
  { id: 1, title: 'Introduction to Spanish', lessons: ['Greetings', 'Numbers', 'Colors'], quizzes: [] },
  // 添加更多课程数据...
];

// 用户认证中间件
function authenticateUser(req, res, next) {
  const userId = req.headers.userid;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = users.find((u) => u.id === parseInt(userId));

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = user;
  next();
}

// 处理获取所有课程的请求
app.get('/courses', (req, res) => {
  res.json({ courses });
});

// 处理获取单个课程的请求
app.get('/course/:courseId', (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = courses.find((c) => c.id === courseId);

  if (course) {
    res.json({ course });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

// 处理用户加入课程的请求
app.post('/user/:userId/join-course/:courseId', authenticateUser, (req, res) => {
  const userId = parseInt(req.params.userId);
  const courseId = parseInt(req.params.courseId);

  const user = req.user;
  const course = courses.find((c) => c.id === courseId);

  if (course && !user.courses.includes(courseId)) {
    user.courses.push(courseId);
    res.json({ message: 'Course joined successfully', user });
  } else {
    res.status(400).json({ message: 'Course not found or user already joined' });
  }
});

// 启动Express应用程序
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
