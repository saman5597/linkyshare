exports.renderHomePage = (req,res) => {
    res.status(200).render('index', {
        title: 'Share your files easily'
      });
}