import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

export async function handler(event: any): Promise<any> {
  const client = new DynamoDBClient({ region: "us-east-2" });
  const dynamoDb = DynamoDBDocument.from(client);

  const uuid = randomUUID();

  await dynamoDb.put({
    TableName: "curso-cdk-teste",
    Item: {
      id: uuid,
      data: new Date().toISOString().split("T")[0],
      name: `Teste gerado automaticamente - ${uuid}`,
    },
  });

  const scan = await dynamoDb.scan({
    TableName: "curso-cdk-teste",
  });

  return {
    itens: scan.Items,
  };
}
