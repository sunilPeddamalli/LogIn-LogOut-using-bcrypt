const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./modals/user');
const session = require('express-session');

mongoose.connect('mongodb://localhost/bcryptDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to MongoDB');
    }).catch((err) => {
        console.log('MongoDB Error!');
        console.log(err);
    });

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'notagoodsecret' }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next();
}

app.get('/', (req, res) => {
    res.send('Home Page!');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // const hash = await bcrypt.hash(password, 12)
    // const user = new User({
    //     username,
    //     password: hash
    // })
    // user.save();
    // req.session.user_id = user._id
    // res.redirect('/')


    const user = new User({ username, password });
    // check user modal for pre save mongoose middleware
    user.save();
    req.session.user_id = user._id
    res.redirect('/secret')
})

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // const user = await User.findOne({ username });
    // if (user) {
    //     const validPassword = await bcrypt.compare(password, user.password);
    //     if (validPassword) {
    //         req.session.user_id = user._id;
    //         res.redirect('/secret');
    //     } else {
    //         res.send('Try again!')
    //     }
    // } else {
    //     res.redirect('/register')
    // }

    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/secret');
    } else {
        res.redirect('/register')
    }
});

app.post('/logout', async (req, res) => {
    req.session.user_id = null;
    // req.session.destroy();
    res.redirect('/login');
})

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret');
})

app.get('/topsecret', requireLogin, (req, res) => {
    res.render('secret');
})

app.listen(3000, () => {
    console.log('Serving your app!');
});