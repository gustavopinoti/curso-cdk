import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as stepfunctions from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import { LambdaConstruct } from "./constructs/lambda.construct";

interface StepFunctionStackProps extends cdk.StackProps {}

export class StepFunctionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StepFunctionStackProps) {
    super(scope, id, props);

    const primeiroProcessamentoStepLambda = new LambdaConstruct(this, {
      functionName: "primeiro-processamento-step",
      entry:
        "handlers/primeiro-processamento-step/primeiro-processamento-step.handler.ts",
    });

    const primeiraTask = new tasks.LambdaInvoke(
      this,
      "primeiro-processamento-step-task",
      {
        lambdaFunction: primeiroProcessamentoStepLambda.lambda,
        outputPath: "$",
      }
    );

    const definition = primeiraTask.next(
      new stepfunctions.Succeed(this, "Done")
    );

    new stepfunctions.StateMachine(this, "curso-step-function-state-machine", {
      definition,
      timeout: cdk.Duration.minutes(1),
      stateMachineName: "curso-step-function",
    });
  }
}
