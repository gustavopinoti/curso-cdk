import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as sns from "aws-cdk-lib/aws-sns";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class CursoCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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

    new sns.Topic(this, "CursoCdkTopico", {
      topicName: "curso-cdk-topico",
      displayName: "Curso CDK Topico de Teste",
      fifo: false,
    });

    new sns.Topic(this, "CursoCdkTopicoFifo", {
      topicName: "curso-cdk-topico-fifo",
      displayName: "Curso CDK Topico de Teste Fifo",
      fifo: true,
      contentBasedDeduplication: true,
    });

    const queueDlq = new sqs.Queue(this, "CursoCdkQueueDlq", {
      visibilityTimeout: cdk.Duration.seconds(300),
      fifo: false,
      queueName: "curso-cdk-queue-dlq",
      encryption: sqs.QueueEncryption.SQS_MANAGED,
    });

    new sqs.Queue(this, "CursoCdkQueue", {
      visibilityTimeout: cdk.Duration.seconds(300),
      fifo: false,
      queueName: "curso-cdk-queue",
      encryption: sqs.QueueEncryption.SQS_MANAGED,
      deadLetterQueue: {
        maxReceiveCount: 2,
        queue: queueDlq,
      },
    });

    new sqs.Queue(this, "CursoCdkQueueFifo", {
      visibilityTimeout: cdk.Duration.seconds(300),
      fifo: true,
      queueName: "curso-cdk-queue.fifo",
      encryption: sqs.QueueEncryption.SQS_MANAGED,
      contentBasedDeduplication: true,
      maxMessageSizeBytes: 20000,
      retentionPeriod: cdk.Duration.days(1),
      receiveMessageWaitTime: cdk.Duration.seconds(20),
    });

    new ec2.Vpc(this, "CursoCdkVpc", {
      vpcName: "curso-cdk-vpc",
      maxAzs: 3,
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
      subnetConfiguration: [
        {
          name: "public-subnet",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: "private-subnet",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          name: "isolated-subnet",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
      natGateways: 1,
      createInternetGateway: true,
      gatewayEndpoints: {
        S3Endpoint: {
          service: ec2.GatewayVpcEndpointAwsService.S3,
          subnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }],
        },
        DynamoDbEndpoint: {
          service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
          subnets: [{ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }],
        },
      },
    });
  }
}
