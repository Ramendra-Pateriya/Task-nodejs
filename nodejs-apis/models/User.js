// Required modules
import mysql from 'mysql';
import { configDotenv } from 'dotenv';
configDotenv();

// create connection with database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER_NAME,
    password: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME
});



export default connection;