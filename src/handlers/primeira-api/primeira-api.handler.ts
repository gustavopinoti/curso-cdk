import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export async function handler(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  console.log("Lambda triggado pelo API Gateway");
  console.log("Evento: ", event);

  return {
    body: JSON.stringify({ message: "Hello World!" }),
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    isBase64Encoded: false,
  };
}
