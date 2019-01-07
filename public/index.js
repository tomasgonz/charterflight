var lc = new window.LineChart();
$.getJSON("public/data.json", function(json) {
    lc.ChartPlaceHolder = "chart-1";
    lc.LegendPlaceHolder = "legend-chart-1";
    lc.Data = json.data;
    lc.Width = 1000;
    lc.Height = 600;
    lc.Title = "Mortality under-5"
    lc.Draw();
});