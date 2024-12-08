"use client";

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

interface TimeLog {
    id: string | number; // Umożliwia zarówno string, jak i number
    createdAt: Date;
    duration: number;
    taskId: string;
    userId: string;
    user: {
        id: string;
        createdAt: Date;
        username: string;
        email: string;
        password: string;
        role: string;
        avatar: string | null;
    };
}
export default function TimeLogChart({ timeLogs }: { timeLogs: TimeLog[] }) {
    const labels = [...new Set(timeLogs.map(log => new Date(log.createdAt).toLocaleDateString()))]; // Unikalne daty
    console.log(timeLogs.map(log => log));
    const users = [...new Set(timeLogs.map(log => log.user.username))]; // Unikalni użytkownicy

    const datasets = users.map(user => ({
        label: user,
        data: labels.map(label => {
            const logsForUserOnDate = timeLogs.filter(
                log =>
                    log.user?.username === user && // Sprawdzenie obecności użytkownika
                    new Date(log.createdAt).toLocaleDateString() === label
            );
            return logsForUserOnDate.reduce((sum, log) => sum + log.duration, 0);
        }),
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.6)`,
        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 1)`,
        borderWidth: 1,
    }));

    const data = { labels, datasets };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Time Logs by User' },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Time Spent (minutes)' },
            },
            x: {
                title: { display: true, text: 'Date' },
            },
        },
    };

    return <Bar data={data} options={options} />;
}
