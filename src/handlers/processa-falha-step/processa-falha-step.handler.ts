export async function handler(event: any): Promise<void> {
  console.log("Lambda triggado pelo Step Function - Processa falha");
  console.log("Evento: ", event);
}
