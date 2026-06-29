import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TemperatureChart() {
  const data = {
    labels: [
      "06:00",
      "06:15",
      "06:30",
      "06:45",
      "07:00",
      "07:15",
      "07:30",
      "07:45"
    ],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [50, 90, 180, 260, 300, 250, 180, 80],
        borderColor: "#4ade80",
        backgroundColor: "#4ade80",
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white"
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "white"
        }
      },
      y: {
        ticks: {
          color: "white"
        }
      }
    }
  };

  return <Line data={data} options={options} />;
}

export default TemperatureChart;