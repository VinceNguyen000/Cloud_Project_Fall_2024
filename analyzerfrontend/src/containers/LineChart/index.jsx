// import React from "react";
// import { Chart } from "react-google-charts";

// function BarChart(props) {

//     const {data, options} = props

//   return (
//     <Chart
//       // Note the usage of Bar and not BarChart for the material version
//       chartType="Bar"
//       data={data}
//       options={options}
//     />
//   );
// }

import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts';
import { featureServices } from '../../services/featureService';

export default function BasicLines(props) {
  const { lineChartPreferences, currentDatasetName } = props

  const [lineChartData, setLineChartData] = React.useState(null)

  const getLineChartData = async (params) => {
    const response = await featureServices.getLineChartData({"preferences" : params.preferences, "dataset_name": currentDatasetName})
    console.log(response, "response")
    setLineChartData(response.data)
}

  React.useEffect(()=>{
    getLineChartData({"preferences": lineChartPreferences})
  },[currentDatasetName])


  console.log(lineChartData, "linechartdata")
  // if(lineChartData){
  //   console.log(typeof lineChartData[0]["date"])
  // }

  return (
    lineChartData &&
    <LineChart
    xAxis={[
      {
        dataKey: 'category',
        scaleType: 'band',
        label: lineChartData?.label_mapping?.['category']
      },
    ]}
    // xAxis={[{ dataKey: 'date', valueFormatter: (value) => value.toString() }]}
    series={[
      {
        dataKey: 'dependent_1',
        label: lineChartData?.label_mapping?.['dependent_1']
      },
      {
        dataKey: 'dependent_2',
        label: lineChartData?.label_mapping?.['dependent_2']
      },
      {
        dataKey: 'dependent_3',
        label: lineChartData?.label_mapping?.['dependent_3']

      }
    ]}
    dataset={lineChartData.data}
    width={500}
    height={300}
    />
  );
}
