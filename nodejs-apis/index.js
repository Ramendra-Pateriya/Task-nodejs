// Required modules
import express from 'express';
import connection from './models/User.js';
import { configDotenv } from 'dotenv';
import userRoute from './routes/user.js';
import bodyParser from 'body-parser';
configDotenv();


// Initialize Express app
const app = express();

//set template engine
app.set('view engine', 'ejs');

// Middleware for JSON parsing
app.use(express.json());

// Middleware to parse URL-encoded bodies (for form data)
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/user', userRoute);

// check the database connection
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL server');
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
