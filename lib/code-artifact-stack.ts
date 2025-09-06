import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as codeartifact from "aws-cdk-lib/aws-codeartifact";
import { CustomStack } from "./custom-stack";

export class CodeArtifactStack extends CustomStack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const domain = new codeartifact.CfnDomain(this, "curso-cdk-domain", {
      domainName: "curso-cdk",
    });

    const constructsRepository = new codeartifact.CfnRepository(
      this,
      "constructs-cdk-repo",
      {
        repositoryName: "constructs-cdk",
        domainName: domain.domainName,
      }
    );

    constructsRepository.addDependency(domain);
  }
}
