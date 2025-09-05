import * as cdk from "aws-cdk-lib";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { LambdaConstruct } from "./constructs/lambda.construct";

import * as cognito from "aws-cdk-lib/aws-cognito";

interface ApiStackProps extends cdk.StackProps {}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, `curso-user-pool`, {
      userPoolName: "curso-user-pool",
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      autoVerify: { email: true, phone: false },
      passwordPolicy: {
        minLength: 6,
        requireDigits: true,
        requireLowercase: true,
        requireSymbols: true,
        requireUppercase: true,
        tempPasswordValidity: Duration.days(7),
      },
      removalPolicy: RemovalPolicy.DESTROY,
      selfSignUpEnabled: true,
      customAttributes: {
        userId: new cognito.StringAttribute({ mutable: true }),
      },
      signInAliases: {
        email: true,
        username: false,
      },
      userVerification: {
        emailSubject: "Seu código de cadastro Morada.Dev!",
        emailStyle: cognito.VerificationEmailStyle.CODE,
        emailBody: "Seu código de cadastro é {####}",
      },
      signInCaseSensitive: true,
    });

    const userPoolClient = new cognito.UserPoolClient(
      this,
      `curso-user-pool-client`,
      {
        userPool,
        authFlows: {
          adminUserPassword: false,
          custom: false,
          userPassword: true,
          userSrp: true,
        },
        generateSecret: false,
        accessTokenValidity: Duration.days(1),
        idTokenValidity: Duration.days(1),
        enableTokenRevocation: true,
        preventUserExistenceErrors: true,
        refreshTokenValidity: Duration.days(7),
        userPoolClientName: "curso-user-pool",
        oAuth: {
          logoutUrls: ["https://morada.dev"],
          callbackUrls: ["https://morada.dev"],
          flows: {
            implicitCodeGrant: true,
          },
          scopes: [cognito.OAuthScope.EMAIL, cognito.OAuthScope.OPENID],
        },
      }
    );

    userPool.addDomain("curso-user-pool-domain", {
      cognitoDomain: {
        domainPrefix: "curso-user-pool",
      },

      managedLoginVersion: cognito.ManagedLoginVersion.NEWER_MANAGED_LOGIN,
    });

    new cognito.CfnManagedLoginBranding(
      this,
      "curso-user-pool-managed-login-branding",
      {
        userPoolId: userPool.userPoolId,
        clientId: userPoolClient.userPoolClientId,
        useCognitoProvidedValues: true,
      }
    );

    const identityPool = new cognito.CfnIdentityPool(
      this,
      `curso-user-pool-identity-pool`,
      {
        allowUnauthenticatedIdentities: false,
        allowClassicFlow: false,
        cognitoIdentityProviders: [
          {
            clientId: userPoolClient.userPoolClientId,
            providerName: userPool.userPoolProviderName,
            serverSideTokenCheck: true,
          },
        ],
        identityPoolName: `curso-user-pool-identity-pool`,
      }
    );

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
      apiKeySourceType: apigateway.ApiKeySourceType.HEADER,
    });

    const apiKey = api.addApiKey("curso-api-key", {
      apiKeyName: "curso-api-key",
      description: "Chave para acessar a API do curso",
    });

    const plan = api.addUsagePlan("CursoUsagePlan", {
      name: "curso-usage-plan",
      apiStages: [
        {
          api,
          stage: api.deploymentStage,
        },
      ],
      throttle: {
        rateLimit: 2,
        burstLimit: 5,
      },
      quota: {
        limit: 20,
        period: apigateway.Period.DAY,
      },
    });
    plan.addApiKey(apiKey);

    const lambda = new LambdaConstruct(this, {
      functionName: "primeira-api",
      entry: "handlers/primeira-api/primeira-api.handler.ts",
    }).lambda;

    const helloResource = api.root.addResource("hello", {
      defaultMethodOptions: {
        apiKeyRequired: true,
      },
    });
    helloResource.addMethod("GET", new apigateway.LambdaIntegration(lambda), {
      apiKeyRequired: false,
    });
    helloResource.addMethod("POST", new apigateway.LambdaIntegration(lambda));

    helloResource
      .addResource("test-key")
      .addMethod("GET", new apigateway.LambdaIntegration(lambda));
  }
}
