var TAU = 2 * Math.PI;
var socket = io();
var bbox, svg, target;
var outside_scale, circle, path, circle, article_display;
//TODO Convert to Backbone.js Model
var articles = {
  requests: 0,
  total_articles: 0,
  article_list: {},
  addArticleArray: function(article_ary) {
    article_ary.forEach(this.addArticle, this);
  },
  addArticle: function(article) {
    this.total_articles++;
  },
  reset: function() {
    this.total_articles = 0;
    this.article_list = {};
    this.requests = 0;
  }
};

var initialize_shapes = function() {
  // Represents each level of linkback
  path = target.append("path")
          .attr("stroke", "blue")
          .attr("stroke-width", 2);
  article_display = svg.append("text")
                      .attr('transform', "translate(" + (bbox.width / 2) + "," + (bbox.height / 2 - 5) + ")")
                      .style("text-anchor", "middle");
};
              
// Create svg container     
svg = d3.select("#main").append('svg')
        .attr("height", 600)
        .attr("width", 600);
bbox = svg[0][0].getBoundingClientRect();
// Center the circles in the bounding box
target = svg.append('g')
    .attr('transform', "translate(" + (bbox.width / 2) + "," + (bbox.height / 2) + ")");

initialize_shapes();

$("form").on("submit", function() {
    socket.emit("get article", $("#article_name").val());
    return false;
});
$('.btn-success').on("click", function() {
  socket.emit("need data", $("#article_name").val());
});

socket.on("new data", function(r) {
    data = JSON.parse(r)
    if (data["query"]) {
      articles.addArticleArray(data.query.backlinks)
      
      // continuously updated scale
      outside_scale = d3.scale.linear()
                        .domain([0, articles.total_articles])
                        .range([0,Math.min(bbox.width / 2 - 10, articles.total_articles)]);

      // continuously updated path generator
      circle = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(outside_scale(articles.total_articles))
                .startAngle(3 * TAU / 4)
                .endAngle( 5 * TAU / 4 );

      // Refresh displayed number of articles
      article_display.text(articles.total_articles);

      // redraw the line
      path.transition()
        .attr("d", circle(outside_scale(articles.total_articles)))
        .attr("fill", "none");
    }
})
.on("found article", function(article) {
  articles.requests++;
  $('#article_text').html(article);
  $("#find").addClass("hidden");
  $("#start").removeClass("hidden");
  $("#reset").removeClass("hidden");
});

// UI control
$("#reset").on("click", function() {
  $("input").val("");
  $("#find").removeClass("hidden");
  $("#start").addClass("hidden");
  $("#reset").addClass("hidden");
  $('#article_text').html("");
  var path = d3.select("path");
  path.transition().style("opacity", Number("1e-6")); // 1e-6 is the smallest number D3 can handle
  articles.reset();
  path.remove();
  article_display.remove();
  initialize_shapes();
});