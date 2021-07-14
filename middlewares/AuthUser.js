const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/UserModel");




const AuthUser = async (req, res, next) => {

  let accessToken ;
  // console.log(req.headers)
  if(req.headers.authorization){
     accessToken= req.headers.authorization.split(" ")[1]  
  }  
  //if there is no token stored in cookies, the request is unauthorized
  if (!accessToken){
      return res.status(401).json({
        message:"User is Unauthorized",
        data:[]
      })
  }
  let payload
  try{
      //use the jwt.verify method to verify the access token
      //throws an error if the token has expired or has a invalid signature
      payload = await  jwt.verify(accessToken,process.env.JWT_SECRET)
      // console.log(payload)
      const userExists = await User.findById(payload._id);
      // console.log(userExists)
       if (!userExists) {
        return res.status(401).json({
            message:"User is Unauthorized",
            data:[]
          })       
        return;
      }
     
      else{
        req.user = {
            _id:userExists._id,
          }   ;
        next()
      }

  }
  catch(e){
      console.log(e)
      //if an error occured return request unauthorized error
      return res.status(401).json({
        message:"Something went wrong..!",
        data:[]
      })
  }
}

module.exports = AuthUser;