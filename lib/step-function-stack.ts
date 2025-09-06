import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as stepfunctions from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import { LambdaConstruct } from "./constructs/lambda.construct";
import { CustomStack } from "./custom-stack";

interface StepFunctionStackProps extends cdk.StackProps {}

export class StepFunctionStack extends CustomStack {
  constructor(scope: Construct, id: string, props: StepFunctionStackProps) {
    super(scope, id, props);

    const primeiroProcessamentoStepLambda = new LambdaConstruct(this, {
      functionName: "primeiro-processamento-step",
      entry:
        "handlers/primeiro-processamento-step/primeiro-processamento-step.handler.ts",
    });

    const notificaSucessoStepLambda = new LambdaConstruct(this, {
      functionName: "notifica-sucesso-step",
      entry: "handlers/notifica-sucesso-step/notifica-sucesso-step.handler.ts",
    });

    const processaFalhaStepLambda = new LambdaConstruct(this, {
      functionName: "processa-falha-step",
      entry: "handlers/processa-falha-step/processa-falha-step.handler.ts",
    });

    const jobFailed = new stepfunctions.Fail(
      this,
      "Curso Step Function Falhou",
      {
        cause: "Lambda não foi capaz de processar o evento",
        error: "Processamento Falhou",
      }
    );

    const primeiraTask = new tasks.LambdaInvoke(
      this,
      "primeiro-processamento-step-task",
      {
        lambdaFunction: primeiroProcessamentoStepLambda.lambda,
        outputPath: "$",
      }
    );

    const notificaSucessoTask = new tasks.LambdaInvoke(
      this,
      "notifica-sucesso-step-task",
      {
        lambdaFunction: notificaSucessoStepLambda.lambda,
        outputPath: "$",
      }
    );

    const processaFalhaTask = new tasks.LambdaInvoke(
      this,
      "processa-falha-step-task",
      {
        lambdaFunction: processaFalhaStepLambda.lambda,
        outputPath: "$",
      }
    );

    const definition = primeiraTask.addCatch(jobFailed).next(
      new stepfunctions.Choice(this, "Processou com sucesso?")
        .when(
          stepfunctions.Condition.booleanEquals("$.Payload.sucesso", true),
          notificaSucessoTask.next(new stepfunctions.Succeed(this, "Done"))
        )
        .when(
          stepfunctions.Condition.booleanEquals("$.Payload.sucesso", false),
          processaFalhaTask.next(jobFailed)
        )
        .otherwise(jobFailed)
    );

    new stepfunctions.StateMachine(this, "curso-step-function-state-machine", {
      definitionBody: stepfunctions.DefinitionBody.fromChainable(definition),
      timeout: cdk.Duration.minutes(1),
      stateMachineName: "curso-step-function",
    });
  }
}
