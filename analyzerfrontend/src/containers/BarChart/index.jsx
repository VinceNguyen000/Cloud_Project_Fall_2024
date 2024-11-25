import React from "react";
import { Chart } from "react-google-charts";

function BarChart(props) {

    const {data, options} = props
  return (
    <Chart
      // Note the usage of Bar and not BarChart for the material version
      chartType="Bar"
      data={data}
      options={options}
    />
  );
}

export default BarChart;