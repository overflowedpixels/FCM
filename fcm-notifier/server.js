import express from 'express';
import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

const app = express();
app.use(express.json());

initializeApp({ credential: cert(serviceAccount) });

app.post('/send', async (req, res) => {
  try {
    const messaging = getMessaging();
    const result = await messaging.send(req.body.message);
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send("🔥 Express server is running!");
});

export default app;
