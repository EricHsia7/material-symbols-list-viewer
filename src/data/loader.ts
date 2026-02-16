import { pakoInflate } from '../../tools/pako-inflate/index';

export async function fetchData(url: string): Promise<object> {
  // Fetch data
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Read chunks
  // const contentLength = parseInt(String(response.headers.get('content-length')));
  const reader = response.body.getReader();
  const chunks = [];
  let receivedLength = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    receivedLength += value.length;
  }

  // Concatenate all the chunks into a single Uint8Array
  const uint8Array = new Uint8Array(receivedLength);
  let position = 0;
  for (const chunk of chunks) {
    uint8Array.set(chunk, position);
    position += chunk.length;
  }

  // Create a blob from the concatenated Uint8Array
  const blob = new Blob([uint8Array], { type: 'application/gzip' });
  const arrayBuffer = await blob.arrayBuffer();
  const inflatedData = await pakoInflate(arrayBuffer);

  return JSON.parse(inflatedData);
}
