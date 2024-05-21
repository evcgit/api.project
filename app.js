const express = require('express');
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { error } = require('console');
require('dotenv').config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const usersData = fs.readFileSync('./data/users.json');
const users = JSON.parse(usersData).users;
// const cardsData = fs.readFileSync('./data/cards.json');
// const cards = JSON.parse(cardsData).cards;

app.use(express.json());
app.use(express.static('./public'));

app.use(expressjwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  getToken: req => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  },
}).unless({ path: ['/', '/login', '/index.html'] }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    console.log('login failed');
    return res.status(401).json({ errorMessage: 'Invalid username or password' });
  }
  
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    console.log('login failed');
    return res.status(401).json({ errorMessage: 'Invalid username or password' });
  };

  const token = jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
  console.log('login successful');
  return res.json({ token: token });
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ errorMessage: 'Invalid token' });
  } else {
    console.log(err);
    res.status(500).json({ errorMessage: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});