// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  wompi: {
    publicKey: 'pub_test_x3NUqL8JxviEGri4br07iSScOyYfcO6z'
  },
  ePayco: {
    publicKey: '9a23fca7acf8f8f2a9e548d84a7eda3d'
  }
};

export const firebaseConfig = {
  apiKey: 'AIzaSyDFyBLyiwuHD-FoXg_j4EnzalmjZilSI6M',
  authDomain: 'petti-2d60d.firebaseapp.com',
  databaseURL: 'https://petti-2d60d.firebaseio.com',
  projectId: 'petti-2d60d',
  storageBucket: 'petti-2d60d.appspot.com',
  messagingSenderId: '803233260404',
  appId: '1:803233260404:web:2cb087075a4991fe660221',
  measurementId: 'G-RPXKTEXCZK'
}
;

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
