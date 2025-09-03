export async function handler(event: any): Promise<any> {
  console.log("Olá do nosso primeiro lambda!");
  console.log("Evento: ", event);

  return {
    message: "Hello World",
  };
}
