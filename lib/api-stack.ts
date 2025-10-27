import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { LambdaConstruct } from "./constructs/lambda.construct";

interface ApiStackProps extends cdk.StackProps {}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, "curso-api", {
      description: "API para curso de CDK",
      restApiName: "curso-api",
      disableExecuteApiEndpoint: false,
      deploy: true,
      deployOptions: {
        stageName: "v1",
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });

    const lambda = new LambdaConstruct(this, {
      functionName: "primeira-api",
      entry: "handlers/primeira-api/primeira-api.handler.ts",
    }).lambda;

    const helloResource = api.root.addResource("hello");
    helloResource.addMethod("GET", new apigateway.LambdaIntegration(lambda));
    helloResource.addMethod("POST", new apigateway.LambdaIntegration(lambda));

    const variavelResource = api.root.addResource("{variavel}");
    variavelResource.addMethod("GET", new apigateway.LambdaIntegration(lambda));
  }
}
