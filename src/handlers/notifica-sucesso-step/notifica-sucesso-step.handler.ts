export async function handler(event: any): Promise<void> {
  console.log("Lambda triggado pelo Step Function - Notificando Sucesso");
  console.log("Evento: ", event);
}
