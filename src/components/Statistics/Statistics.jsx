import PropTypes from 'prop-types';
import {useMemo} from "react";
import {Pie} from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {capitalize} from '../../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend);

const chartColors = {
  accepted: '#28A745',
  approved: '#1B5E25',
  cancelled: '#CA786A',
  rejected: '#DC3545',
  processing: '#FFC107',
  ready: '#007BFF',
}

function Statistics({data}) {
  
  const statusesCnt = useMemo(() => {
    const totalCnt = {};
    data.forEach((item) => {
      if (totalCnt[item.status]) {
        totalCnt[item.status]++;
      }
      else {
        totalCnt[item.status] = 1;
      }
    });
    return totalCnt;
  }, [data]);
  
  const chartData = useMemo(() => {
    const pieData = Object.entries(statusesCnt).map(([status, count]) => (
            {
              label: `${capitalize(status)} (${count})`,
              value: count,
              color: chartColors[status],
            }));
    const chartOptions = {
      labels: pieData.map(item => item.label),
      datasets: [
        {
          data: pieData.map(item => item.value),
          backgroundColor: pieData.map(item => item.color),
        },
      ],
    };
    return chartOptions;
  }, [statusesCnt]);
  
  
  return (
          <Pie data={chartData} width={400} height={400}/>
  
  );
}

Statistics.propTypes = {
  data: PropTypes.array.isRequired,
}
export default Statistics;
