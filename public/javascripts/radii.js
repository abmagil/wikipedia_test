
var socket = io();
var bbox, svg, target;
var articles = {
  requests: 0,
  total_articles: 0,
  article_list: {},
  addArticleArray: function(article_ary) {
    article_ary.forEach(this.addArticle, this);
  },
  addArticle: function(article) {
    console.log(this.article_list);
    if (this.article_list[this.requests]) {
      this.article_list[this.requests].push(article);
    } else {
      this.article_list[this.requests] = [article];
    }
    this.total_articles++;
  },
  reset: function() {
    this.total_articles = 0;
    this.article_list = {};
    this.requests = 0;
  }
};
              
// Create svg container     
svg = d3.select("#main").append('svg')
        .attr("height", 600)
        .attr("width", 600);
bbox = svg[0][0].getBoundingClientRect();

// Scale to keep the outermost radius on the edge of the box
var outside_scale = d3.scale.linear()
                      .domain([0,Math.max(bbox.width,articles.total_articles)])
                      .range([0,bbox.width]);

// Scale to keep the innermost radius equivalent to the next-smallest size
// var inside_scale = d3.scale.linear()
//                       .domain()
//                       .range();


// Path generator
var circle = d3.svg.arc()
              .innerRadius(0)
              .outerRadius(function(d) {return radial_scale(d)})
              .startAngle(0)
              .endAngle( 2 * Math.PI);
 // Center the circles in the bounding box
var target = svg.append('g')
    .attr('transform', "translate(" + (bbox.width / 2) + "," + (bbox.height / 2) + ")");


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
      target.append("path")
        .attr("d", circle(radial_scale(articles.total_articles)))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");
    }
})
.on("found article", function(article) {
  articles.requests++;
  $('#article_text').html(article);
  $(".btn-primary").addClass("hidden");
  $(".btn-success").removeClass("hidden");
  $(".btn-warning").removeClass("hidden");
});
$(".btn-warning").on("click", function() {
  $("input").val("");
  $(".btn-primary").removeClass("hidden");
  $(".btn-success").addClass("hidden");
  $(".btn-warning").addClass("hidden");
  $('#article_text').html("");
  articles.reset();
  svg.selectAll("path").remove();
})

 

