import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { LambdaConstruct } from "./constructs/lambda.construct";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

interface ApplicationStackProps extends cdk.StackProps {
  // vpc: ec2.Vpc;
}

export class ApplicationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationStackProps) {
    super(scope, id, props);

    // const { vpc } = props;

    const cursoCdk123Bucket = s3.Bucket.fromBucketName(
      this,
      "curso-cdk-123-bucket",
      "curso-cdk-123"
    );

    const cursoCdkTestTable = dynamodb.Table.fromTableName(
      this,
      "curso-cdk-teste-table",
      "curso-cdk-teste"
    );

    // new ec2.Instance(this, "CursoCdkInstance", {
    //   instanceName: "instancia-curso-cdk",
    //   instanceType: ec2.InstanceType.of(
    //     ec2.InstanceClass.T3,
    //     ec2.InstanceSize.NANO
    //   ),
    //   machineImage: ec2.MachineImage.latestAmazonLinux2023(),
    //   vpc: vpc,
    //   vpcSubnets: {
    //     subnets: vpc.publicSubnets,
    //   },
    // });

    new LambdaConstruct(this, {
      functionName: "primeiro-lambda",
      entry: "handlers/primeiro-lambda/primeiro-lambda.handler.ts",
    });

    new LambdaConstruct(this, {
      functionName: "get-arquivo-s3",
      entry: "handlers/get-arquivo-s3/get-arquivo-s3.handler.ts",
      buckets: [cursoCdk123Bucket],
    });

    new LambdaConstruct(this, {
      functionName: "get-itens-dynamo",
      entry: "handlers/get-itens-dynamo/get-itens-dynamo.handler.ts",
      tables: [cursoCdkTestTable],
    });
  }
}
