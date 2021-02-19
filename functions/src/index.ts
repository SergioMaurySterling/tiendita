import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

exports.newMessageNotification = functions.firestore
    .document('chatRooms/{receptorUid}')
    .onCreate(async event => {
        const data = event.data();

        const uid = data.receptorUid
        const name = data.emisorName

        //Contenido de la notificacion
        const payload = {
            notification: {
                title: 'Nuevo mensaje en Petti',
                body: `${name} te ha enviado un mensaje`,
                icon: 'https://petti-2d60d.web.app/assets/logo-amarillo.svg'
            }
        }

        // Referencia al documento principal
        const db = admin.firestore()
        const devicesRef = db.collection('devices').where('userId', '==', uid)

        // Obtener token de usuario y enviar notificacion
        const devices = await devicesRef.get()

        const tokens: string | any[] = []

        // Loop sobre documentos
        devices.forEach(result => {
            const token = result.data().token;
            
            tokens.push(token)
        })

        // Enviar notificacion
        return admin.messaging().sendToDevice(tokens, payload)
    });
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
