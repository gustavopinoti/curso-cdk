import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { LambdaConstruct } from "./constructs/lambda.construct";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as sns from "aws-cdk-lib/aws-sns";
import {
  SnsEventSource,
  SqsEventSource,
} from "aws-cdk-lib/aws-lambda-event-sources";
import * as lambda from "aws-cdk-lib/aws-lambda";

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

    const cursoTopic = sns.Topic.fromTopicArn(
      this,
      "curso-cdk-topico",
      cdk.Fn.importValue(`MessagingStack::topic::curso-cdk-topico`)
    );

    const cursoQueue = sqs.Queue.fromQueueArn(
      this,
      "curso-cdk-queue",
      cdk.Fn.importValue(`MessagingStack::queue::curso-cdk-queue`)
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

    new LambdaConstruct(this, {
      functionName: "publica-topico-fila",
      entry: "handlers/publica-topico-fila/publica-topico-fila.handler.ts",
      topics: [cursoTopic],
      queues: [cursoQueue],
      environmentVariables: {
        TOPIC_ARN: cursoTopic.topicArn,
        QUEUE_URL: cursoQueue.queueUrl,
      },
    });

    const escutaTopicoLambda = new LambdaConstruct(this, {
      functionName: "escuta-topico",
      entry: "handlers/escuta-topico/escuta-topico.handler.ts",
    });

    escutaTopicoLambda.lambda.addEventSource(
      new SnsEventSource(cursoTopic, {
        filterPolicyWithMessageBody: {
          type: sns.FilterOrPolicy.filter(
            sns.SubscriptionFilter.stringFilter({
              matchPrefixes: ["item-"],
            })
          ),
        },
        // filterPolicy: {
        //   versao: sns.SubscriptionFilter.stringFilter({
        //     allowlist: ["1", "2"],
        //   }),
        // },
      })
    );

    const escutaFilaLambda = new LambdaConstruct(this, {
      functionName: "escuta-fila",
      entry: "handlers/escuta-fila/escuta-fila.handler.ts",
    });

    escutaFilaLambda.lambda.addEventSource(
      new SqsEventSource(cursoQueue, {
        batchSize: 10,
        maxBatchingWindow: cdk.Duration.minutes(2),
        maxConcurrency: 2,
        filters: [
          lambda.FilterCriteria.filter({
            body: {
              status: lambda.FilterRule.isEqual("ativo"),
            },
          }),
        ],
      })
    );
  }
}
