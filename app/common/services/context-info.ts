
export class ContextInfo {
    public associationId: string;
    public associationName: string;
    public employerId: string;
    public employerName: string;
    public locationId: string;
    public locationName: string;
    public participantId: string;
    public participantName: string;
    public userName: string;
    public email: string;
    public token: string;
    public tokenExpires: Date;
    public displayName: string;
    public fullName: string;
    public userId: string;


    constructor() {
        this.associationId = '';
        this.employerId = '';
        this.locationId = '';        
        this.participantId = '';
    }
}
