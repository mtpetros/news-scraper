var cheerio = require("cheerio");
var request = require("request");

module.exports = function(app, Article, Comment) {
    app.get('/', function(req, res) {
        request("https://news.google.com/", function(err, res, html) {
            //console.log(res);
            //console.log(html);
            var $ = cheerio.load(html);
            //console.log($);

            $('.esc-layout-article-cell').each(function(i, element) {
                var result = {};

                result.title = $(this).find(".titletext").text();
                result.link = $(this).find("a.article").attr("href");
                console.log(result);

                var entry = new Article(result);
                

                entry.save(function(err, doc) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(doc);
                    }
                });
            });
        });
      res.redirect('/articles');
    });

        // Grab an article by it's ObjectId
    app.get("/articles/:id", function(req, res) {
      // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
      Article.findOne({ "_id": req.params.id })
      // ..and populate all of the notes associated with it
      .populate("comment")
      // now, execute our query
      .exec(function(error, doc) {
        // Log any errors
        if (error) {
          console.log(error);
        }
        // Otherwise, send the doc to the browser as a json object
        else {
          res.json(doc);
        }
      });
    });

    app.post('/articles/:id', function(req, res) {
        var newComment = new Comment(req.body);

        newComment.save(function (err, doc) {
            if (err) {
                throw err;
            }
            else {
                Article.findOneAndUpdate({ "_id": req.params.id }, { "comment": doc._id})
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