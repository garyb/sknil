/*jshint es5: true, node: true, bitwise: true, camelcase: true, curly: false, 
eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: false,
noarg: true, noempty: true, nonew: true, undef: true, unused: true, 
strict: true, sub: true, quotmark: double */
"use strict";

var _        = require("underscore");
var express  = require("express");
var database = require("./lib/database").create("database.json");

var app = express();
var sknils = [];

app.use(app.router);

app.use("/", express.static("htdocs"));

app.get("/sknil/all", function (req, res) {
    res.json(sknils);
});

app.post("/sknil/find", express.bodyParser(), function (req, res) {
    
    var query = (req.body.query || "").toLowerCase();
    
    if (query.length === 0) {
        res.json(sknils);
        return;
    }
    
    res.json(_.filter(sknils, function (item) {
        return item.title.toLowerCase().indexOf(query) !== -1;
    }));
});

app.post("/sknil/new", express.bodyParser(), function (req, res) {

    var title = req.body.title;
    var url = req.body.url;

    if (!title || title.length === 0) {
        res.json({ success: false, msg: "Please enter a title" });
        return;
    }
    
    if (!url || url.length === 0) {
        res.json({ success: false, msg: "Please enter a URL" });
        return;
    }
    
    sknils.unshift({ title: title, url: url, date: new Date() });
    
    database.save(sknils)
        .then(function () {
            res.json({ success: true });
        });
});

database.load()
    .then(function (items) {
    
        sknils = _.map(items, function (item) {
            item.date = new Date(item.date);
            return item;
        });
        
        sknils = _.sortBy(sknils, function (item) {
            return 0 - item.date.getTime();
        });
    
        console.log("Starting webserver...");
        app.listen(8080, function () {
            console.log("Webserver listening on http://localhost:8080");
        });
    
    });