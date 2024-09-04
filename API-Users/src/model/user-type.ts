// import { educational } from "./edu";
// import { experience } from "./exp";


export interface typeUsers {
    surName?: string;
    lastName?: string;
    given_name?: string;
    username: string;
    email?: string;
    phone_number?: string;
    dob?: string;
    address?: string;
    martital_status?: string;
    // cv?: string;
    // edu?: educational; // Ensure `educational` is defined elsewhere
    // exp?: experience; // Ensure `experience` is defined elsewhere
    role?: string; // Add this if you're also storing the role
}

export interface PutUser {
    username: string|undefined;
    email:string|undefined;
    dob: string|undefined;
    address: string|undefined;
    phone_number:string|undefined;
    martital_status:string|undefined;
}

export interface typeSigup{
    surName:string;
    lastName:string;
    email:string;
    password:string;
    role?:string
}

export interface typeLogin{
    email:string;
    password:string;
}

export interface typeVerification{
    email:string
    code:string
}