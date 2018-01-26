export const environment = {
    AuthSettings: {
        authority: 'http://40.71.103.230:81/LazParkingSSO/SSO',
        client_id: 'LazAuditPortalDEV',
        redirect_uri: 'http://localhost:8080/signin-callback.html',
        post_logout_redirect_uri: 'http://localhost:8080',
        response_type: 'id_token token',
        scope: 'openid profile api',
        silent_redirect_uri: 'http://localhost:8080/silent-renew.html',
        automaticSilentRenew: true,
        accessTokenExpiringNotificationTime: 30,
        filterProtocolClaims: true,
        loadUserInfo: true
    },

    BaseApiUrl: "http://laz.webapi/api/"
}
