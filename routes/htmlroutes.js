module.exports = function(app, Article) {
    app.get('/articles', function(req, res) {
        Article.find({}, function(err, doc) {
            console.log(doc);
            if (err) {
                throw err;
            } 
            else {
                hbsObject = {article: doc};
                console.log(hbsObject);
                res.render('articles', hbsObject);
            }
        });
    });

    app.get('/articles/:id', function(req, res) {
        Article.findOne( { "_id": req.params.id })
        .populate("comment")
        .exec(function (err, doc) {
            if (error) {
                throw error;
            }
            else {
                res.json(doc);
            }
        });
    });
};