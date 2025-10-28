const adminModel = require('../models/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerAdmin(req, res){
    const {fullName , email , phone , password} = req.body;

    let isAdminAlreadyExists = await adminModel.findOne({email});

    if(isAdminAlreadyExists){
        return res.status(400).json({
            message:"Admin Already Exists",
        });
    }

    const hashedPassword = await bcrypt.hash(password , 10);

    const admin = await adminModel.create({
        fullName,
        email,
        phone,
        password:hashedPassword,
    })


    const token = jwt.sign({
        id: admin._id,
    }, process.env.JWT_SECRET)

    res.cookie("token" ,token),{
        httpOnly:true,
        secure:true,
        sameSite:'lax',
        path:'/',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),  // 1 days
    };
    res.status(201).json({
        message:"Admin registered successfully",
        admin:{
            _id: admin._id,
            email: admin.email,
            fullName: admin.fullName
        }
    })
}

async function loginAdmin(req, res){
    const {email , password} = req.body;

    const admin = await adminModel.findOne({email});

    if(!admin){
        res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password , admin.password);
    if(!isPasswordValid){
        res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: admin._id,
    },process.env.JWT_SECRET);

    res.cookie("token" , token,{
        httpOnly:true,
        secure:true,
        sameSite:'lax',
        path:'/',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),  // 1 days
    });
    res.status(201).json({
        message:"user logged in successfully",
        admin:{
            _id: admin._id,
            email: admin.email,
            fullName: admin.fullName
        }
    })
}

async function logoutAdmin(req , res){
    res.clearCookie("token");
    res.status(200).json({
        message:"User Logged out successfully"
    })
}

async function getAdminDetails(req , res){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }

    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    const admin = await adminModel.findById(decoded.id).select('-password -__v');

    if(!admin){
        return res.status(401).json({
            message:"Unauthorized || admin not found"
        })
    }

    res.status(200).json({
        admin
    })
}

module.exports = {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getAdminDetails
}