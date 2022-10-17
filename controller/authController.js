const User = require("../models/Users");
const Product = require('../models/Products');
const Category = require('../models/Category');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dpkji708g', 
  api_key: '331419131284588', 
  api_secret: 'eRLvlVdBy4U1iMlTOOB7ap6BXVc',
  secure: true
});
 
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
  const {username, email, password ,role} = req.body;

  try {
    const user = await User.create({username, email, password,role });
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
     
     if (user) {
      // const auth = await bcrypt.compare(password, user.password);
      if (password ===user.password) {
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

module.exports.product_get_id = async(req,res)=>{
  let products = await Product.find({_id:req.params.id});
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "No products found" });
  }
}
module.exports.product_get = async(req,res)=>{
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "No products found" });
  }
  // let result = await Product.find({
  //   $or: [
  //     { name: { $regex: req.params.key } },
  //     { price: { $regex: req.params.key } },
  //     { category: { $regex: req.params.key } },
  //     { company: { $regex: req.params.key } },
  //   ],
  // });
  // res.send(result);
}
module.exports.product_get_user = async(req,res)=>{
  let products = await Product.find({userId:req.params.id});
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "No products found" });
  }
}

module.exports.product_post = async(req,res)=>{
  const file = req.files.image ;
  cloudinary.uploader.upload(file.tempFilePath,async(err,result)=>{
    if(result){

      const data = {...req.body , image:result.url}
      let product = new Product(data);
      let result1 = await product.save();
      res.send(result1);
    }else{
      res.send({ result: "image can not be uploaded" });
    }
  });
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


module.exports.user_get = async(req,res)=>{
  let user = await User.find({role:'user'});
  if(user){
    res.send(user);
  }
  else{
    res.send({result:'User not found'});
  }
}


module.exports.user_put = async(req,res)=>{
  try{

    let result = await User.updateOne(
      { _id: req.params.id },
      {
        $set: req.body  ,
      }
      );
      res.send(result);
    }catch(err){
      res.send(err);
    }
}

module.exports.category = async(req,res)=>{
  let category = await Category.find();
  if (category.length > 0) {
    res.send(category);
  } else {
    res.send({ result: "No products found" });
  }
}
