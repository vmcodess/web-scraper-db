const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const port = process.env.PORT || 5000;

const userModel = require('./models/registrationModel')

app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.use(cors());

// const database = {
//   users: [
//     {
//       id: '123',
//       name: 'John',
//       email: 'john@gmail.com',
//       password: 'cookies',
//       joined: new Date()
//     },
//     {
//       id: '1234',
//       name: 'Sally',
//       email: 'sally@gmail.com',
//       password: 'bananas',
//       joined: new Date()
//     }
//   ]
// }


// -----------------------------------------------------------------------------------------MongoDB
mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log(`Connected to the database!!`);
})
.catch((err) => {
  console.log(`Error connecting to DB : ${err}`);
})
// -----------------------------------------------------------------------------------------MongoDB


// ----- ROUTES ----- \\
app.get('/', (req, res) => {
  //res.send(database.users)
  res.send('work!')
})

app.post('/signin', (req, res) => {

  let emailInput = req.body.email;
  let passwordInput = req.body.password;

  userModel.findOne({ email: emailInput })
  .then((user) => {
    if (bcrypt.compareSync(passwordInput, user.password)) {
      console.log('passwords match', user)
      res.json('success')
    }
  })
  .catch((err) => {
    console.log('error comparing passwords', err)
  })

  //res.json('working')
})

app.post('/register', (req,res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  const user = userModel(newUser);

  // check if user exists..
  // newUser.find({ email: newUser.email })
  // .then((user) => {
  //   console.log('User does not exist:', user);
  //   user.save()
  //   .then((user) => {
  //     console.log('User saved to DB: ', user);
  //   })
  //   .catch((err) => {
  //     console.log('User Could not be saved to DB: ', err)
  //   })
  // })
  // .catch((err) => {
  //   console.log('User already exists: ', err);
  // })

  user.save()
  .then((user) => {
    console.log('User Successfully saved to DB!!', user);
  })
  .catch((err) => {
    console.log('Error saving user to DB', err)
  })

  
    
    // else (if doesnt exist)
      // save to databse

})


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

/* 
 - signin --> POST success/fail
 - register --> POST = user
 - profile/:userId --> GET = user
*/