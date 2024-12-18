import React, { useEffect, useRef } from 'react';
import { Chart, CategoryScale } from 'chart.js';
import 'chart.js/auto';

Chart.register(CategoryScale);

const MachineUsageChart = ({ jobs }) => {
    const chartRef = React.useRef(null);
    const chartInstanceRef = React.useRef(null);
  
    React.useEffect(() => {
      const ctx = chartRef.current.getContext('2d');
  
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
  
      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: jobs.map((job, index) => `Job ${index + 1}`),
          datasets: [
            {
              label: 'Usage (Meters)',
              data: jobs.map((job) => job.usage),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'category',
            },
          },
        },
      });
  
      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
      };
    }, [jobs]);
  
    return (
      <div className="mt-6" style={{ height: '300px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    );
  };
  

export default MachineUsageChart;