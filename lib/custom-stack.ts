import * as cdk from "aws-cdk-lib";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

export interface CustomEnvironment extends cdk.Environment {
  logRetention: RetentionDays;
}

export class CustomStack extends cdk.Stack {
  env: CustomEnvironment;
}
