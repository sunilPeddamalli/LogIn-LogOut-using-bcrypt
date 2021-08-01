const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./modals/user')

mongoose.connect('mongodb://localhost/bcryptDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to MongoDB');
    }).catch((err) => {
        console.log('MongoDB Error!');
        console.log(err);
    });

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res) => {
    res.send('Home Page!');
});


app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 12)
    const user = new User({
        username,
        password: hash
    })
    user.save();
    res.redirect('/')
})

app.get('/secret', (req, res) => {
    res.send('You need to login to know the secret');
})

app.listen(3000, () => {
    console.log('Serving your app!');
});