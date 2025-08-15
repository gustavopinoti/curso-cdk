import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";
import { BucketConstruct } from "./constructs/bucket.construct";
import { DynamodbTableConstruct } from "./constructs/dynamodb-table.construct";

interface StorageStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class StorageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StorageStackProps) {
    super(scope, id, props);

    const { vpc } = props;

    new BucketConstruct(this, "CursoCdkBucketConstruct", {
      bucketName: "curso-cdk-123",
    });

    new DynamodbTableConstruct(this, "CursoCdkTable", {
      tableName: "curso-cdk-teste",
      sortKey: { name: "data", type: dynamodb.AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: "curso-cdk-index",
          partitionKey: { name: "nome", type: dynamodb.AttributeType.STRING },
          projectionType: dynamodb.ProjectionType.ALL,
        },
        {
          indexName: "curso-cdk-index-2",
          partitionKey: { name: "email", type: dynamodb.AttributeType.STRING },
          projectionType: dynamodb.ProjectionType.ALL,
        },
      ],
    });

    new rds.DatabaseInstance(this, "CursoCdkRds", {
      instanceIdentifier: "curso-cdk-rds",
      databaseName: "curso_cdk",
      port: 3306,
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_4_5,
      }),
      allocatedStorage: 20,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      vpc: vpc,
      vpcSubnets: {
        subnets: vpc.privateSubnets,
      },
      multiAz: false,
      storageType: rds.StorageType.GP2,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
