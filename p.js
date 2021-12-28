require('dotenv').config();
const admin = require('firebase-admin')
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.TOKEN_FIREBASE))
});
db = admin.firestore();
db.collection('tournamentc').doc('participants').get().then(snapshot => {
    let countries = []
    for (const snapshotKey in snapshot.data()) {
        if(!countries.includes(snapshot.data()[snapshotKey].country)) countries.push(snapshot.data()[snapshotKey].country)
    }
    console.log(countries)
})
let zh = [
    'México             GTM-6',
    'Colombia           GMT-5',
    'Ecuador            GMT-5',
    'Peru               GTM-5',
    'Venezuela          GMT-4',
    'Trinidad y Tobago  GTM-4',
    'Argentina          GMT-3',
    'Uruguay            GMT-3'
]

