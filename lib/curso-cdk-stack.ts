import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class CursoCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, "CursoCdkQueue", {
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    const queue2 = new sqs.Queue(this, "CursoCdkQueue2", {
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    new s3.Bucket(this, "CursoCdkBucket", {
      bucketName: "curso-cdk-123",
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    const table = new dynamodb.TableV2(this, "CursoCdkTable", {
      tableName: "custo-cdk-teste",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "data", type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      encryption: dynamodb.TableEncryptionV2.dynamoOwnedKey(),
      globalSecondaryIndexes: [
        {
          indexName: "curso-cdk-index",
          partitionKey: { name: "nome", type: dynamodb.AttributeType.STRING },
          projectionType: dynamodb.ProjectionType.ALL,
        },
      ],
      dynamoStream: dynamodb.StreamViewType.NEW_IMAGE,
      deletionProtection: false,
      tableClass: dynamodb.TableClass.STANDARD,
    });

    table.addGlobalSecondaryIndex({
      indexName: "curso-cdk-index-2",
      partitionKey: { name: "email", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });
  }
}
