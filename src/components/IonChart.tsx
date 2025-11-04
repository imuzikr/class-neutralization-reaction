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

interface IonChartProps {
  hData: { x: number; y: number }[];
  ohData: { x: number; y: number }[];
  naData: { x: number; y: number }[];
  clData: { x: number; y: number }[];
}

export default function IonChart({ hData, ohData, naData, clData }: IonChartProps) {
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
          text: '첨가한 NaOH 부피 (mL)',
          color: '#78350f',
          font: { size: 13, weight: 'bold' },
        },
        ticks: { color: '#92400e' },
        grid: { color: 'rgba(251, 191, 36, 0.15)' },
        min: 0,
        max: CONSTANTS.MAX_NAOH_VOLUME,
      },
      y: {
        title: {
          display: true,
          text: '이온 수 (상대값)',
          color: '#78350f',
          font: { size: 13, weight: 'bold' },
        },
        min: 0,
        max: 20,
        ticks: {
          color: '#92400e',
          stepSize: 2,
        },
        grid: { color: 'rgba(251, 191, 36, 0.15)' },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#78350f',
          font: { size: 12, weight: 'bold' },
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        bodyColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 2,
        padding: 12,
      },
    },
  };

  const chartData = {
    datasets: [
      {
        label: 'H⁺',
        data: hData,
        borderColor: '#eab308',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        borderWidth: 3,
        tension: 0,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#fbbf24',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'OH⁻',
        data: ohData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#60a5fa',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Na⁺',
        data: naData,
        borderColor: '#6b7280',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        borderWidth: 3,
        tension: 0,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#9ca3af',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Cl⁻',
        data: clData,
        borderColor: '#a1a1aa',
        backgroundColor: 'rgba(161, 161, 170, 0.05)',
        borderWidth: 2,
        tension: 0,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderDash: [5, 5],
        pointBackgroundColor: '#d4d4d8',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  return (
    <div className="h-[240px]">
      <Line options={options} data={chartData} />
    </div>
  );
}
