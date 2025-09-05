export async function handler(
  event: any
): Promise<{ sucesso: boolean; numero: number }> {
  console.log("Lambda triggado pelo Step Function");
  console.log("Evento: ", event);

  const numero = Math.floor(Math.random() * 1000);

  if (numero < 500) {
    throw new Error("Erro inesperado");
  }

  return {
    sucesso: numero % 2 === 0,
    numero,
  };
}
