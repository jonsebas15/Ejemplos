export interface ChatGroup {
    senderId:string;
    message:string;
    timestamp: number;
    isCurrentUser?: boolean;
    id?:string;
    
}
