export class Merchant {

    MerchantId: string;
    RegionId: string;
    DateAdded: Date;


    constructor(merchantId: string, regionId: string, dateAdded: Date) {
        this.MerchantId = merchantId;
        this.RegionId = regionId;
        this.DateAdded = dateAdded;
    }

}


