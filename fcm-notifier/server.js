import express from 'express';
import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

const app = express();
app.use(express.json());

initializeApp({ credential: cert(serviceAccount) });

const messaging = getMessaging();

// Topic-based notification (with senderToken)
app.post('/send', async (req, res) => {
  try {
    const { message, senderToken } = req.body;

    // Inject senderToken into data
    message.data = {
      ...message.data,
      senderToken: senderToken,
    };

    const result = await messaging.send(message);
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Device-token-based notification
app.post('/sendToDevice', async (req, res) => {
  try {
    const { token, data } = req.body;

    if (!token || !data) {
      return res.status(400).json({ success: false, error: "Missing 'token' or 'data'" });
    }

    const result = await messaging.send({
      token,
      data,
    });

    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send("🔥 Express server is running!");
});

export default app;
