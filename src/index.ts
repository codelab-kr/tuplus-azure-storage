import express from 'express';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';

const app = express();

const PORT = process.env.PORT as string;
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME as string;
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY as string;
const STORAGE_CONTAINER_NAME = process.env.STORAGE_CONTAINER_NAME as string;

if (!PORT) throw Error('Azure Storage PORT not found');
if (!STORAGE_ACCOUNT_NAME)
  throw Error('Azure Storage STORAGE_ACCOUNT_NAME not found');
if (!STORAGE_ACCESS_KEY)
  throw Error('Azure Storage STORAGE_ACCESS_KEY not found');
if (!STORAGE_CONTAINER_NAME)
  throw Error('Azure Storage STORAGE_CONTAINER_NAME not found');

function createBlobService() {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    STORAGE_ACCOUNT_NAME,
    STORAGE_ACCESS_KEY,
  );
  const blobService = new BlobServiceClient(
    `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    sharedKeyCredential,
  );
  return blobService;
}

async function main(): Promise<void> {
  app.get('/video', async (req, res) => {
    const videoId = req.query.id as string;
    const containerName = STORAGE_CONTAINER_NAME;

    const blobService = createBlobService();
    const containerClient = blobService.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(videoId);
    const properties = await blobClient.getProperties();

    //
    // Writes HTTP headers to the response.
    //
    res.writeHead(200, {
      'Content-Length': properties.contentLength,
      'Content-Type': 'video/mp4',
    });

    const response = await blobClient.download();
    response.readableStreamBody?.pipe(res);
  });

  //
  // HTTP POST route to upload a video to Azure storage.
  //
  app.post('/upload', async (req, res) => {
    const videoId = req.headers.id;
    const contentType = req.headers['content-type'];

    const blobService = createBlobService();

    const containerClient = blobService.getContainerClient(
      STORAGE_CONTAINER_NAME,
    );
    await containerClient.createIfNotExists(); // Creates the container if it doesn't already exist.

    const blockBlobClient = containerClient.getBlockBlobClient(
      videoId as string,
    );
    await blockBlobClient.uploadStream(req);
    await blockBlobClient.setHTTPHeaders({
      blobContentType: contentType,
    });
    res.sendStatus(200);
  });

  app.listen(PORT, () => {
    console.log(`Microservice online on port ${PORT}....`);
  });
}

main().catch((err) => {
  console.error('Microservice failed to start.');
  console.error((err && err.stack) || err);
});
