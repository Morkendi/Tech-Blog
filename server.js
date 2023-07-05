// Require document dependencies
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

// Require database connection
const sequelize = require('./config/connection');
// Store sessions
const SequelizeStore = require('connect-session-sequelize')(session.Store);


const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars engine with helpers
const hbs = exphbs.create({helpers});

const sess = {
    secret: process.env.SESSION_SECRET,
    cookie: {
    // Session expires after 30 minutes
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(session));

// Tell Express.js which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({force: false}).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});