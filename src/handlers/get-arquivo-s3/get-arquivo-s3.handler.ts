import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function handler(event: any): Promise<any> {
  const s3Client = new S3Client({ region: "us-east-2" });

  const command = new GetObjectCommand({
    Bucket: "curso-cdk-123",
    Key: "essentials-logo.webp",
  });

  const url = await getSignedUrl(s3Client, command);

  return {
    url,
  };
}
