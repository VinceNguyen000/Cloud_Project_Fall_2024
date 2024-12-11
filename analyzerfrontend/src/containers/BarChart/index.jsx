import * as React from 'react';
import { BarChart } from '@mui/x-charts';
import { featureServices } from '../../services/featureService';

export default function BasicBars(props) {
  const { barChartPreferences, currentDatasetName } = props

  console.log(currentDatasetName, "currentdatasetname")

  const [barChartData, setBarChartData] = React.useState(null)

  const getBarChartData = async (params) => {
    const response = await featureServices.getBarChartData({ "preferences": params.preferences, "dataset_name": currentDatasetName })
    console.log(response, "response")
    setBarChartData(response.data)
  }

  React.useEffect(() => {
    getBarChartData({ "preferences": barChartPreferences })
  }, [currentDatasetName])

  return (
    barChartData &&
    <BarChart
      xAxis={[
        {
          dataKey: 'category',
          scaleType: 'band',
          label: barChartData?.label_mapping?.['category']
        },
      ]}
      // xAxis={[{ dataKey: 'date', valueFormatter: (value) => value.toString() }]}
      series={[
        {
          dataKey: 'dependent_1',
          label: barChartData?.label_mapping?.['dependent_1']
        },
        {
          dataKey: 'dependent_2',
          label: barChartData?.label_mapping?.['dependent_2']
        },
        {
          dataKey: 'dependent_3',
          label: barChartData?.label_mapping?.['dependent_3']

        }
      ]}
      dataset={barChartData.data}
      width={500}
      height={300}
    />
  );
}
