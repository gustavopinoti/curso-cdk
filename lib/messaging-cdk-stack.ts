import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { SnsConstruct } from "./constructs/sns.construct";
import { SqsConstruct } from "./constructs/sqs.construct";

export class MessagingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new SnsConstruct(this, {
      topicName: "curso-cdk-topico",
      displayName: "Curso CDK Topico de Teste",
    });

    new SnsConstruct(this, {
      topicName: "curso-cdk-topico-fifo",
      displayName: "Curso CDK Topico de Teste Fifo",
      fifo: true,
    });

    new SqsConstruct(this, {
      queueName: "curso-cdk-queue",
      createDlq: true,
      fifo: false,
    });

    new SqsConstruct(this, {
      queueName: "curso-cdk-queue",
      createDlq: true,
      fifo: true,
    });
  }
}
