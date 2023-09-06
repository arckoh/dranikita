const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Article = require("./articles/Article");
const Category = require("./categories/Category");

const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");

connection
    .authenticate()
    .then(() => {
        console.log("Connection avec la base de donnée OK");
    })
    .catch((connError) => {
        console.log(connError);
    })

app.set('view engine', 'ejs');
app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", categoriesController);
app.use("/", articlesController);
app.get("/", (req, res) => {

    Category.findAll().then(categories => {
        Article.findAll().then(articles => {
            res.render("index", {
                categories: categories,
                articles: articles
            });
        })
    });
});

app.get("/category/:slug", (req, res) => {

    var slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        }, include: [{ model: Article }]
    }).then(category => {
        if (category != undefined) {

            Category.findAll().then(categories => {
                res.render("index", {
                    articles: category.articles,
                    categories: categories
                })
            });

        }
        else {
            res.redirect("/")
        }

    }).catch(err => {
        res.redirect("/");
    })
});

app.get("/articles/:id", (req, res) => {

    var id = req.params.id;

    if (id != undefined) {
        if (!isNaN(id)) {
            Article.findByPk(id).then(article => {

                Category.findAll().then(categories => {
                    res.render("articles", {
                        article: article,
                        categories: categories
                    });

                });
            });
        }
        else {
            res.redirect("/");
        }
    }
    else {
        res.redirect("/");
    }

});




app.listen(3000, () => {
    console.log("Serveur Nodejs ON !!! ");
});