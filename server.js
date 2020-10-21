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

/*db.select('*').from('users').then(data=> { 
	console.log(data)
});*/

const app = express();

app.use(bodyParser.json());
app.use(cors())




// const database = {
// 	users:[
// 	{
// 		id:'123', 
// 		name:'John', 
// 		email:'j@gmail.com', 
// 		password: 'password',
// 		entires:0,
// 		joined: new Date()
// 	},
// 	{
// 		id:'124', 
// 		name:'Sal', 
// 		email:'sal@gmail.com', 
// 		password: '12345',
// 		entires:0,
// 		joined: new Date()
// 	}

// 	], 
// }

// app.get('/', (req,res) =>{

// 	res.send(database.users);

// })



app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on ${process.env.PORT}`);

})

/*
/--> res = this is working

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






//Asynchronous

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });