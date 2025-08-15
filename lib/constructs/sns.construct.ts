import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sns from "aws-cdk-lib/aws-sns";

export interface SnsConstructProps {
  topicName: string;
  displayName: string;
  fifo?: boolean;
}

export class SnsConstruct extends Construct {
  constructor(scope: Stack, props: SnsConstructProps) {
    const { topicName, displayName, fifo = false } = props;

    super(scope, `${topicName}-construct`);

    new sns.Topic(this, topicName, {
      topicName,
      displayName,
      fifo,
      contentBasedDeduplication: fifo ? true : undefined,
    });
  }
}
