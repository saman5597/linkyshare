const path = require('path');
const multer = require('multer');
const { v4: uuid4 } = require('uuid');

const File = require('../models/fileModel');
const sendMail = require('../util/emailService');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null,'uploads/'),
    filename: (req, file, cb) => {
        const fileUniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null,fileUniqueName);
    }
});

let upload = multer({
    storage,
    limit: { fileSize : 1000000 * 100},
}).single('fileInput');

exports.uploadFile = (req,res) => {

    // Store file
    upload(req, res, async (err) => {
        try {

            // Validate request
            if (!req.file) {
                res.status(400).json({ status: false, error : 'All fields are required!' });
            }
            if(err) {
                res.status(500).json({ status: false, error : err.message});
            }

            // Store into Database
            const file = new File({
                fileName: req.file.filename,
                uuid: uuid4(),
                path: req.file.path,
                size: req.file.size
            });
            const response = await file.save();

            // Send Response -> Link
            res.status(200).json({ status: true, file: `${req.protocol}://${req.get('host')}/files/${response.uuid}` });
            // response will be like - https://domain.com/files/141356ahf17463f-1yqfbas 
        } catch (err) {
            console.log(err.message);
        }
    }); 
};

exports.sendEmail = async (req,res) => {

    try {
        // Validate request
        const { uuid , senderEmail , receiverEmail } = req.body;

        if (!uuid || !senderEmail || !receiverEmail) {
            res.status(400).json({ status: false, error : 'All fields are required!' });
        }

        // Get data from database
        const file = await File.findOne({ uuid: uuid });
        if (file.senderEmail) {
            res.status(409).json({ status: false, error : 'Email already sent!' });
        }

        // Save sender email and receiver email in DB
        file.senderEmail = senderEmail; 
        file.receiverEmail = receiverEmail;
        const response = await file.save();

        // Send Email
        sendMail({ 
            from: senderEmail, 
            to: receiverEmail, 
            subject: 'LinkyShare File Sharing',
            text: `${senderEmail} shared a file with you.`,
            html: require('../util/emailTemplate')({
                req,
                senderEmail,
                downloadLink: `${req.protocol}://${req.get('host')}/files/${uuid}`,
                size: `${parseInt(file.size/1000)} KB`,
                expires: '24 hours'
            })
        });

        res.status(200).json({ status: true, message: 'Email sent successfully!' });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ status: false, message: err.message });
    }
};