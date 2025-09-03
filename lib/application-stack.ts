import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { LambdaConstruct } from "./constructs/lambda.construct";

interface ApplicationStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class ApplicationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationStackProps) {
    super(scope, id, props);

    const { vpc } = props;

    new ec2.Instance(this, "CursoCdkInstance", {
      instanceName: "instancia-curso-cdk",
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.NANO
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      vpc: vpc,
      vpcSubnets: {
        subnets: vpc.publicSubnets,
      },
    });

    new LambdaConstruct(this, {
      functionName: "primeiro-lambda",
      entry: "handlers/primeiro-lambda/primeiro-lambda.handler.ts",
    });
  }
}
