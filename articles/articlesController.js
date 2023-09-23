const express = require("express");
const router = express.Router();
const slugify = require('slugify');
const Article = require("./Article");
const Category = require("../categories/Category");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles", adminAuth , (req, res) => {

    Article.findAll().then(articles => {

        Category.findAll().then(categories => {
            res.render("admin/articles/index", {
                articles: articles,
                categories: categories
            });
        });

    });
});


router.get("/admin/articles/new", adminAuth , (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {
            categories: categories
        });
    })
});

router.post("/articles/save", (req, res) => {

    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category
    
    if(title != undefined){
        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category
        }).then(() => {
            res.redirect("/admin/articles");
        });

    }

});

router.get("/admin/articles/edit/:id", adminAuth , (req, res) => {

    var id = req.params.id;

    if(id != undefined) {

        if(!isNaN(id)){

            Category.findAll().then(categories => {
                Article.findByPk(id).then(article => {
                    res.render("admin/articles/edit", {
                        article: article,
                        categories: categories
                    });
                });

            });


        }

    }

});

router.post("/articles/update", (req, res) => {

    var id = req.body.id
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category

    Article.update({title: title, slug: slugify(title), body: body, categoryId: category.id },{
        where:{
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(msgError => {
        res.send(msgError);
    })

});

router.get("/articles/page/:num", (req, res) => {

    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }
    else{
        offset = (parseInt(page) - 1) * 4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order:[
            ['id', 'DESC']
        ]
    }).then(articles => {

        var next;
        
        if(offset + 4 >= articles.count){
            next = false
        }
        else{
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }



        Category.findAll().then(categories => {
            res.render("admin/articles/page", {

                result: result,
                categories: categories,
            });
        });
    });
});



module.exports = router;