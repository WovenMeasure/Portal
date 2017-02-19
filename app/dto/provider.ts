export class Provider {
    public id: string;  
    public providerNumber: string;
    public title: string;
    public firstName: string;
    public lastName: string;
    public heroImageId: string;
    public isGeneralCounselor: boolean;
    public fullName: string;

}

 export class ProviderAppointmentTypes {
     public appointmentTypeId: string;

     constructor() { }

     public ProviderAppointmentTypes(_appointmentTypeId: string) {
         this.appointmentTypeId = _appointmentTypeId;
     }

}
