import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { ChartDataPoint, BaseType, BASES } from '@/types/neutralization';
import { CONSTANTS } from '@/lib/neutralizationCalculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TemperatureChartProps {
  data: ChartDataPoint[];
  baseType: BaseType;
}

export default function TemperatureChart({ data, baseType }: TemperatureChartProps) {
  const baseInfo = BASES[baseType];

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: `첨가한 ${baseInfo.formula} 부피 (mL)`,
          color: '#78350f',
          font: { size: 13, weight: 'bold' },
        },
        ticks: { color: '#92400e' },
        grid: { color: 'rgba(251, 191, 36, 0.15)' },
        min: 0,
        max: CONSTANTS.MAX_BASE_VOLUME,
      },
      y: {
        title: {
          display: true,
          text: '온도 (°C)',
          color: '#78350f',
          font: { size: 13, weight: 'bold' },
        },
        min: 18,
        max: 32,
        ticks: {
          color: '#92400e',
          stepSize: 2,
        },
        grid: { color: 'rgba(251, 191, 36, 0.15)' },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#d97706',
        bodyColor: '#374151',
        borderColor: '#f59e0b',
        borderWidth: 2,
        padding: 12,
        callbacks: {
          label: (context) => `온도: ${context.parsed.y.toFixed(2)} °C`,
        },
      },
    },
  };

  const chartData = {
    datasets: [
      {
        label: '온도',
        data: data,
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 3,
        tension: 0,
        pointBackgroundColor: '#fb923c',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
      },
    ],
  };

  return (
    <div className="h-[240px]">
      <Line options={options} data={chartData} />
    </div>
  );
}
