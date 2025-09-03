import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export async function handler(event: any): Promise<any> {
  const snsClient = new SNSClient({
    region: "us-east-2",
  });

  const command = new PublishCommand({
    Message: JSON.stringify({ message: "Hello from SNS!", type: "course-1" }),
    TopicArn: process.env.TOPIC_ARN,
    MessageAttributes: {
      versao: {
        DataType: "String",
        StringValue: "1",
      },
    },
  });

  await snsClient.send(command);
  console.log("Mensagem publicada no SNS - Curso - Versao 1");

  const command2 = new PublishCommand({
    Message: JSON.stringify({ message: "Hello from SNS!", type: "item-1" }),
    TopicArn: process.env.TOPIC_ARN,
    MessageAttributes: {
      versao: {
        DataType: "String",
        StringValue: "2",
      },
    },
  });

  await snsClient.send(command2);
  console.log("Mensagem publicada no SNS - Item - Versao 2");

  const command3 = new PublishCommand({
    Message: JSON.stringify({ message: "Hello from SNS!", type: "item-1" }),
    TopicArn: process.env.TOPIC_ARN,
    MessageAttributes: {
      versao: {
        DataType: "String",
        StringValue: "3",
      },
    },
  });

  await snsClient.send(command3);
  console.log("Mensagem publicada no SNS - Item - Versao 3");

  const sqsClient = new SQSClient({
    region: "us-east-2",
  });

  const sqsCommand = new SendMessageCommand({
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: JSON.stringify({
      message: "Hello from SQS!",
      status: "ativo",
    }),
  });

  await sqsClient.send(sqsCommand);
  console.log("Mensagem publicada no SQS Ativa");

  const sqsCommand2 = new SendMessageCommand({
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: JSON.stringify({
      message: "Hello from SQS!",
      status: "inativo",
    }),
  });

  await sqsClient.send(sqsCommand2);
  console.log("Mensagem publicada no SQS Inativa");
}
