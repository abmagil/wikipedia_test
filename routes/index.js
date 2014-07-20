/*
 * GET home page.
 */

exports.index = function(req, res){
	// HTTP MEDIA WIKI API // http://en.wikipedia.org/w/api.php?action=query&list=backlinks&bltitle=JSON&bllimit=300&format=json&blfilterredir=nonredirects&blnamespace=0&bldir=descending&blcontinue=0|JSON|42888724
	res.render('index');
};