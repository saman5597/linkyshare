const mongoose = require('mongoose');
const validator = require('validator');

const fileSchema = new mongoose.Schema(
  {
    fileName : {
        type: String,
        required: [true, 'Filename is required.']  
    },
    path : {
        type: String,
        required: [true, 'File path is required.']  
    },
    size : {
        type: Number,
        required: [true, 'File size is required.']  
    },
    uuid : {
        type: String,
        required: [true, 'UUID is required.']  
    },
    senderEmail : {
        type: String,
        trim: true,
        lowercase: true, 
        validate: [validator.isEmail, 'Please provide a valid sender email ID.']
    },
    receiverEmail : {
        type: String,
        trim: true,
        lowercase: true, 
        validate: [validator.isEmail, 'Please provide a valid receiver email ID.']
    }
  },
  {
    timestamps: true,  
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

const File = mongoose.model('File', fileSchema);

module.exports = File;
