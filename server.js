const express = require('express');
const connectDB = require('./config/db');

process.on('uncaughtException', err => {
  console.log('Shutting down app...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./index');

const PORT = process.env.PORT || 8000;

connectDB();

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}.`);
});

process.on('unhandledRejection', err => {
  console.log('Shutting down app...');
  server.close(() => {
    console.log(err.name, err.message);
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down app... 👋');
  server.close(() => {
    console.log('PROCESS TERMINATED !!!');
  });
});