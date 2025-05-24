import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response("No file found", { status: 400 });
    }

    const { name, type } = file;
    const data = await file.arrayBuffer();

    const s3client = new S3Client({
      region: "us-east-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const ext = name.split(".").pop();
    const newName = `${uuidv4()}.${ext}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: 'quickcaption.ai',
      Body: data,
      ACL: "public-read",
      ContentType: type,
      Key: newName,
    });

    await s3client.send(uploadCommand);

    return Response.json({ name, ext, newName });
  } catch (err) {
    console.error("Upload failed:", err);
    return new Response("S3 Upload Failed: " + err.message, { status: 500 });
  }
}
