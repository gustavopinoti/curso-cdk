import {
  Duration,
  Stack,
  aws_iam as iam,
  aws_kms as kms,
  aws_lambda as lambda,
  aws_logs as logs,
  aws_sns as sns,
} from "aws-cdk-lib";
import {
  Charset,
  LogLevel,
  NodejsFunction,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

export interface LambdaConstructProps {
  functionName: string;
  entry: string;
}

export class LambdaConstruct extends Construct {
  readonly lambda: NodejsFunction;
  constructor(scope: Stack, private readonly props: LambdaConstructProps) {
    super(scope, `${props.functionName}LambdaConstruct`);

    const { functionName, entry } = this.props;

    this.lambda = new NodejsFunction(this, `${functionName}-lambda-function`, {
      functionName,
      description: `${functionName} lambda function`,
      runtime: lambda.Runtime.NODEJS_22_X,
      bundling: {
        externalModules: ["@aws-sdk/*"],
        logLevel: LogLevel.SILENT,
        minify: true,
        keepNames: true,
        charset: Charset.UTF8,
        target: "es2023",
      },
      logGroup: new logs.LogGroup(this, `${functionName}-log-group`, {
        retention: logs.RetentionDays.ONE_WEEK,
        logGroupName: `/aws/lambda/${functionName}`,
      }),
      timeout: Duration.seconds(30),
      entry: path.join(__dirname, `../../src/${entry}`),
      memorySize: 1024,
      architecture: lambda.Architecture.ARM_64,
    });
  }
}
