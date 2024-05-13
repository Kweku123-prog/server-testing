// const admin = require('firebase-admin');
const fs = require('fs');

import * as admin from "firebase-admin";
import { serviceAccountKey } from "./fireBaseServiceAccount.config";

// const filePath = process.env.FIREBASE_ADMIN_SDK_KEY_MrD;
// console.log({filePath})
// if (!filePath) {
//   console.error("FIREBASE_ADMIN_SDK_KEY_MrD environment variable is not set.");
//   process.exit(1);
// }

// // Read the content of the file
// const serviceAccountJson = fs.readFileSync(filePath, 'utf8');


// const serviceAccount = JSON.parse(serviceAccountKey)
const serviceKey = JSON.stringify(serviceAccountKey);

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceKey)),
});
