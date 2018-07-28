/**
 * NOT USED
 * This is planned to be a function that automatically deletes the pings and other collaboration objects after a few seconds. 
 */
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.removePings = functions.database.ref('/pings').onWrite(
    (change) => {
        const collectionRef = change.after.ref.parent;
        setTimeout(() => {
            change.after.ref.remove()
        }, 3000);
    }
)