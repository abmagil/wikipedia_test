/*
 * Engine of the site.  Responsible for querying for information.
 */
var request = require('request');
var querystring = require('querystring');
var wp = require('wikipedia-js');

/*
* Responsible for gathering and returning information about linkbacks to the given article
* First query is to the DB and responds in the largest chunk possible
* Second query is to the Wikipedia API 
*/ 
var getLinkBacks = function(title, blcontinue, fn) {
  var root = "http://en.wikipedia.org/w/api.php?";
  var params = {
    action: "query",
    list:   "backlinks",
    bltitle: title,
    bllimit: 100,
    format: "json",
    blfilterredir: "nonredirects",
    blnamespace: 0,
  };
  var endpoint = root + querystring.stringify(params);
  if (blcontinue) {
    endpoint = endpoint + "&blcontinue=" + blcontinue // Was having trouble with unescaping the pipes that are returned in that param.  Manually add to endpoint
  }
  console.log(endpoint);
  
  request.get(endpoint, function(err, res, body) {
    var parsed_json = JSON.parse(body);
    if (parsed_json["query-continue"]) { // recursively continue through the search until no more results from API
      getLinkBacks(title, parsed_json["query-continue"]["backlinks"]["blcontinue"], fn);
    }
    fn(body);
  });
};

var getArticle = function(query, fn) {
  console.log("finding article: " + query);
  var options = {query: query, format: "html", summaryOnly: true, section: 0};
    wp.searchArticle(options, function(err, htmlWikiText){
      if(err){
        console.log("An error occurred[query=%s, error=%s]", query, err);
        return;
      }
      fn(htmlWikiText);
    });
};

module.exports = {
  getLinkBacks: getLinkBacks,
  getArticle: getArticle
}