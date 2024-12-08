"use client";

import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TimeLog {
    id: string;
    duration: number;
    priority: string;
}

export default function TimeByPriorityChart({ timeLogs }: { timeLogs: TimeLog[] }) {
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    const data = {
        labels: priorities,
        datasets: [
            {
                label: 'Time by Priority',
                data: priorities.map(priority => 
                    timeLogs
                        .filter(log => log.priority === priority)
                        .reduce((sum, log) => sum + log.duration, 0)
                ),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Time Spent by Priority' },
        },
    };

    return <Pie data={data} options={options} />;
}
