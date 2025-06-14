// api/send.js
import { initializeApp, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

const app = initializeApp({ credential: cert(serviceAccount) });
const messaging = getMessaging(app);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send("Only POST requests allowed");
  }

  try {
    const message = req.body.message;

    const result = await messaging.send(message);
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

