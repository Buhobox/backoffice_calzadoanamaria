import {
  Bar,
  Bubble,
  Doughnut,
  Line,
  Radar,
  Polar,
  Scatter,
  HorizontalBar,
} from "react-chartjs-2";
import { Row, Col } from "antd";

export default function Charts() {
  const data = {
    labels: ["Mujeres", "Hombres", "Mujeres-solteras", "Hombre-solteros"],
    datasets: [
      {
        label: "# of Votes",
        data: [28, 19, 16, 18],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const datascatter = {
    labels: ["Scatter"],
    datasets: [
      {
        label: "My First dataset",
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 3,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 4,
        pointRadius: 5,
        pointHitRadius: 10,
        data: [
          { x: 65, y: 75 },
          { x: 59, y: 49 },
          { x: 80, y: 90 },
          { x: 81, y: 29 },
          { x: 56, y: 36 },
          { x: 55, y: 25 },
          { x: 40, y: 18 },
        ],
      },
    ],
  };

 
 

 

  const options = {
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

  return (
    <>
      <Row>
        <Col span={6}>
          <Bar data={data} width={50} height={50} options={options} />
        </Col>
        <Col span={6}>
          <Bubble data={datascatter} width={50} height={50} options={options} />
        </Col>
        <Col span={6}>
          <Doughnut data={data} width={50} height={50} options={options} />
        </Col>
        <Col span={6}>
          <Line data={data} width={50} height={50} options={options} />
        </Col>
      </Row>

      <Row>
        <Col span={6}>
          <Radar data={data} width={50} height={50} options={options} />
        </Col>
        <Col span={6}>
          <Polar data={data} width={50} height={50} options={options} />
        </Col>
        <Col span={6}>
          <Scatter
            data={datascatter}
            width={50} height={50}
          />
        </Col>
        <Col span={6}>
          <Line data={data} width={50} height={50} options={options} />
        </Col>
      </Row>


      <Row justify="center">
        <Col span={6}>
          <HorizontalBar data={data} width={50} height={50} options={options} />
        </Col>
        
      </Row>


    </>
  );
}
