// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDtGtQCZWLD5FPEsJvbUp-HKp3ZqPIEXFA",
    authDomain: "sfcmap.firebaseapp.com",
    databaseURL: "https://sfcmap.firebaseio.com",
    projectId: "sfcmap",
    storageBucket: "sfcmap.appspot.com",
    messagingSenderId: "273084079541"
    // apiKey: "AIzaSyBd_fbJbbJPliH5LktUCfIevyHR82sprWY",
    // authDomain: "sfcmapdev.firebaseapp.com",
    // databaseURL: "https://sfcmapdev.firebaseio.com",
    // projectId: "sfcmapdev",
    // storageBucket: "sfcmapdev.appspot.com",
    // messagingSenderId: "885666068352"
  },
  logLevel: 'DEBUG',
  logCategories: [
    // 'Map Loading',
    // 'Notify',
    // 'Data'
  ]

};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
