import * as React from 'react';
import { BarChart } from '@mui/x-charts';
import { featureServices } from '../../services/featureService';
import { LoaderContext } from '../../App';
import { Box, CircularProgress } from '@mui/material';
import Loader from '../Loader';

export default function BasicBars(props) {
  const { barChartPreferences, currentDatasetName } = props

  // const { setIsLoading } = React.useContext(LoaderContext)

  const [isLoading, setIsLoading] = React.useState(false)

  console.log(currentDatasetName, "currentdatasetname")

  const [barChartData, setBarChartData] = React.useState(null)

  const getBarChartData = async (params) => {
    setIsLoading(true)
    const response = await featureServices.getBarChartData({ "preferences": params.preferences, "dataset_name": currentDatasetName })
    console.log(response, "response")
    setBarChartData(response.data)
    setIsLoading(false)
  }

  React.useEffect(() => {
    getBarChartData({ "preferences": barChartPreferences })
  }, [barChartPreferences])

  return (
    isLoading ? <Box sx={{width: 500, height: 350, display: "flex"}} alignItems={"center"} justifyContent={"center"}><CircularProgress/></Box> :  
    barChartData &&
      <BarChart 
      sx={{padding: "10px"}}
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
      height={350}
    />
  );
}
