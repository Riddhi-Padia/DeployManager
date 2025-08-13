
export interface Task {
    id: string;
    Title: string;
    Status: string;
    Priority: string;
    Type: string;
    Labels: string[];
    AssignedTo: string;
    DueDate: Date;
    IsActive: boolean;
    Description: string;
}
