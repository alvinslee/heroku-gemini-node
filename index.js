import 'dotenv/config';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});
let chat = model.startChat();

const app = express();
app.use(express.json())

app.post('/chat', async (req, res) => {
  if ((typeof req.body.message) === 'undefined' || !req.body.message.length) {
    res.status(400).send('"message" missing in request body');
    return;
  }

  const result = await chat.sendMessage(req.body.message);
  const response = await result.response;
  res.status(200).send(response.text());
})

app.post('/reset', async (req, res) => {
  chat = model.startChat();
  res.status(200).send('OK');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
