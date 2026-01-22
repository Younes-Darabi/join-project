/**
 * Interface representing sign-up registration data
 * Defines the structure for new user registration information
 * 
 * @author Kevin Hase
 */
export interface SignUpInterface {
    /** First name of the new user */
    firstname: string;
    
    /** Last name of the new user */
    lastname: string;
    
    /** Email address for the new user account */
    email: string;
    
    /** Password for the new user account */
    password: string;
}
