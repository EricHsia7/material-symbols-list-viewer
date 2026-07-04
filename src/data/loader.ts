const { inflate } = require('pako');
const decoder = new TextDecoder();

export async function fetchData(url: string): Promise<object> {
  // Fetch data
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Read chunks
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

  const inflatedData = inflate(uint8Array.buffer) as ArrayBuffer;

  return JSON.parse(decoder.decode(inflatedData));
}
