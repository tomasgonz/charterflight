"use strict";

var LineChartStyles = {
  Conventional: {
    ShowDataPoint: true,
    DataPoint : {
      ShapeDataPoint : "circle",
      SizeDataPoint : 3,
      StrokeWidth : "1px"
    },

    Axis : {
      y : {
        font :"14px sans-serif"
      },
      x : {
        font : "14px sans-serif"
      }
    },
    StrokeWidth : 1,
    ToolTip:
    {
      border: "1px solid #ddd",
      font: "1em sans-serif",
      border_radius: "8px",
      box_shadow: "0 1px 2px rgba(0,0,0,0.5)",
      padding: "3px 10px 3px 10px",
      background_color: "#fff",
      position: "absolute"
    }
  }
};

export default LineChartStyles;
