var cheerio = require("cheerio");
var request = require("request");

module.exports = function(app, Article, Comment) {
    app.get('/', function(req, res) {
        request("https://news.google.com/", function(err, res, html) {
            var $ = cheerio.load(html);
            $('esc-layout-article-cell').each(function(i, element) {
                var result = {};

                result.title = $(this).find(".titletext").text();
                result.desc = $(this).find(".esc-lead-snippet-wrapper").text();
                result.link = $(this).find("a.article").attr("href");

                var entry = new Article(result);

                entry.save(function(err, doc) {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log(doc);
                    }
                });
            });
        });
      res.redirect('/articles');
    });

    app.post('/articles/:id', function(req, res) {
        var newComment = new Comment(req.body);

        newComment.save(function (err, doc) {
            if (err) {
                throw err;
            }
            else {
                Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id})
                .exec(function (err, doc) {
                    if (err) {
                        throw err;
                    }
                    else {
                        res.send(doc);
                    }
                });
            }
        });
    });
};