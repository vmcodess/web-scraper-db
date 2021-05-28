const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


let registrationSchema = new Schema (
    {
        name: {
            type: String,
            required : true
        },
        email: {
            type: String,
            required : true,
            unique: true
        },
        password: {
            type: String,
            required : true
        },
        dateCreated: {
            type: Date,
            default: Date.now()
        }
    }
)

// ---------- un-comment when bcrypt is installed
registrationSchema.pre("save", function(next) {
    bcrypt.genSalt(12)
    .then((salt) => {
        bcrypt.hash(this.password, salt)
        .then((encryptedPassword) => {
            this.password = encryptedPassword;
            next();
        })
        .catch(err => console.log(`Error occured whe hashing ${err}`));
    })
    .catch(err => console.log(`Error occured when salting ${err}`));
})

let registrationModel = mongoose.model('registeredUsers', registrationSchema);

module.exports = registrationModel;