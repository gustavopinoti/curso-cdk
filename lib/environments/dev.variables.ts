import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { CustomEnvironment } from "../custom-stack";

export const devEnvironment: CustomEnvironment = {
  account: "22223333",
  region: "us-east-2",
  logRetention: RetentionDays.ONE_DAY,
};
