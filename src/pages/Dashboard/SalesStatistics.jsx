import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function getWeek(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - startOfYear) / 86400000 + 1;
  return Math.ceil(pastDaysOfYear / 7);
}

function SalesStatistics() {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    setSalesData(storedTransactions);
  }, []);

  const getDailySales = () => {
    const dailySales = {};
    salesData.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      dailySales[date] = (dailySales[date] || 0) + transaction.total;
    });
    return dailySales;
  };

  const getWeeklySales = () => {
    const weeklySales = {};
    salesData.forEach((transaction) => {
      const week = getWeek(new Date(transaction.date));
      weeklySales[week] = (weeklySales[week] || 0) + transaction.total;
    });
    return weeklySales;
  };

  const getMonthlySales = () => {
    const monthlySales = {};
    salesData.forEach((transaction) => {
      const month = new Date(transaction.date).getMonth();
      monthlySales[month] = (monthlySales[month] || 0) + transaction.total;
    });
    return monthlySales;
  };

  const getCategorySales = () => {
    const categorySales = {};
    salesData.forEach((transaction) => {
      transaction.items.forEach((item) => {
        categorySales[item.category] = (categorySales[item.category] || 0) + item.price * item.quantity;
      });
    });
    return categorySales;
  };

  const formatMonth = (monthIndex) =>
    new Date(0, monthIndex).toLocaleString('default', { month: 'short' });

  const dailySales = getDailySales();
  const weeklySales = getWeeklySales();
  const monthlySales = getMonthlySales();
  const categorySales = getCategorySales();

  const dailyLabels = Object.keys(dailySales);
  const weeklyLabels = Object.keys(weeklySales).map((w) => `Minggu ${w}`);
  const monthlyLabels = Object.keys(monthlySales).map((m) => formatMonth(m));
  const categoryLabels = Object.keys(categorySales);

  const chartOptions = (title) => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: title,
        color: '#1e293b',
        font: { size: 18, weight: 'bold' },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#94a3b8',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        ticks: { color: '#475569' },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#475569' },
        grid: { color: '#cbd5e1' },
      },
    },
  });

  const createChartData = (label, labels, data, color) => ({
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: color,
        borderRadius: 6,
      },
    ],
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-10 text-center">
        Statistik Penjualan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-md">
          <Bar
            data={createChartData('Penjualan Harian', dailyLabels, Object.values(dailySales), '#3b82f6')}
            options={chartOptions('Penjualan Harian')}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-md">
          <Bar
            data={createChartData('Penjualan Mingguan', weeklyLabels, Object.values(weeklySales), '#8b5cf6')}
            options={chartOptions('Penjualan Mingguan')}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-md">
          <Bar
            data={createChartData('Penjualan Bulanan', monthlyLabels, Object.values(monthlySales), '#f97316')}
            options={chartOptions('Penjualan Bulanan')}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-md">
          <Bar
            data={createChartData('Penjualan per Kategori', categoryLabels, Object.values(categorySales), '#10b981')}
            options={chartOptions('Penjualan per Kategori')}
          />
        </div>
      </div>
    </div>
  );
}

export default SalesStatistics;