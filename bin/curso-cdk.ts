#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CursoCdkStack } from "../lib/curso-cdk-stack";

const app = new cdk.App();
new CursoCdkStack(app, "CursoCdkStack", {
  env: { account: "870140859659", region: "us-east-2" },
});
