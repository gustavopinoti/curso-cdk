import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";

export interface BucketConstructProps {
  bucketName: string;
}

export class BucketConstruct extends Construct {
  constructor(scope: Stack, props: BucketConstructProps) {
    const { bucketName } = props;
    super(scope, `${bucketName}-construct`);

    new s3.Bucket(scope, bucketName, {
      bucketName,
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });
  }
}
