const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const compression = require('compression');
const AppErrorHandler = require('./util/errorHandler');
const globalErrorHandler = require('./controllers/errorController');

//Start express app
const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Global Middlewares
app.use(cors()); //for CORS

app.options('*', cors());

// Serving Static files
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP Headers
app.use(helmet()); // XSS Scripting

// Req meta-data (req-time , status etc.) Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body-parsing , reading data from body into req.body
app.use(express.json()); 

// DATA SANITIZATION AGAINST NO-SQL QUERY INJECTIONS
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS(CROSS SITE SCRIPTING) ATTACKS - HTML Attacks
app.use(xss());

app.use(compression());

// Prevents from Brute-force attack and Denial of service (Limit req from same API)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1hr window
  max: 100, // start blocking after 100 requests
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again after an hour.'
  }
});
app.use('/api/files', limiter);

//Mounting the router
app.use('/api/files' , require('./routes/fileRoutes'));
app.use('/' , require('./routes/viewRoutes'));
app.use('/files' , require('./routes/showlinkRoutes'));
app.use('/files/download' , require('./routes/downloadRoutes'));

// Handling Unhandled Routes - Should be in last in stack otherwise all routes will be routed to this route.
//Operational Error
app.all('*', (req, res, next) => {
  next(
    new AppErrorHandler(`Can't find ${req.originalUrl} on this server.`, 404)
  );
});

// Global Error Handling  Middleware
app.use(globalErrorHandler);

module.exports = app;
