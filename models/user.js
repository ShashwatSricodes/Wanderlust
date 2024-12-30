const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema =new Schema({
    email :
    {
        type : String,
        required : true, 
    },
});

userSchema.plugin(passportLocalMongoose); // yhi plugin tumhari help karta hai cheezo me

module.exports = mongoose.model("User", userSchema);

// automatically adds username and password and adds hashing and salting to it.

 

