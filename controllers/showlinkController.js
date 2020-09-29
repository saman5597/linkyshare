const File = require('../models/fileModel');

exports.renderDownloadPage = async (req,res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) {
            res.status(200).render('download', {
                title: 'Something went wrong',
                error: 'Link has been expired.'
            }); 
        }
        res.status(200).render('download', {
            title: 'Download your files easily',
            uuid: file.uuid,
            fileName: file.fileName,
            fileSize: file.size,
            downloadLink: `${req.protocol}://${req.get('host')}/files/download/${file.uuid}`
            // https://domain.com/files/download/141356ahf17463f-1yqfbas
        });

    } catch(err) {
        console.log(err.message);
        res.status(200).render('download', {
            title: 'Something went wrong',
            error: 'Something went wrong'
        });
    }
};