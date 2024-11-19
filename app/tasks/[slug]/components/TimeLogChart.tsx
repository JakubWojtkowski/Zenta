"use client"

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

export default function TimeLogChart({ timeLogs }: { timeLogs: { id: string; duration: number; createdAt: string }[] }) {
    const data = {
        labels: timeLogs.map(log => new Date(log.createdAt).toLocaleDateString()), // Daty logów jako etykiety
        datasets: [
            {
                label: 'Czas pracy (godziny)',
                data: timeLogs.map(log => log.duration),
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Kolor słupków
                borderColor: 'rgba(54, 162, 235, 1)', // Kolor obramowania
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Czas pracy na zadaniu' },
        },
    };

    return <Bar data={data} options={options} />;
}
