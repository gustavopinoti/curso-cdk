import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as s3 from "aws-cdk-lib/aws-s3";

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
  }
}
