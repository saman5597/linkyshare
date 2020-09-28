const router = require('express').Router();

router.get('/', (req,res) => {
    res.status(200).render('index', {
        title: 'Share your files easily'
      });
});

module.exports = router;