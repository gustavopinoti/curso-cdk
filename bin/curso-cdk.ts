#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { NetworkStack } from "../lib/network-stack";
import { StorageStack } from "../lib/storage-stack";
import { MessagingStack } from "../lib/messaging-cdk-stack";
import { ApplicationStack } from "../lib/application-stack";
import { ApiStack } from "../lib/api-stack";
import { StaticWebsiteStack } from "../lib/static-website-stack";
import { StepFunctionStack } from "../lib/step-function-stack";
import { CodeArtifactStack } from "../lib/code-artifact-stack";

const app = new cdk.App();

const env = { account: "870140859659", region: "us-east-2" };

// const networkStack = new NetworkStack(app, "NetworkStack", {
//   env,
// });

new StorageStack(app, "StorageStack", {
  env,
  // vpc: networkStack.vpc,
});

const messagingStack = new MessagingStack(app, "MessagingStack", {
  env,
});

const applicationStack = new ApplicationStack(app, "ApplicationStack", {
  env,
  // vpc: networkStack.vpc,
});

applicationStack.addDependency(messagingStack);

new ApiStack(app, "ApiStack", {
  env,
});

new StaticWebsiteStack(app, "StaticWebsiteStack", {
  env,
});

new StepFunctionStack(app, "StepFunctionStack", {
  env,
});

new CodeArtifactStack(app, "CodeArtifactStack", {
  env,
});
