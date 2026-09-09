import { Profile } from "./profiles";

export interface Feedback {
    id:string;
    subject:string;
    message:string;
    technician_id:string;
    created_at:string;
    
    technician:Profile;
}