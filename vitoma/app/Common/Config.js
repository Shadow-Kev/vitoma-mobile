/** @format */

export default {

  // TODO - Decomment the __DEV__ variable before publishing to apple-store / google-play:
  URL: {
    entryPoint: __DEV__ ? 'https://vitoma-12bfe.cfapps.io/api' :
                          'https://www.vitoma-12bfe.com/api',

    adDetailEntryPoint: __DEV__ ? 'https://vitoma-12bfe.cfapps.io/adDetail' :
                                  'https://www.vitoma-12bfe.com/adDetail',

    captchaUrl: __DEV__ ? 'https://vitoma-12bfe.web.app/' :
                          'https://vitoma-12bfe.web.app/',

    captchaEnv: __DEV__ ? 'DEV' : 'PROD'
  },

  PagingLimit: 6,

  MaxLastViews: 10,

  // TODO - Decomment the __DEV__ variable before publishing to apple-store / google-play:
  FirebaseConfig: {
    apiKey: __DEV__ ? "AIzaSyCwM8jcnxiyvcfWGW-TxLNusSZygNr4nwI" :
                      "AIzaSyDwR4cKO9i5D6Jv-j5Rjg1wej3_l2no1jw",

    authDomain: __DEV__ ? "vitoma-12bfe.firebaseapp.com" :
                          "vitoma-12bfe-prod.firebaseapp.com",

    databaseURL: __DEV__ ? "https://vitoma-12bfe.firebaseio.com" :
                           "https://vitoma-12bfe-prod.firebaseio.com"
  },

  crashReport: {
    enable: __DEV__ === false,
    enableInExpoDevelopment: true,
    sentryCode: 'https://9b1461c389cf4d4aa5abc5b399fa366c@sentry.io/1489440',
  },
}
