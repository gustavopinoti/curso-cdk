import { SQSEvent } from "aws-lambda";

export async function handler(event: SQSEvent): Promise<void> {
  console.log("Lambda triggado pelo SQS");
  console.log("Evento: ", event.Records[0]);
}
