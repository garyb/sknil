/*jshint browser: true, bitwise: true, camelcase: true, curly: false, 
eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: false,
noarg: true, noempty: true, nonew: true, undef: true, unused: true, 
strict: true, sub: true, quotmark: double */
/*global $*/

$(function () {

    "use strict";
    
    var $list = $("#sknils");
    var $template = $list.find(".template");
    $template.remove();
    
    var populate = function (items, query) {
        
        $list.empty();
        
        if (items.length === 0) $("#none").show();
        else $("#none").hide();
        
        if (query) {
            if (query.length > 0) query = query.toLowerCase();
            else query = null;
        }
    
        for (var i = 0, item; item = items[i]; i++) {
            var $item = $template.clone();
            if (query) {
                var ix = item.title.toLowerCase().indexOf(query);
                var before = item.title.substring(0, ix);
                var inner = item.title.substring(ix, ix + query.length);
                var after = item.title.substring(ix + query.length);
                $item.find(".title").html(before + 
                    "<span class=\"range\">" + inner + "</span>" + 
                    after);
            } else {
                $item.find(".title").text(item.title);
            }
            
            $item.find(".url").text(item.url);
            $item.find("a.link").attr("href", item.url);
            $list.append($item);
        }
    };
    
    $("#search").on("input", function () {
        var query = $(this).val();
        $.post("sknil/find", { query: query })
            .done(function (items) {
                populate(items, query);
            });
    });
    
    $("#add form").on("submit", function () {
        var $title = $(this).find("[name=title]");
        var $url = $(this).find("[name=url]");
        var $msg = $(this).find(".msg");
        $msg.text();
        $msg.removeClass("error success");
        $.post("sknil/new", { title: $title.val(), url: $url.val() })
            .done(function (result) {
                if (!result.success) {
                    $msg.addClass("error");
                    $msg.text(result.msg);
                } else {
                    $title.val("");
                    $url.val("");
                    $msg.addClass("success");
                    $msg.text("New sknil added successfully");
                }
            });
        return false;
    
    });

    $.get("sknil/all")
        .done(function (items) {
            populate(items);
        });

});