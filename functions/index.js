const functions = require('firebase-functions');
const express = require('express');

const app = express();
app.get('/peli', (request, response) => {
    response.send("Entraste al lado peligroso de la página >:)");
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.app = functions.https.onRequest(app);
