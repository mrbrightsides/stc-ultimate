'use client';

import React from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const chartColors = {
  purple: 'rgb(168, 85, 247)',
  pink: 'rgb(236, 72, 153)',
  cyan: 'rgb(34, 211, 238)',
  green: 'rgb(34, 197, 94)',
  yellow: 'rgb(250, 204, 21)',
  orange: 'rgb(251, 146, 60)',
};

// Market Growth Chart
export function MarketGrowthChart(): JSX.Element {
  const data: ChartData<'line'> = {
    labels: ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'],
    datasets: [
      {
        label: 'Tourism Revenue (Billion USD)',
        data: [19.2, 22.5, 27.8, 35.6, 45.2, 57.8, 73.4, 94.1],
        borderColor: chartColors.purple,
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Smart Tourism Investment',
        data: [2.1, 3.5, 5.8, 9.4, 15.2, 24.5, 39.4, 63.5],
        borderColor: chartColors.cyan,
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'rgb(209, 213, 219)' },
      },
      title: {
        display: true,
        text: 'Indonesia Tourism Market Growth Projection',
        color: 'rgb(209, 213, 219)',
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        ticks: { color: 'rgb(156, 163, 175)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: 'rgb(156, 163, 175)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return <Line data={data} options={options} />;
}

// Token Distribution Chart
export function TokenDistributionChart(): JSX.Element {
  const data: ChartData<'doughnut'> = {
    labels: ['Community Rewards', 'Ecosystem Development', 'Team & Advisors', 'Public Sale', 'Strategic Partners'],
    datasets: [
      {
        data: [40, 25, 15, 10, 10],
        backgroundColor: [
          chartColors.purple,
          chartColors.cyan,
          chartColors.pink,
          chartColors.green,
          chartColors.yellow,
        ],
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: 'rgb(209, 213, 219)' },
      },
      title: {
        display: true,
        text: 'STC Token Distribution',
        color: 'rgb(209, 213, 219)',
        font: { size: 16 },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}

// User Growth Roadmap Chart
export function UserGrowthChart(): JSX.Element {
  const data: ChartData<'bar'> = {
    labels: ['Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026', '2027', '2028', '2029-2030'],
    datasets: [
      {
        label: 'Active Users',
        data: [100, 500, 2000, 10000, 50000, 200000, 1000000, 10000000],
        backgroundColor: chartColors.purple,
      },
      {
        label: 'SME Partners',
        data: [5, 20, 50, 150, 500, 5000, 25000, 100000],
        backgroundColor: chartColors.cyan,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'rgb(209, 213, 219)' },
      },
      title: {
        display: true,
        text: 'Platform Growth Roadmap',
        color: 'rgb(209, 213, 219)',
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        type: 'logarithmic',
        ticks: { color: 'rgb(156, 163, 175)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: 'rgb(156, 163, 175)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

// Cost Comparison Chart
export function CostComparisonChart(): JSX.Element {
  const data: ChartData<'bar'> = {
    labels: ['Transaction Fees', 'Commission Rates', 'Payment Processing', 'Total Cost'],
    datasets: [
      {
        label: 'Traditional OTA',
        data: [3.5, 20, 2.5, 26],
        backgroundColor: chartColors.orange,
      },
      {
        label: 'STC Ultimate',
        data: [0.01, 3, 0.5, 3.51],
        backgroundColor: chartColors.green,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'rgb(209, 213, 219)' },
      },
      title: {
        display: true,
        text: 'Cost Comparison: Traditional vs STC Ultimate (%)',
        color: 'rgb(209, 213, 219)',
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        ticks: { color: 'rgb(156, 163, 175)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: 'rgb(156, 163, 175)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

// IoT Sensor Distribution
export function IoTSensorChart(): JSX.Element {
  const data: ChartData<'pie'> = {
    labels: ['Environmental', 'Visitor Density', 'Energy Monitoring', 'Security', 'Transportation'],
    datasets: [
      {
        data: [150, 120, 80, 100, 50],
        backgroundColor: [
          chartColors.green,
          chartColors.purple,
          chartColors.yellow,
          chartColors.pink,
          chartColors.cyan,
        ],
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: 'rgb(209, 213, 219)' },
      },
      title: {
        display: true,
        text: 'IoT Sensor Distribution (500 Total)',
        color: 'rgb(209, 213, 219)',
        font: { size: 16 },
      },
    },
  };

  return <Pie data={data} options={options} />;
}
