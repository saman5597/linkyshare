const router = require('express').Router();

const File = require('../models/fileModel');

router.get('/:uuid', async (req,res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) {
            res.status(200).render('download', {
                title: 'Something went wrong',
                error: 'Link has been expired.'
            }); 
        }

        const filePath = `${__dirname}/../${file.path}`;
        res.download(filePath);

    } catch(err) {
        console.log(err);
        res.status(200).render('download', {
            title: 'Something went wrong',
            error: 'Something went wrong'
        });
    }
});

module.exports = router;