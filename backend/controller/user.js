const User =require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const userSignUp=async(req,res)=>{
    const {email, password}=req.body;
    if(!email || !password){
        return res.status(400).send({message:"Please provide valid credentials"});
    }

    let user=await User.findOne({email});
    if(user){
        return res.status(400).send({message:"User already exists"});
    }

    const hashPwd=await bcrypt.hash(password, 10);
    const newUser=await User.create({
        email, password:hashPwd
    })

    // generate the token
    let token=jwt.sign({email, id:newUser._id}, process.env.JWT_SECRET_KEY);
    return res.status(200).send({token, user:newUser});

}

const userLogin=async(req,res)=>{
    const {email, password}=req.body;
    if(!email || !password){
        return res.status(400).send({message:"Please provide valid credentials"});
    }
    let user=await User.findOne({email});
    if(user && await bcrypt.compare(password, user.password)){
        let token=jwt.sign({email, id:user._id}, process.env.JWT_SECRET_KEY);
        return res.status(200).send({token, user});
    }else{
        return res.status(400).send({message:"Invalid credentials"});
    }
}

const getUser=async(req,res)=>{
    const user =await User.findById(req.params.id);
    res.send({email:user.email});
}

module.exports={userSignUp, userLogin, getUser};