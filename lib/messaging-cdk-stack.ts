import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { SqsSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { SnsConstruct, SqsConstruct } from "@curso-cdk/constructs-cdk";

export class MessagingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { topic } = new SnsConstruct(this, {
      topicName: "curso-cdk-topico",
      displayName: "Curso CDK Topico de Teste",
    });

    new SnsConstruct(this, {
      topicName: "curso-cdk-topico-fifo",
      displayName: "Curso CDK Topico de Teste Fifo",
      fifo: true,
    });

    const { queue } = new SqsConstruct(this, {
      queueName: "curso-cdk-queue",
      createDlq: true,
      fifo: false,
    });

    new SqsConstruct(this, {
      queueName: "curso-cdk-queue",
      createDlq: true,
      fifo: true,
    });

    topic.addSubscription(new SqsSubscription(queue));
  }
}
