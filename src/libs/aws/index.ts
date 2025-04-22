import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export const getAwsClient = () => {
  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
};

export async function uploadToS3(
  fileName: string,
  fileContent: string | Buffer
) {
  const parallelUploads3 = new Upload({
    client: getAwsClient(),
    params: {
      Bucket: process.env.AWS_DOCUMENTS_BUCKET,
      Key: fileName,
      Body: fileContent,
    },
  });

  return await parallelUploads3.done();
}

export async function deleteFromS3(fileName: string) {
  await getAwsClient().send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_DOCUMENTS_BUCKET,
      Key: fileName,
    })
  );
}

export async function getFileFromS3(fileName: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_DOCUMENTS_BUCKET,
    Key: fileName,
  });

  const response = await getAwsClient().send(command);

  if (!response.Body) {
    throw new Error(`No content found for file: ${fileName}`);
  }

  // Convert the readable stream to a buffer
  const chunks: Uint8Array[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for await (const chunk of response.Body as any) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}
