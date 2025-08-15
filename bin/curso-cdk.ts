#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { NetworkStack } from "../lib/network-stack";

const app = new cdk.App();

const env = { account: "870140859659", region: "us-east-2" };

// new CursoCdkStack(app, "CursoCdkStack", {
//   env,
// });

const networkStack = new NetworkStack(app, "NetworkStack", {
  env,
});
