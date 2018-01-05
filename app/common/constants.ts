import { Injectable } from '@angular/core';


@Injectable() 
export class Constants {
    public get BaseApiUr(): string { return "http://api-laz.wovenmeasure.com/api/"; }
    public get BaseApiUrLocal(): string { return "http://laz.webapi/api/"; }

    public get BaseAttachmentUri(): string { return this.BaseApiUri + "attachment/getFile/"; }

    public alertStatusNew: number = 1;
    public alertStatusResolved: number = 2;
    public alertStatusDismissed: number = 3; 
    public alertStatusInProgress: number = 4;

    public alertRuleTypeChargeBackOrDispute: number = 5;

    public permissionBankReconcile: string = "BankReconcile";
    public permissionAudit: string = "Audit"; 

    public baiCodeLockboxCodes: string[] = [ '115' ];
    public baiCodeBankingAdjustmentCodes: string[] = ['937', '695', '938', '557', '631', '555', '187'];
    public baiCodeChecksPaidCodes: string[] = ['475'];
    public baiCodeZBACodes: string[] = ['575', '275'];
    public baiCodeOtherCreditsCodes: string[] = ['195', '201', '191', '295', '399', '166', '164'];
    public baiCodeOtherDebitsCodes: string[] = ['491', '495', '501', '455', '698', '661'];





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

    public getAlertTypeByConstant(constant: string) {
        return this.AlertTypes.filter(a => { return a.constant == constant })[0];
    }
    
    public get AlertTypes() {
        var alertTypes = [
            {
                constant: "LOC",            
                alertTypeID : 1,
                description: "Location"
            },
            {
                constant: "BANKDEP",
                alertTypeID: 2,
                description: "Bank Deposit"
            },
            {
                constant: "CREDC",
                alertTypeID: 3,
                description: "Credit Card"
            },
            {
                constant: "CREDCDISPUTES",
                alertTypeID: 5,
                description: "Credit Card/Disputes"
            },
            {
                constant: "WEBDCR",
                alertTypeID: 4,
                description: "WebDCR"
            },
            {
                constant: "REFUNDS",
                alertTypeID: 6,
                description: "Refunds"
            }
        ];

        return alertTypes;
    }

    public getBaiDescription(baiCodeStr: string): string {
        const baiCode: number = parseInt(baiCodeStr);
        if (baiCode === 301) {
            return "Commercial Deposit Credit";
        }
        else if (baiCode === 165) {
            return "Preauthorized ACH Credit";
        }
        else if (baiCode === 115) {
            return "Lockbox Deposit Credit";
        }
        else if (baiCode === 937) {
            return "Deposit Correction Cash Credit";
        }
        else if (baiCode === 695) {
            return "Deposit Correction Debit";
        }
        else if (baiCode === 938) {
            return "Deposit Correction Cash Debit";
        }
        else if (baiCode === 557) {
            return "Individual ACH Return Item DR";
        }
        else if (baiCode === 631) {
            return "Debit Adjustment";
        }
        else if (baiCode === 555) {
            return "Deposited Item Return Debit";
        }
        else if (baiCode === 187) {
            return "Cash Letter Pre-Encoded Dep CR";
        }
        else if (baiCode === 475) {
            return "Checks Paid Debit";
        }
        else if (baiCode === 575) {
            return "ZBA Debit";
        }
        else if (baiCode === 275) {
            return "ZBA Credit";
        }
        else if (baiCode === 195) {
            return "Incoming Money Transfer Credit";
        }
        else if (baiCode === 201) {
            return "Individual Auto Transfer CR";
        }
        else if (baiCode === 191) {
            return "Incoming Internal Money Trnsfr";
        }
        else if (baiCode === 295) {
            return "ATM Credit";
        }
        else if (baiCode === 399) {
            return "Miscellaneous Credit";
        }
        else if (baiCode === 166) {
            return "ACH Settlement Credit";
        }
        else if (baiCode === 164) {
            return "Corporate Trade Payment Credit";
        }
        else if (baiCode === 491) {
            return "Outgoing Internl Money Trnsfr";
        }
        else if (baiCode === 495) {
            return "Outgoing Money Transfer Debit";
        }
        else if (baiCode === 501) {
            return "Individual Auto Transfer DR";
        }
        else if (baiCode === 455) {
            return "Preauthorized ACH Debit";
        }
        else if (baiCode === 698) {
            return "Miscellaneous Fee DR";
        }
        else if (baiCode === 661) {
            return "Account Analysis Fee Debit";
        }

        return "";
    }
    

     //public preferedMethod = [{ value: 'Phone', display: 'Phone' }, { value: 'Text-Message', display: 'Text-Message' }, { value: 'Email', display: 'Email' }];

}

