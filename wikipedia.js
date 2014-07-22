// HTTP MEDIA WIKI API // http://en.wikipedia.org/w/api.php?action=query&list=backlinks&bltitle=JSON&bllimit=300&format=json&blfilterredir=nonredirects&blnamespace=0&bldir=descending&blcontinue=0|JSON|42888724
// Library to interact with wikipedia.  Eventually should handle caching to Mongo as well
var http = require('http');
var url  = require('url');
var querystring = require('querystring');
var root = "http://en.wikipedia.org/w/api.php?";


// Prepare JSON from the wikipedia API and return it once complete.
var getJSON = function(url_options, json) {
  var endpoint = this.root + querystring.stringify(url_options);
  var raw = "";
  http.request(endpoint, function(res) {
    res.setEncoding("utf8");
    res.on('error', function(e) {
      console.log("Error: " + e.message);
    });
    res.on("data", function(chunk) {
      d = JSON.parse(chunk);
      res.on('data', function(chunk) {
            raw += chunk;
      });
      res.on('end', function () {
        out = JSON.parse(raw);
        json["query"]["backlinks"].concat(out["query"]["query-continue"]);
        if (out["query-continue"]) {
          url_options["query-continue"] = out["query-continue"];
          this.getJSON(url_options, json);
        }
        else {
          return json;
        }
      });
    }).end();
  });
};

exports.root = root;
exports.getLinkBacks = function(title) {
  params = {
    action: "query",
    list:   "backlinks",
    format: "json",
    blfilterredir: "nonredirects",
    blnamespace: 0,
    bltitle: title
  };
  return getJSON(params, {});
};
