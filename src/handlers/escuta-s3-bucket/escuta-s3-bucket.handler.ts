import { S3Event } from "aws-lambda";

export async function handler(event: S3Event): Promise<void> {
  console.log("Lambda triggado pelo S3");
  console.log("Evento: ", event.Records[0]);
}
