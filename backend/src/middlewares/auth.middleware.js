const adminModel = require('../models/admin.model');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"Authentication Failed. No token provided."
        })
    }
    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await adminModel.findById(decoded.id);

        if(!admin){
            return res.status(401).json({
                message:"Authentication Failed. Admin not found."
            })
        }

        req.admin = admin;
        next();

    }catch(error){
        return res.status(401).json({
            message:"Authentication Failed."
        });
    }
}

module.exports = {
    authMiddleware,
}