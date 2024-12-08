"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Definiowanie typu dla zadania
interface Task {
    status: "TODO" | "IN_PROGRESS" | "DONE";
    estimatedPoints?: number;
}

interface Props {
    tasks: Task[];
}

export default function PointsByStatusChart({ tasks }: Props) {
    const statuses: Task["status"][] = ["TODO", "IN_PROGRESS", "DONE"];

    const data = {
        labels: statuses,
        datasets: [
            {
                label: "Estimated Points",
                data: statuses.map(status =>
                    tasks
                        .filter(task => task.status === status)
                        .reduce((total, task) => total + (task.estimatedPoints || 0), 0)
                ),
                backgroundColor: ["#3498db", "#f1c40f", "#2ecc71"],
                borderColor: ["#2980b9", "#f39c12", "#27ae60"],
                borderWidth: 1,
            },
        ],
    };

    const options: ChartJS.ChartOptions<"bar"> = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Chart by task's estimated points" },
        },
    };

    return <Bar data={data} options={options} />;
}
