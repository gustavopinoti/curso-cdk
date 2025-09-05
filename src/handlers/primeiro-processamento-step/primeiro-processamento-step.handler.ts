export async function handler(event: any): Promise<{ sucesso: boolean }> {
  console.log("Lambda triggado pelo Step Function");
  console.log("Evento: ", event);

  const numero = Math.floor(Math.random() * 1000);

  return {
    sucesso: numero % 2 === 0,
  };
}
