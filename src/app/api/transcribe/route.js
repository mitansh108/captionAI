import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  GetTranscriptionJobCommand,
  StartTranscriptionJobCommand,
  TranscribeClient
} from "@aws-sdk/client-transcribe";

// Secure credential access using environment variables
function getTranscribeClient() {
  return new TranscribeClient({
    region: "us-east-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
  });
}

function getS3Client() {
  return new S3Client({
    region: 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
  });
}

function createTranscriptionCommand(filename) {
  return new StartTranscriptionJobCommand({
    TranscriptionJobName: filename,
    OutputBucketName: "quickcaption.ai",
    OutputKey: `${filename}.transcription`,
    IdentifyLanguage: true,
    Media: {
      MediaFileUri: `s3://quickcaption.ai/${filename}`,
    },
  });
}

async function createTranscriptionJob(filename) {
  const transcribeClient = getTranscribeClient();
  const transcriptionCommand = createTranscriptionCommand(filename);
  return transcribeClient.send(transcriptionCommand);
}

async function getJob(filename) {
  const transcribeClient = getTranscribeClient();
  try {
    const transcriptionJobStatusCommand = new GetTranscriptionJobCommand({
      TranscriptionJobName: filename,
    });
    return await transcribeClient.send(transcriptionJobStatusCommand);
  } catch (e) {
    return null;
  }
}

async function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    stream.on('error', reject);
  });
}

async function getTranscriptionFile(filename) {
  const transcriptionFile = `${filename}.transcription`;
  const s3client = getS3Client();

  try {
    const getObjectCommand = new GetObjectCommand({
      Bucket: "quickcaption.ai",
      Key: transcriptionFile,
    });

    const response = await s3client.send(getObjectCommand);
    return JSON.parse(await streamToString(response.Body));
  } catch (e) {
    return null;
  }
}

export async function GET(req) {
  const url = new URL(req.url);
  const filename = url.searchParams.get('filename');

  const transcription = await getTranscriptionFile(filename);
  if (transcription) {
    return Response.json({
      status: 'COMPLETED',
      transcription,
    });
  }

  const existingJob = await getJob(filename);
  if (existingJob) {
    return Response.json({
      status: existingJob.TranscriptionJob.TranscriptionJobStatus,
    });
  }

  const newJob = await createTranscriptionJob(filename);
  return Response.json({
    status: newJob.TranscriptionJob.TranscriptionJobStatus,
  });
}
