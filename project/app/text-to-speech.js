const fs = require('fs');
const textToSpeech = require('@google-cloud/text-to-speech');
const { promisify } = require('util');

// Replace with your Google Cloud project ID
const projectId = '382208';

// Replace with your Google Cloud service account key file path
const keyFilename = 'cloud-computing-382208-77dd0a6ce1c4.json';

// Creates a client
const client = new textToSpeech.TextToSpeechClient({
  projectId,
  keyFilename,
});

// Promisify the writeFile function
const writeFile = promisify(fs.writeFile);

// Function to synthesize speech
async function synthesizeSpeech(text) {
  // Construct the request
  const request = {
    input: { text },
    voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    // Call the API
    const [response] = await client.synthesizeSpeech(request);

    return response.audioContent;
  } catch (error) {
    console.error('Error:', error);
    throw new Error(`Error synthesizing speech: ${error.message}`);
  }
}

module.exports = synthesizeSpeech;
