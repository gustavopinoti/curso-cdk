import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";

interface StaticWebsiteStackProps extends cdk.StackProps {}

export class StaticWebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StaticWebsiteStackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, "static-website-bucket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    new s3Deploy.BucketDeployment(this, "static-website-bucket-deploy", {
      sources: [s3Deploy.Source.asset("./front")],
      destinationBucket: websiteBucket,
    });
  }
}
