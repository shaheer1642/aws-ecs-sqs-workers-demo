require("dotenv").config();
const express = require("express");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const app = express();
const sqs = new SQSClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY
    }
});

const QUEUE_URL = process.env.QUEUE_URL;

app.get("/send", async (req, res) => {
    const message = req.query.message;

    if (!message) {
        return res.status(400).json({ error: "message is required" });
    }

    await sqs.send(new SendMessageCommand({
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify({ message })
    }));

    res.json({ success: true, message });
});

app.listen(3000, () => {
    console.log("API running on port 3000");
});