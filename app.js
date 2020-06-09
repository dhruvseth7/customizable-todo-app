const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const utils = require(__dirname + "/utils/utils.js");


const mongoose = require("mongoose");
const model = require(__dirname + "/models/todo.js");
const CustomList = model.CustomList;
const ToDo = model.ToDo;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-dhruv:test123@cluster0-ursdd.mongodb.net/todoApp', {useNewUrlParser: true, useUnifiedTopology: true});

let listNames = [];

app.get("/", (req, res) => {
  res.redirect("/about");
})

app.get("/list/:customListName", (req, res) => {
    CustomList.find({}, function(err, lists) {
        // Populate nav bar with custom list names from mongo
        if (!err) {
          lists.forEach((list) => {
              if (!(listNames.includes(list.name))) {
                listNames.push(list.name);
              }
          })
        }
    }).then(() => {
        // If custom list does not exist, create a new one
        // If custom list exists, render page with list, title, current date and listNames for navbar
        const customListName = (req.params.customListName).toLowerCase();
        CustomList.findOne({name: customListName}, function(err, list) {
              if (list) {
                res.render("list", {title: customListName, itemList: list.items, date: utils.getDate(), listNames: listNames});
              } else if (!list) {
                let newList = new CustomList({
                  name: customListName,
                  items: []
                })
                newList.save().then(() => res.redirect("/list/" + customListName));
              } else {
                console.log(err);
              }
        })
    })
})

app.post("/", (req, res) => {
    const title = req.body.title;
    const comments = req.body.comments;
    const customListName = req.body.source;

    let newItem = new ToDo({
        title: title,
        comments: comments,
        postedDate: utils.getDateShort()
    })

    CustomList.findOne({name: customListName}, (err, doc) =>  {
      if (!err) {
        doc.items.push(newItem);
        doc.save().then(() => res.redirect("/list/" + customListName));
      }
    });


})


app.get("/about", (req, res) => {
    CustomList.find(function(err, lists) {
        if (!err) {
          lists.forEach((list) => {
              if (!(listNames.includes(list.name))) {
                listNames.push(list.name);
              }
          })
      }}).then(() => {
        res.render("about", {title: "About Page", itemList: [], date: utils.getDate(), listNames: listNames});
    })
})


app.post("/delete", (req, res) => {
    const list = req.body.taskCompleted.split(" : ")[0];
    const id = req.body.taskCompleted.split(" : ")[1];

    CustomList.findOne({name: list}, function(err, doc) {
      doc.items.pull({_id: id});
      doc.save().then(() => res.redirect("/list/" + list));
    });
})

app.post("/deleteCustomList", (req, res) => {
    const source = req.body.deletePage;

    CustomList.deleteOne({name: source}, function(err) {
        delete listNames[listNames.indexOf(source)];
        if (err) {
          console.log(err);
        }
    }).then(() => res.redirect("/"));
})

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
