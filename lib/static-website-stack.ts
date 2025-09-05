import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontorigins from "aws-cdk-lib/aws-cloudfront-origins";

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

    const distribution = new cloudfront.Distribution(this, "distribution", {
      defaultBehavior: {
        origin:
          cloudfrontorigins.S3BucketOrigin.withOriginAccessIdentity(
            websiteBucket
          ),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
        responseHeadersPolicy:
          cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.days(1),
        },
      ],
      defaultRootObject: "index.html",
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
    });

    new s3Deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3Deploy.Source.asset("./front")],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
