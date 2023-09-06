const express = require("express");
const Category = require("./Category")
const slugify = require("slugify");
const router = express.Router();

router.get("/admin/categories/new", (req,res) => {
    res.render("admin/categories/new");
})

router.post("/categories/save", (req, res) => {
    console.log("on est bien passé sur le routeur save");
    var title = req.body.title;
    if(title != undefined ){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories");
        })
    }
    else{
        res.redirect("/admin/categories/new");
    }
});

router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id;

    if(id != undefined){
        if(!isNaN(id)){

            Category.findByPk(id).then(category => {
                res.render("admin/categories/edit", {
                    category: category
                });
            })
        }
        else{
            res.redirect("/admin/categories");
        }
    }
    else{
        res.redirect("/admin/categories");
    }

});


router.post("/categories/update", (req, res) => {
    
    var id = req.body.id;
    var title = req.body.title;
    
    if(id != undefined){
        if(!isNaN(id)){
            Category.update(
                
                {
                title:title, 
                slug: slugify(title)
                }, 
                {
                where:{
                    id: id
                }
                
            }).then(() => {
                res.redirect("/admin/categories");
            });
        }
        else{
            res.redirect("/admin/categories");
        }
    }
    else{
        res.redirect("/admin/categories");
    }
});

router.post("/categories/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where:{
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            })
        }
        else{
            res.redirect("/admin/categories");
        }
    }
    else{
        res.redirect();
    }

});

router.get("/admin/categories", (req, res) => {

    Category.findAll().then(categories => {

        res.render("admin/categories/index", {
            categories: categories
        });

    })
});

module.exports = router;