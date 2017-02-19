
export class CredentialInfo {
    firstName: string;
    middleName: string;
    lastName: string;
    nickName: string;
    email: string;
    password: string;
    visionStatement: string;
    visionImageUrlDesk: string;
    visionImageUrlMob: string;
}

export class ContactInfo {
    address: string;
    city: string;
    state: string;
    zip: number;
    homePhone: number;
    mobilePhone: number;
    prefferedMethod: string;
    emergencyContact: string;
    relation: string;
    emergencyPhone: number;
}

export class InsuranceInfo {
    carrier: string;
    groupNo: string;
    memberNo: string;
}

export class TermsConditionInfo {
    termsAccepted: boolean;
}

export class ParticipantContext {
    success: string;
    responseMsg: string;
    id: string;
    registrationStatus: number;
    contactLocalSave: boolean;
    insuranceLocalSave: boolean;
    hsaAssesmentComp: boolean;
    currentGroup: number;
    finalGroup: number;
    checkUpComp: boolean;
    screeningScheduled: boolean;
    contactUpdateId: string;
    insuranceUpdateId: string;
    triggerDashboardPop: boolean;
    userAvatar: string;

}
