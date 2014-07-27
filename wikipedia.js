var request = require('request');
var querystring = require('querystring');

var getLinkBacks = function(title, blcontinue, fn) {
  var root = "http://en.wikipedia.org/w/api.php?";
  var params = {
    action: "query",
    list:   "backlinks",
    bltitle: title,
    bllimit: 300,
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

module.exports = {
  getLinkBacks: getLinkBacks,
}