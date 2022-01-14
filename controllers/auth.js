const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');
const User = require('../models/user');

exports.signup = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists)
        return res.status(403).json({
            error: 'Email is taken!'
        });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({ message: 'Signup success! Please login.' });
};

exports.signin = (req,res)=>{
    //find the user based on email
    const {email, password} = req.body;
    User.findOne({email}, (err, user)=>{
        //if error or not user
        if(err ||  !user){
            return res.status(401).json({
                error: "user with that email does not exist. Please signin."
            })
        }
        // if user is found make sure  the email  and password match
        // create authenticate method in model and use there
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password do not match"
            })
        }

        //if user / autenthicate

        //generate token with user id and secret
        const token = jwt.sign({_id: user._id }, process.env.JWT_SECRET);
        //persist the tokenas t in cookie with expire date
        res.cookie("t", token, {expire: new Date() + 9999})
        //return response with userand token to frontend client 
        const {_id, name, email} = user
        return res.json({token, user: {_id, name, email}}) 
    }) 
}

exports.signout =(req,res)=>{
    //clear the cookie
    res.clearCookie("t");
    return res.json({message: "Signout sucess"});
}

exports.requireSignin = expressJwt({
    //if the token is valid, express jwt appends the verified user id
    //in an auth key to the request object
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], 
    userProperty: "auth"
})