var lc = new window.LineChart(height=400,width=400);
$.getJSON("public/data.json", function(json) {
    lc.ChartPlaceHolder = "chart-1";
    lc.ShowLegend = true;
    lc.Data = json.data;    
    lc.Title = "Mortality under-5"
    lc.Draw();
});