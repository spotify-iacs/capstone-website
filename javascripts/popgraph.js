/**
 * Created by omarabboud1 on 2017-05-14.
 */

var margin_g = {top: 30, right: 30, bottom: 40, left: 48};

var width_g = (560/2) - margin_g.left - margin_g.right,
    height_g = 250 - margin_g.top - margin_g.bottom;

var svg3 = d3.select("#chart-area").append("svg")
    .attr("width", width_g + margin_g.left + margin_g.right)
    .attr("height", height_g + margin_g.top + margin_g.bottom)
    .attr("class","probsvg")
    .append("g")
    .attr("transform", "translate(" + margin_g.left + "," + margin_g.top + ")");

var xpop = d3.scaleBand().rangeRound([0, width_g]).padding(0.1);
var ypop = d3.scaleLinear().range([height_g,0]);

xpop.domain(["Low","High"]);
ypop.domain([0,75]);

svg3.append("g")
    .attr("transform","translate(0,0)")
    .attr("class", "y-axis axis")
    .call(d3.axisLeft(ypop));

svg3.append("g")
    .attr("transform", "translate(0," + height_g + ")")
    .attr("class", "x-axis axis")
    .call(d3.axisBottom(xpop));

svg3.append("text")
    .attr("transform", "translate(30,210)")
    .text("Mean Track Popularity");

svg3.append("text")
    .attr("transform", "translate(-35,150)rotate(-90)")
    .text("Proportion of Playlist");

/*var yAxis = d3.svg.axisLeft().scale(y);

 var yAxisGroup = svg2.append("g")
 .attr("class", "y-axis axis");

 var xAxis = d3.svg.axisBottom(x);

 var xAxisGroup = svg2.append("g")
 .attr("transform", "translate(0," + height_g + ")")
 .attr("class", "x-axis axis");


 svg2.select(".y-axis")
 .transition().duration(800)
 .call(yAxis);

 svg2.select(".x-axis")
 .transition().duration(800)
 .call(xAxis);*/

PopGraph = function(_play, _data){

    _data.forEach(function(d){
        d.class = +d.class;
        d.probabilities = +d.probabilities
    });

    _play.forEach(function(d){
        d.popularity = +d.popularity;
        d.track_order = +d.track_order;
    });

    this.data = _data;
    this.displaydata = _data;
    this.playdata = _play;

    /*


     _data[2].forEach(function(d, i){
     d.index = i});
     this.parentElement = _parentElement;
     this.countries = _data[0];
     this.nodes = _data[1];
     this.flows = _data[2];
     this.displayFlows =_data[2];
     // console.log(this.displayFlows)
     this.selection = "None";
     this.initVis();*/

}
PopGraph.prototype.wrangleData = function(selectSong, selectBucket){
    var vis = this;
    vis.selectedSong = selectSong;
    vis.selectedBucket = selectBucket;
    console.log("about to loop through data");

    /*console.log(vis.data);*/

    var filteredData = vis.playdata.filter(function(d){
        if((d.bucket_name == selectBucket) & (d.seed_id == selectSong)){ return d; }
    });

    var low_pop = filteredData.filter(function(d){
        if(d.popularity < 50){return d;}
    });

    var high_pop = filteredData.filter(function(d){
        if(d.popularity >= 50){return d;}
    });


    formatter = d3.format(".2n");

    var mean_low = formatter(low_pop.length / filteredData.length);
    var mean_high = formatter(high_pop.length / filteredData.length);

    if (mean_high == "NaN") {
        mean_high = formatter(0);
    }

    if (mean_low == "NaN") {
        mean_low = formatter(0);
    }

    var means = [
        {name: "Low", mean: mean_low},
        {name: "High", mean: mean_high}
    ];



    var bars = svg3.selectAll(".bar")
        .remove()
        .exit()
        .data(means);

    bars
        .enter().append("rect")
        .attr("class","bar")
        .attr("x",function(d){return xpop(d.name)+11;})
        .attr("width",60)
        .attr("height",function(d){ return height_g - ypop(d.mean);})
        .attr("y",function(d){return ypop(+d.mean);});

    /*bars
     .attr("x", function(d){console.log(d.class); return x(d.class);})
     .attr("y", function(d){return y(+d.probabilities);})
     .attr("width", 10)
     .attr("height", function(d){ return height_g - y(d.probabilities);});*/

    var text = svg3.selectAll(".text")
        .remove()
        .exit()
        .data(means);

    text
        .enter().append("text")
        .attr("class","text")
        .attr("text-anchor", "right")
        .attr("x", function(d) { return xpop(d.name) + (x.bandwidth() / 2) +15; })
        .attr("y", function(d) { return ypop(d.mean) - 5;})
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .text(function(d) {
            return d.mean;
        });

    text.exit().remove();



}
