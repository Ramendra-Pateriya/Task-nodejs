// Required modules
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from './emailController.js';
import { configDotenv } from 'dotenv';
import connection from '../models/User.js';


configDotenv();
let passwordToken;

// API for user signup
export const register = async (req, res) => {
    
    try {
        const {firstName, lastName, email,password} = req.body;
        // Check if user already exists
        const query = 'SELECT * FROM users WHERE email = ?';
        connection.query(query, [email], async (error, result, fields)=>{

            if(error) return console.log(error);

            if (result.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const salt =  await bcrypt.genSalt(10);
            const hashPassword =  await bcrypt.hash(password, salt);
            
            //create new user
            const query2 = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
            connection.query(query2, [firstName,lastName,email,hashPassword], (error, result, fields)=>{

                if(error) return console.log(error);
                
                if(result.insertId>0){
                    return res.status(201).json({ message: 'User registered successfully' });
                }
            });
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// API for user login
export const login = async (req, res) => {
    

    try {
        const { email, password } = req.body;
        // Check if user exists
        const query = 'SELECT * FROM users WHERE email = ?';
        connection.query(query, [email], async (error, result, fields)=>{
            if (result.length <= 0) {
                return res.status(400).send({ message: 'Invalid Credentials' });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, result[0].password);
            if (!isMatch) {
                return res.status(400).send({ message: 'Invalid Credentials' });
            }

            //Create and return JWT
            const payload = {
                user: {
                    id: result[0].id
                }
            };

            jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '10m' }, (err, token) => {
                if (err) throw err;
                res.json({ "message": "Login success","first name":  result[0].first_name, "Last name":  result[0].last_name, "email":  result[0].email,token});
            });
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// API for get all user data
export const allUser = (req, res)=>{
    //get all user data
    connection.query('SELECT id, first_name, last_name, email FROM users', (error, result, fields) => {
        if (error) throw error;
        return res.status(201).json(result);
    });
}

// Forgot Password API
export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Generate reset password token
      jwt.sign({email}, process.env.JWT_KEY, { expiresIn: '5m' }, (err, token) => {
        if (err) throw err;
        passwordToken = token;

         // Save token to the user account
        const query = "update users set reset_password_token=? where email=?";
        connection.query(query, [passwordToken, email], (error, result, fields)=>{
            if (error) throw error;
            // Send reset password email
        if(result.affectedRows>0){
            const resetPasswordLink = `http://localhost:3000/user/reset-password/${passwordToken}`;

        // function for send email     
        sendEmail(resetPasswordLink, email);
        
        
        res.status(200).json({"result": "Password reset email has been send please check your inbox"});
        res.end();
        }else{
            res.status(201).json({"result": "Something wrong"});
            res.end();
        }
      });
    });
     
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
      res.end();
    }
}

// Reset Password API
export const resetPassword = async (req, res) => {
    const data = {
        "token": passwordToken
    }
    return res.render('index', data);
   
}



export const resetPasswordSubmit = async (req, res)=>{
    try {
        const { token, password } = req.body;

        jwt.verify(token, process.env.JWT_KEY);
        
            // Save token to the user account
        const salt =  await bcrypt.genSalt(10);
        const hashPassword =  await bcrypt.hash(password, salt);

        const query = "update users set password=? where reset_password_token=?";
        connection.query(query, [hashPassword, token], (error, result, fields)=>{
              if (error) throw error;
             
              res.status(400).json({ message: 'Password update successfully' });
              res.end();
        });

      } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log("Token has expired.");
            res.status(400).json({ message: 'Link has expired.' });
            res.end();
        }
      }
}
