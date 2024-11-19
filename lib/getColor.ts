export function getPriorityColor(priority: string): string {
    if (priority === "HIGH") return "bg-red-400 text-white";
    if (priority === "MEDIUM") return "bg-yellow-400 text-white";
    if (priority === "LOW") return "bg-green-400 text-white";
    return "bg-gray-200 text-gray";
}

export function getStatusColor(status: string): string {
    if (status === "TODO") return "bg-blue-400 text-white";
    if (status === "IN_PROGRESS") return "bg-yellow-600 text-white";
    if (status === "DONE") return "bg-green-600 text-white";
    return "bg-gray-200 text-gray-700";
}
