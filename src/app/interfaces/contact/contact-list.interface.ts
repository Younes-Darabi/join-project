export interface ContactInterface {
    id?: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    type: string;
    initials?: string; // Add this line
    color?: string;    // Add this if you use color property
    isYou?: boolean; // <--- Hinzufügen
}
