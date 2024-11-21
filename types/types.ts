export interface Task {
    id: string;
    taskName: string;
    description?: string;
    status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}
