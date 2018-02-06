export class Settings {
    public get AuthSettings(): any {
        return {
            authority: 'http://40.71.103.230:81/LazParkingSSO/SSO',
            client_id: 'LazAuditPortalProd',
            redirect_uri: 'http://portal-laz.wovenmeasure.com//signin-callback.html',
            post_logout_redirect_uri: 'http://portal-laz.wovenmeasure.com/',
            response_type: 'id_token token',
            scope: 'openid profile api',
            silent_redirect_uri: 'http://portal-laz.wovenmeasure.com/silent-renew.html',
            automaticSilentRenew: true,
            accessTokenExpiringNotificationTime: 30,
            filterProtocolClaims: true,
            loadUserInfo: true
        };
    }

    public get BaseApiUrl(): string { return "http://api-laz.wovenmeasure.com/api/"; }

}

export let Config = new Settings();