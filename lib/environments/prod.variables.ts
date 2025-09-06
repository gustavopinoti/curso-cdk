import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { CustomEnvironment } from "../custom-stack";

export const prodEnvironment: CustomEnvironment = {
  account: "870140859659",
  region: "us-east-2",
  logRetention: RetentionDays.ONE_WEEK,
};
