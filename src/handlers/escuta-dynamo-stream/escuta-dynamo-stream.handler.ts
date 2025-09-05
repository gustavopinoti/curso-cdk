import { DynamoDBStreamEvent, S3Event } from "aws-lambda";

export async function handler(event: DynamoDBStreamEvent): Promise<void> {
  console.log("Lambda triggado pelo DynamoDb Stream");
  console.log(
    `Evento: ${event.Records[0].eventName}`,
    event.Records[0].dynamodb
  );

  throw new Error("Generic Error");
}
