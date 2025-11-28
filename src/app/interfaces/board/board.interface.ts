import { ContactInterface } from './../contact/contact-list.interface';
export interface BoardInterface {
    status: any;
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    assignedTo: ContactInterface[];
    category: string;
    subtasks: string[];
}
