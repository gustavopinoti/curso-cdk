import { SNSEvent } from "aws-lambda";

export async function handler(event: SNSEvent): Promise<void> {
  console.log("Lambda triggado pelo SNS");
  console.log("Evento: ", event.Records[0].Sns);
}
