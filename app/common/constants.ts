import { Injectable } from '@angular/core';


@Injectable()
export class Constants {
    public get BaseApiUriProd(): string { return "http://wellview.webapi/api/"; }
    public get BaseApiUri(): string { return "http://laz.webapi/api/"; }

    public get RegistrationStatus_Contact(): number { return 1; } 
    public get RegistrationStatus_Insurance(): number { return 2; } 
    public get RegistrationStatus_Terms(): number { return 3; } 
    public get RegistrationStatus_Dash(): number { return 4; } 

     
    public get US_States() {
        var states = [
            { state: 'Alabama', postCode: 'AL' }, { state: 'Alaska', postCode: 'AK' }, { state: 'Arizona', postCode: 'AZ' }, { state: 'Arkansas', postCode: 'AR' }, { state: 'California', postCode: 'CA' },
            { state: 'Colorado', postCode: 'CO' }, { state: 'Connecticut', postCode: 'CT' }, { state: 'Delaware', postCode: 'DE' }, { state: 'District Of Columbia', postCode: 'DC' },
            { state: 'Florida', postCode: 'FL' }, { state: 'Georgia', postCode: 'GA' }, { state: 'Hawaii', postCode: 'HI' }, { state: 'Idaho', postCode: 'ID' }, { state: 'Illinois', postCode: 'IL' },
            { state: 'Indiana', postCode: 'IN' }, { state: 'Iowa', postCode: 'IA' }, { state: 'Kansas', postCode: 'KS' }, { state: 'Kentucky', postCode: 'KY' }, { state: 'Louisiana', postCode: 'LA' },
            { state: 'Maine', postCode: 'ME' }, { state: 'Maryland', postCode: 'MD' }, { state: 'Massachusetts', postCode: 'MA' }, { state: 'Michigan', postCode: 'MI' }, { state: 'Minnesota', postCode: 'MN' },
            { state: 'Mississippi', postCode: 'MS' }, { state: 'Missouri', postCode: 'MO' }, { state: 'Montana', postCode: 'MT' }, { state: 'Nebraska', postCode: 'NE' }, { state: 'Nevada', postCode: 'NV' },
            { state: 'New Hampshire', postCode: 'NH' }, { state: 'New Jersey', postCode: 'NJ' }, { state: 'New Mexico', postCode: 'NM' }, { state: 'New York', postCode: 'NY' },
            { state: 'North Carolina', postCode: 'NC' }, { state: 'North Dakota', postCode: 'ND' }, { state: 'Ohio', postCode: 'OH' }, { state: 'Oklahoma', postCode: 'OK' }, { state: 'Oregon', postCode: 'OR' },
            { state: 'Pennsylvania', postCode: 'PA' }, { state: 'Rhode Island', postCode: 'RI' }, { state: 'South Carolina', postCode: 'SC' }, { state: 'South Dakota', postCode: 'SD' },
            { state: 'Tennessee', postCode: 'TN' }, { state: 'Texas', postCode: 'TX' }, { state: 'Utah', postCode: 'UT' }, { state: 'Vermont', postCode: 'VT' }, { state: 'Virginia', postCode: 'VA' },
            { state: 'Washington', postCode: 'WA' }, { state: 'West Virginia', postCode: 'WV' }, { state: 'Wisconsin', postCode: 'WI' }, { state: 'Wyoming', postCode: 'WY' }
        ];

        return states;
    }

    public get User_Relations() {
        var relations = [
            { relation: 'Parent' },
            { relation: 'Friend' },
            { relation: 'Other' },
            { relation: 'Spouse' },
            { relation: 'Caretaker' },
            { relation: 'Partner' }
        ];
        return relations;
    }


     //public preferedMethod = [{ value: 'Phone', display: 'Phone' }, { value: 'Text-Message', display: 'Text-Message' }, { value: 'Email', display: 'Email' }];

}

