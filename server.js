const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors())

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on ${process.env.PORT}`);

})

/*
/--> signin--> POST() = success/fail //want ot send password in body over https 
/ register --> POST = userObject 
/profile accessing :/userId --> GET = user
/image --> PUT (updating score for existing user profile) --> user 

*/
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) //dependency injections  
app.post('/signin', signin.handleSignin(db, bcrypt))


app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res) })