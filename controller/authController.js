const User = require("../models/Users");
const Product = require('../models/Products');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//hadle errors

const hadleErrors = (err) => {
  console.log(err.message);
  let errors = { email: "", password: "" ,username: ""};

  // duplicate error code
  if (err.code === 11000) {
    errors.username = "This username is already registered";
    errors.email = "This email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("signups validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "secret", {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.send("sign up get request");
};
module.exports.login_get = (req, res) => {
  res.send("login get request");
};
module.exports.signup_post = async (req, res) => {
  const {username, email, password } = req.body;

  try {
    const user = await User.create({username, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    console.log(token);
    res.send({Register_token: token});

    // res.status(201).json({ user: user._id });
    // res.send(user)
  } catch (err) {
    const errors = hadleErrors(err);
    res.status(400).json({ errors });
  }
  // res.send('new signup ')
};
module.exports.login_post = async (req, res) => {
  const {username} = req.body 
  const {email}= req.body;
  const {password } = req.body;
//   try {
//       const user = await User.login({email,password});
//       console.log(user);
      
//     //   res.status(200).json({ user});
//       // res.json({user});
      
//   } catch (err) {
//       res.status(400).json(err)
//   }

  try {

    // if(username!==''){

    //   const user = await User.findOne( {username} );
    //   if (user) {
    //     const auth = await bcrypt.compare(password, user.password);
    //     if (auth) {
    //       const LoginToken =  createToken(user._id);
    //       // res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    //       // console.log(LoginToken); 
    //       res.send({Login_token:LoginToken})      
    //       // res.status(200).json({ user: user._id });  
    //   }


    //   else{
    //       res.send({error:1, message: "Invalid password" });
          
    //   }
  
    //   } else {
    //       res.send({error:1, message: "Invalid email or username please check email or username" });
  
    //   }
    // }
    // }else{

     let  user= await User.findOne( {username } )
     if(user===null){

       user = await User.findOne( {email } )
     }
     console.log(user);
     
     if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const LoginToken =  createToken(user._id);
        // res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        // console.log(LoginToken); 
        res.send(user)      
        // res.send({login_token:LoginToken})      
        // res.status(200).json({ user: user._id });  
    }
    else{
        res.send({error:1, message: "Invalid password" });
        
    }

    } else {
        res.send({error:1, message: "Invalid email or username please check email or username" });

    }
     
    // console.log(user);
    
    // if (user) {
    //   const auth = await bcrypt.compare(password, user.password);
    //   if (auth) {
    //     const LoginToken =  createToken(user._id);
    //     // res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    //     // console.log(LoginToken); 
    //     res.send({Login_token:LoginToken})      
    //     // res.status(200).json({ user: user._id });  
    // }
    // else{
    //     res.send({error:1, message: "Invalid password" });
        
    // }

    // } else {
    //     res.send({error:1, message: "Invalid email or username please check email or username" });

    // }
    
  } catch (err) {
    res.send(err);
  }

}


// Products

module.exports.product_get = async(req,res)=>{
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "No products found" });
  }
}

module.exports.product_post = async(req,res)=>{
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
}

module.exports.product_delete = async(req,res)=>{
  let result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
}

module.exports.product_put = async(req,res)=>{
  let result = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  res.send(result);
}
