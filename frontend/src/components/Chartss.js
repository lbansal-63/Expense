import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { sortCategoryWise } from '../utils/seperator';

ChartJS.register(ArcElement, Tooltip, Legend);


export function Chartss(props) {
//  console.log(props.exdata)
  // const [expdata ,] = useState(props.exdata);
  // const [totalexp , setTotalexp] = useState([]);
  let categories = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food','Fun','Other'];
  const totalexp = sortCategoryWise(props.exdata , categories);
  // console.log(totalexp)
///////////////////////////////////////////////////////////////////////////
const data = {
  labels: ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food','Fun','Other'],
  datasets: [
    {
      label: "Rs",
      data: totalexp,
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(230, 57, 70,0.7)',
        'rgba(255, 159, 64, 0.7)',
      ],
      hoverBackgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(230, 57, 70,1)',
        'rgba(255, 159, 64, 1)',
      ],
      hoverBorderColor: '#ffffff',
      hoverBorderWidth: 4,
      hoverOffset: 25,
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(230, 57, 70,1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 2,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        font: {
          family: "'Montserrat', sans-serif",
          size: 14,
          weight: 'bold'
        },
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.9)',
      titleColor: '#fff',
      bodyColor: '#fff',
      bodyFont: {
        size: 16,
        weight: 'bold'
      },
      padding: 15,
      cornerRadius: 10,
      displayColors: true,
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      callbacks: {
        label: function(context) {
          let label = context.label || '';
          if (label) {
            label += ': ₹';
          }
          if (context.parsed !== null) {
            label += context.parsed;
          }
          return label;
        }
      }
    }
  },
  animation: {
    animateScale: true,
    animateRotate: true
  }
};

  //////////////////////////////////////////////////////////////////
  return (
    <div className='w-full h-[500px] flex items-center justify-center relative group'>
      {/* Glow Behind the chart on hover */}
      <div className='absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out z-0'></div>
      
      <div className='relative z-10 w-full h-full transform transition-transform duration-500 group-hover:scale-105'>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

