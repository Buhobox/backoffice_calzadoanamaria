import React from "react";
import { Bar } from "react-chartjs-2";

export const BarGrafico = ({ databar }) => {
  const options = {
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
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
    titulo: databar.title,
    datasets: [
      {
        data: databar.data,
        backgroundColor: databar.colors,
        borderColor: databar.colors,

        borderWidth: 1,
      },
    ],
  };

  // console.log(datashow);
  return <Bar data={datashow} width={30} height={30} options={options} />;
};
