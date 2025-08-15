import { Stack } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

export interface DynamodbTableConstructProps {
  tableName: string;
  sortKey?: { name: string; type: dynamodb.AttributeType };
  globalSecondaryIndexes?: dynamodb.GlobalSecondaryIndexPropsV2[];
}

export class DynamodbTableConstruct extends Construct {
  constructor(scope: Stack, props: DynamodbTableConstructProps) {
    const { tableName, sortKey, globalSecondaryIndexes } = props;

    super(scope, `${tableName}-construct`);

    new dynamodb.TableV2(scope, tableName, {
      tableName,
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      sortKey,
      billing: dynamodb.Billing.onDemand(),
      encryption: dynamodb.TableEncryptionV2.dynamoOwnedKey(),
      globalSecondaryIndexes,
      dynamoStream: dynamodb.StreamViewType.NEW_IMAGE,
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableClass: dynamodb.TableClass.STANDARD,
    });
  }
}
