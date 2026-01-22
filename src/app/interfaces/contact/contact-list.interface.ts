/**
 * Interface representing a contact in the contact list
 * Defines the structure for contact objects with personal information
 * 
 * @author Kevin Hase
 */
export interface ContactInterface {
    /** Unique identifier for the contact */
    id?: string;
    
    /** Email address of the contact */
    email: string;
    
    /** First name of the contact */
    firstname: string;
    
    /** Last name of the contact */
    lastname: string;
    
    /** Phone number of the contact */
    phone: string;
    
    /** Type or category of the contact */
    type: string;
    
    /** Initials derived from first and last name */
    initials?: string;
    
    /** Color assigned to the contact for visual identification */
    color?: string;
    
    /** Flag indicating if this contact represents the current user */
    isYou?: boolean;
}
