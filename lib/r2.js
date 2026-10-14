import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

export const Bucket = process.env.R2_BUCKET;

export const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID || '', secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '' },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

export async function getJson(Key) {
  try {
    const o = await s3.send(new GetObjectCommand({ Bucket, Key }));
    return JSON.parse(await o.Body.transformToString());
  } catch (e) {
    if (e.name === 'NoSuchKey' || e.$metadata?.httpStatusCode === 404) return null;
    throw e;
  }
}
export const putJson = (Key, obj) =>
  s3.send(new PutObjectCommand({ Bucket, Key, Body: JSON.stringify(obj), ContentType: 'application/json' }));
export const del = (Key) => s3.send(new DeleteObjectCommand({ Bucket, Key }));

export async function listKeys(Prefix) {
  const out = []; let token;
  do {
    const r = await s3.send(new ListObjectsV2Command({ Bucket, Prefix, ContinuationToken: token }));
    out.push(...(r.Contents || []).map((c) => c.Key));
    token = r.IsTruncated ? r.NextContinuationToken : undefined;
  } while (token && out.length < 2000);
  return out;
}
