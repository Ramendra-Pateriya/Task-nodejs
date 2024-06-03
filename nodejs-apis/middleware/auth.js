// Required modules
import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';
import { configDotenv } from 'dotenv';
configDotenv();

//middleware for validate user input for signup     
export const verifyInputForSignUp = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().max(20).required().pattern(new RegExp("^[a-zA-Z\ s]+$")),
        lastName: Joi.string().max(20).required().pattern(new RegExp("^[a-zA-Z\ s]+$")),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required()
    });

    const { error } = schema.validate(req.body);
      
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

//middleware for validate user input for login 
export const verifyInputForLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required()
    });

    const { error } = schema.validate(req.body);
      
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

// middleware for verify token
export const verifyToken = (req, res, next) =>{
    let token = req.headers["authorization"];

    try {
        // Decode and verify the token
        jwt.verify(token, process.env.JWT_KEY);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log("Token has expired.");
            res.status(400).json({ message: 'Token has expired.' });
        } else {
            console.log("Invalid token.");
            res.status(400).json({ message: 'Invalid token.' });
        }
    }
}
