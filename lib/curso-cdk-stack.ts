import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";

export class CursoCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, "CursoCdkQueue", {
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    const queue2 = new sqs.Queue(this, "CursoCdkQueue2", {
      visibilityTimeout: cdk.Duration.seconds(300),
    });
  }
}
