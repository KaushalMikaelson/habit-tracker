const bcrypt = require("bcrypt");
const User = require("../models/User");

const register = async(req, res) => {
    try{
        console.log("REQ BODY:", req.body);
        const {email, password} = req.body;
        
        //validate
        if(!email || !password){
            return res.status(400).json({message: "All fields requires"});
        }
        //Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        //store hash
        const user = await User.create({ // a user model is required here.
            email,
            password: hashedPassword,
        });
        res.status(201).json({message: "User created"});
    }catch(err){
        res.status(500).json({message: "Server error"});
    }
};


const login = async(req, res) => {
   const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({error: "Email and password are required"});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({message: "Invalid Credential"});
    }
    const isMatch = await bcrypt.compare(password, user.password); 
    if(!isMatch){
        return res.status(401).json({message: "Invalid Credentials"});
    }
    res.status(200).json({message: "Login Successful"});
}

module.exports = {
    login,
    register,
};