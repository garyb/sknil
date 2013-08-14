/*jshint es5: true, node: true, bitwise: true, camelcase: true, curly: false, 
eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: false,
noarg: true, noempty: true, nonew: true, undef: true, unused: true, 
strict: true, sub: true, quotmark: double */
"use strict";

var Q  = require("q");
var fs = require("fs");

exports.create = function (filename) {

    var load = function () {
        console.log("Loading " + filename + "...");
        return Q.nfcall(fs.readFile, "database.json")
            .then(JSON.parse);
    };

    var save = function (items) {
        console.log("Saving data to " + filename + "...");
        return Q.nfcall(fs.writeFile, "database.json", JSON.stringify(items));
    };
    
    return {
        load: load,
        save: save
    };
};
