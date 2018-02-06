export const environment = {
    AuthSettings: {
        authority: 'http://40.71.103.230:81/LazParkingSSO/SSO',
        client_id: 'LazAuditPortalDEVDeployed',
        redirect_uri: 'http://dev-portal-laz.wovenmeasure.com/signin-callback.html',
        post_logout_redirect_uri: 'http://dev-portal-laz.wovenmeasure.com/',
        response_type: 'id_token token',
        scope: 'openid profile api',
        silent_redirect_uri: 'http://dev-portal-laz.wovenmeasure.com/silent-renew.html',
        automaticSilentRenew: true,
        accessTokenExpiringNotificationTime: 30,
        filterProtocolClaims: true,
        loadUserInfo: true
    },

    BaseApiUrl: "http://api-laz-dev.wovenmeasure.com/api/"
}
