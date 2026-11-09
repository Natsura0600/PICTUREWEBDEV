import 'server-only';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getR2Env } from './env';

let client: { s3: S3Client; bucket: string } | null = null;

function r2() {
  if (client) return client;
  const env = getR2Env();
  client = {
    bucket: env.R2_BUCKET,
    s3: new S3Client({
      region: 'auto',
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    }),
  };
  return client;
}

function isNotFound(e: unknown): boolean {
  if (typeof e !== 'object' || e === null) return false;
  const err = e as { name?: string; $metadata?: { httpStatusCode?: number } };
  return err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404;
}

export async function getJson<T = unknown>(key: string): Promise<T | null> {
  const { s3, bucket } = r2();
  try {
    const o = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const body = await o.Body?.transformToString();
    return body ? (JSON.parse(body) as T) : null;
  } catch (e) {
    if (isNotFound(e)) return null;
    throw e;
  }
}

export async function putJson(key: string, value: unknown): Promise<void> {
  const { s3, bucket } = r2();
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(value),
      ContentType: 'application/json',
    }),
  );
}

export async function deleteKey(key: string): Promise<void> {
  const { s3, bucket } = r2();
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function listKeys(prefix: string, limit = 2000): Promise<string[]> {
  const { s3, bucket } = r2();
  const out: string[] = [];
  let token: string | undefined;
  do {
    const r = await s3.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken: token }),
    );
    for (const c of r.Contents ?? []) if (c.Key) out.push(c.Key);
    token = r.IsTruncated ? r.NextContinuationToken : undefined;
  } while (token && out.length < limit);
  return out;
}
