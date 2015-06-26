charterflight.BarChart = function BarChart() {

      width = this.Width - this.Margin.left - this.Margin.right,
        height = this.Height - this.Margin.top - this.Margin.bottom;

// Coerce the data into the right formats
    data = data.map(function(d) {
        return {
            country: d.country,
            value: +d.value
        };
    });

    var y = d3.scale.linear()
        .range([ height, 0]);

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1)
        .domain(d3.entries(data).map(function(d) {
            return d.value.country;
        }));

    y.domain([d3.min(data, function(d) {
        return d.value
    }), d3.max(data, function(d) {
        return d.value;
    })]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("body").append("svg")
        .attr("width", this.Width + this.Margin.left + this.Margin.right)
        .attr("height", this.Margin.Height + this.Margin.top + this.Margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.Margin.left + "," + this.Margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.Height + ")")
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
            return x(d.country)
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
            return "rotate(-90)"
        });

    return svg;

}
