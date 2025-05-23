import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {GetTranscriptionJobCommand, StartTranscriptionJobCommand, TranscribeClient} from "@aws-sdk/client-transcribe";

function getClient() {
  return new TranscribeClient({
    region: 'us-east-2',
    credentials: {
        accessKeyId: 'AKIAQS7P6F4VRLSMUQOP',
        secretAccessKey: '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',
    },
  });
}
function createTranscriptionCommand(filename) {
  return new StartTranscriptionJobCommand({
    TranscriptionJobName: filename,
    OutputBucketName: "mitansh-cap",
    OutputKey: filename + '.transcription',
    IdentifyLanguage: true,
    Media: {
      MediaFileUri: 's3://' + "mitansh-cap" + '/'+filename,
    },
  });
}
async function createTranscriptionJob(filename) {
  const transcribeClient = getClient();
  const transcriptionCommand = createTranscriptionCommand(filename);
  return transcribeClient.send(transcriptionCommand);
}

async function getJob(filename) {
  const transcribeClient = getClient();
  let jobStatusResult = null;
  try {
    const transcriptionJobStatusCommand = new GetTranscriptionJobCommand({
      TranscriptionJobName: filename,
    });
    jobStatusResult = await transcribeClient.send(
      transcriptionJobStatusCommand
    );
  } catch (e) {}
  return jobStatusResult;
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
  const transcriptionFile = filename + '.transcription';
  const s3client = new S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId: 'AKIAQS7P6F4VRLSMUQOP',
        secretAccessKey: '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'
    },
  });
  const getObjectCommand = new GetObjectCommand({
    Bucket: "mitansh-cap",
    Key: transcriptionFile,
  });
  let transcriptionFileResponse = null;
  try {
    transcriptionFileResponse = await s3client.send(getObjectCommand);
  } catch (e) {}
  if (transcriptionFileResponse) {
    return JSON.parse(
      await streamToString(transcriptionFileResponse.Body)
    );
  }
  return null;
}

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const filename = searchParams.get('filename');

  // find ready transcription
  const transcription = await getTranscriptionFile(filename);
  if (transcription) {
    return Response.json({
      status:'COMPLETED',
      transcription,
    });
  }

  // check if already transcribing
  const existingJob = await getJob(filename);

  if (existingJob) {
    return Response.json({
      status: existingJob.TranscriptionJob.TranscriptionJobStatus,
    })
  }

  // creating new transcription job
  if (!existingJob) {
    const newJob = await createTranscriptionJob(filename);
    return Response.json({
      status: newJob.TranscriptionJob.TranscriptionJobStatus,
    });
  }

  return Response.json(null);
}