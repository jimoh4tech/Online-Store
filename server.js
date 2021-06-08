const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const fileUpload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const morgan = require('morgan');

// Load env variables
dotenv.config({ path: './config/config.env' });

// Connect the database
connectDB();

// Route files
 const product = require('./route/products');
const auth = require('./route/auth');
const user = require('./route/users');
const cart = require('./route/carts');
const order = require('./route/orders');
const payment = require('./route/payments');

const app = express();

// Logging middleware
app.use(morgan());

// Parser body
app.use(express.json());

// File uploading
app.use(fileUpload());

// Sanitize data
app.use(mongoSanitize());

// Set security
app.use(helmet());


// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100
});
app.use(limiter);

// Prevent hpp param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Mount routers
app.use('/api/v1/products', product);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
app.use('/api/v1/carts', cart);
app.use('/api/v1/orders', order);
app.use('/api/v1/payments', payment);

// This code is used for handling errors and must come after all the above
app.use(errorHandler);


const PORT = process.env.PORT || 5005;
 server = app.listen(PORT, console.log(`Server running on port ${PORT}`));

// Handle unhandle promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);

    // Close server & exit process
    server.close(() => process.exit(1));

});