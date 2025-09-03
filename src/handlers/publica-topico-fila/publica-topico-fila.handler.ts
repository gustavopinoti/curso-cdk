import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export async function handler(event: any): Promise<any> {
  const snsClient = new SNSClient({
    region: "us-east-2",
  });

  const command = new PublishCommand({
    Message: JSON.stringify({ message: "Hello from SNS!" }),
    TopicArn: process.env.TOPIC_ARN,
  });

  await snsClient.send(command);
  console.log("Mensagem publicada no SNS");

  const sqsClient = new SQSClient({
    region: "us-east-2",
  });

  const sqsCommand = new SendMessageCommand({
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: JSON.stringify({ message: "Hello from SQS!" }),
  });

  await sqsClient.send(sqsCommand);
  console.log("Mensagem publicada no SQS");
}
