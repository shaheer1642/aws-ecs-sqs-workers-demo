require("dotenv").config();
const {
    SQSClient,
    ReceiveMessageCommand,
    DeleteMessageCommand
} = require("@aws-sdk/client-sqs");

const sqs = new SQSClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY
    }
});

const QUEUE_URL = process.env.QUEUE_URL;

async function main() {
    const result = await sqs.send(new ReceiveMessageCommand({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20
    }));

    const message = result.Messages?.[0];

    if (!message) {
        return;
    }

    const data = JSON.parse(message.Body);

    console.log("Processing:", data.message);

    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Finished:", data.message);

    await sqs.send(new DeleteMessageCommand({
        QueueUrl: QUEUE_URL,
        ReceiptHandle: message.ReceiptHandle
    }));
}

main().catch(console.error);