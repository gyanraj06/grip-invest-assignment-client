import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RiskDistribution {
  low: number;
  moderate: number;
  high: number;
}

interface RiskDistributionChartProps {
  riskDistribution: RiskDistribution;
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({
  riskDistribution,
}) => {
  const data = {
    labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
    datasets: [
      {
        data: [riskDistribution.low, riskDistribution.moderate, riskDistribution.high],
        backgroundColor: [
          '#10b981', // Green for low risk
          '#f59e0b', // Amber for moderate risk
          '#ef4444', // Red for high risk
        ],
        borderColor: [
          '#059669',
          '#d97706',
          '#dc2626',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          '#34d399',
          '#fbbf24',
          '#f87171',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
          color: '#6b7280',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'doughnut'>) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value.toFixed(2)}%`;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    cutout: '60%',
    animation: {
      animateRotate: true,
      duration: 1000,
    },
  };

  return (
    <div className="relative h-64 w-full">
      <Doughnut data={data} options={options} />
    </div>
  );
};