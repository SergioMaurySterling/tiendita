import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

exports.newMessageNotification = functions.firestore
    .document('chatRooms/{receptorUid}')
    .onUpdate(async event => {
        const data = event.before.data();

        const uid = data.receptorUid
        const emisorUid = data.emisorUid

        // Busqueda del usuario Emisor del chat
        const db2 = admin.firestore()
        const emisor = db2.collection('users').where('uid', '==', emisorUid)
        // Obtener nombre de usuario
        const emisorAlmacenamiento = await emisor.get()
        const emisorName: string | any[] = []
        // Loop sobre documentos
        emisorAlmacenamiento.forEach(result => {
            const almacenar = result.data().name;
            emisorName.push(almacenar)
        })

        const name = emisorName

        //Contenido de la notificacion
        const payload = {
            notification: {
                title: 'Nuevo mensaje en el chat',
                body: `${name} te ha enviado un mensaje`,
                icon: 'https://petti-2d60d.web.app/assets/logo-amarillo.svg',
                click_action: 'FCM_PLUGIN_ACTIVITY'
            },
            data: {
                landing_page: 'chats',
                eUid: emisorUid
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