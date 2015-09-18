charterflight.BarChart = function BarChart()
{
  this.ShowLegend = false;
  this.Width = 200;
  this.Height = 200;
  this.svg = null;

  this.Margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };

  this.BlurbPlaceHolder = "";
  this.ChartPlaceHolder = "";

  this.Data = null;
};

charterflight.BarChart.prototype.Draw = function() {

  this.svg = null;

      width = this.Width - this.Margin.left - this.Margin.right;
      height = this.Height - this.Margin.top - this.Margin.bottom;

// Coerce the data into the right formats
    data = data.map(function(d) {
        return {
            entity: d.entity,
            value: +d.value
        };
    });

    var y = d3.scale.linear()
        .range([ height, 0]);

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1)
        .domain(d3.entries(data).map(function(d) {
            return d.value.entity;
        }));

    y.domain([d3.min(data, function(d) {
        return d.value;
    }), d3.max(data, function(d) {
        return d.value;
    })]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select(this.ChartPlaceHolder).append("svg")
        .attr("width", this.Width + this.Margin.left + this.Margin.right)
        .attr("height", this.Height + this.Margin.top + this.Margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.Margin.left + "," + this.Margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");
    //.text("Percent");

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.entity);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            return y(d.value);
        })
        .attr("height", function(d) {
            return height - y(d.value);
        })
        .style("fill", "#1684ca");


        svg.selectAll(".x.axis text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-90)";
        });

    return svg;
};
