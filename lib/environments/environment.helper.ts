import { environments } from ".";
import { CustomEnvironment } from "../custom-stack";
import { devEnvironment } from "./dev.variables";
import { prodEnvironment } from "./prod.variables";

export const getEnvironment = (): CustomEnvironment => {
  const account = process.env.CDK_DEFAULT_ACCOUNT;

  if (!account) {
    throw new Error("Credenciais AWS não encontradas");
  }

  const env = environments.find(
    (environment) => environment.account === account
  );

  if (!env) {
    throw new Error(
      `Conta não configurada no ambiente: ${account}. Verifique o arquivo env.helper.ts`
    );
  }

  console.log(`Conta: ${account}`);

  return env;
};
