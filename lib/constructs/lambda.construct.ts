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
import * as s3 from "aws-cdk-lib/aws-s3";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export interface LambdaConstructProps {
  functionName: string;
  entry: string;
  buckets?: s3.IBucket[];
  tables?: dynamodb.ITable[];
}

export class LambdaConstruct extends Construct {
  readonly lambda: NodejsFunction;
  constructor(scope: Stack, private readonly props: LambdaConstructProps) {
    super(scope, `${props.functionName}LambdaConstruct`);

    const { functionName, entry, buckets = [], tables = [] } = this.props;

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

    for (const bucket of buckets) {
      bucket.grantReadWrite(this.lambda);
    }

    for (const table of tables) {
      table.grantReadWriteData(this.lambda);
    }
  }
}
