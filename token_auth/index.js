const jwt = require('jsonwebtoken')
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SESSION_KEY = 'Authorization';
const ACCESS_TOKEN_SECRET = 'access secret'


app.use((req, res, next) => {
    let token = req.get(SESSION_KEY);
    if (!token) return next()
    const isVerified = jwt.verify(token, ACCESS_TOKEN_SECRET)
    if (!isVerified) return next()
    req.user = jwt.decode(token)
    next()
});

app.get('/', (req, res) => {
    if (req.user) {
        return res.json({
            username: req.user.username,
            logout: 'http://localhost:3000/logout'
        })
    }
    res.sendFile(path.join(__dirname+'/index.html'));
})

app.get('/logout', (req, res) => {
    res.redirect('/');
});

const users = [
    {
        login: 'Login',
        password: 'Password',
        username: 'user1',
    },
    {
        login: 'Login1',
        password: 'Password1',
        username: 'user2',
    }
]

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    const user = users.find((user) => {
        if (user.login == login && user.password == password) {
            return true;
        }
        return false
    });

    if (user) {
        const token = jwt.sign({ username: user.username, login: user.login }, ACCESS_TOKEN_SECRET)

        res.json({ token });
    }

    res.status(401).send();
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
