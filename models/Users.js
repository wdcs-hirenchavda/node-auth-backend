const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/auth');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
 
const userSchema = new mongoose.Schema({
    email:{ 
        type: 'string',
        required: [true,'please enter an email'],
        unique: true,
        lowercase: true,
        validate:[isEmail,'please enter a valid email']
    },
    password:{
        type: 'string',
        required: [true,'please enter an password'],
        minlength: [6,'please enter at least six characters of your password'],
    }
})

// fire a function after doc saved in db

// userSchema.post('save',(doc,next)=>{
//     console.log('new user was created & saved',doc);
    
//     next();
// })

// fire a function after doc saved in db also hashing the password
userSchema.pre('save', async function(next){
    // console.log('new user was created & saved',this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

// static method form login user
// userSchema.statics.login =   async function(email, password){
//     const user = await this.findOne({email});
//     // try{

//     //     if(user){
//     //         const auth = await bcrypt.compare(password,user.password);
//     //         if(auth){
//     //             return user;
                
//     //         }
//     //         throw Error('Invalid password');
//     //     }
//     //     throw Error('incorrect email')
//     // }catch(er){
//     //     return er;
//     // }
// }


const User = mongoose.model('signups', userSchema);
module.exports = User;