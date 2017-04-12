module.exports = function(app, Article) {
    app.get('/articles', function(req, res) {
        Article.find({}, function(err, doc) {
            if (err) {
                throw err;
            } 
            else if (doc = {}) {
                res.redirect('/')
            }
            else {
                res.json(doc);
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