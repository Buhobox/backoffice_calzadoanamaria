import React from "react";
import {
    Doughnut,
  } from "react-chartjs-2";

export const DonaGrafico = ({ databar }) => {
  const options = {
    legend: {
      display: false
  },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  const datashow = {
    labels: databar.labels,
    titulo:databar.title,
    datasets: [
      {
        data: databar.percent,
        backgroundColor: databar.colors,
        borderColor: databar.colors,
        borderWidth: 1,
      },
    ],
  };



  return (
   
  <Doughnut data={datashow} width={70} height={70} options={options} />

  );
};
