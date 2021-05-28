const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const port = process.env.PORT || 3000;

const userModel = require('./models/registrationModel')

app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.use(cors());


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
})

app.post('/register', (req,res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  const user = userModel(newUser);

  user.save()
  .then((user) => {
    console.log('User Successfully saved to DB!!', user);
  })
  .catch((err) => {
    console.log('Error saving user to DB', err)
  })

})


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
