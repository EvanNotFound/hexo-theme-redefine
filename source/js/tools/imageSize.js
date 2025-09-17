/**
 * @file imageSize.js
 * A image dimension parser.
 * Supports PNG and JPG formats.
 */

// --- Constants for PNG Parsing ---
// reference: https://www.w3.org/TR/png-3/#5DataRep
// All PNG files start with this 8-byte signature.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
// The IHDR chunk type identifier in ASCII.
const IHDR_CHUNK_TYPE = Buffer.from('IHDR');
// The IHDR chunk's data section must be 13 bytes long.
const EXPECTED_IHDR_LENGTH = 13;

/**
 * A function to get dimensions of PNG and JPG images from a Buffer.
 * @param {Buffer} buffer The image data buffer.
 * @returns {{width: number, height: number, type: 'png' | 'jpg'} | null}
 */
function imageSize(buffer) {
  try {
    //PNG
    const pngResult = parsePNG(buffer);
    if (pngResult) {
      return pngResult;
    }

    //JPG

    
    console.error('Unsupported image format')
    return null; 
  } catch (e) {
    console.error(e);
    return null;
  }
}


/**
 * Parses a Buffer to extract dimensions of a PNG image.
 * @param {Buffer} buffer The buffer containing the image data.
 * @returns {{width: number, height: number, type: 'png'} | null} Dimensions object or null if not a valid PNG with IHDR chunk.
 */
function parsePNG(buffer) {
  try {
    // A valid PNG with dimensions requires at least 33 bytes for signature and IHDR info.
    // 8 (signature) + 4 (length) + 4 (type) + 13 + 4(CRC) = 33 bytes
    if (buffer.length < 33) {
      return null;
    }

    // Verify the PNG file signature.
    if (!PNG_SIGNATURE.equals(buffer.subarray(0, 8))) {
      return null;
    }

    // --- IHDR Chunk Verification  ---
    // length must be 13. readUInt32BE reads a 4-byte, Big-Endian integer.
    const ihdrLength = buffer.readUInt32BE(8);
    if (ihdrLength !== EXPECTED_IHDR_LENGTH) {
      return null;
    }

    // type must be "IHDR".
    const chunkType = buffer.subarray(12, 16);
    if (!IHDR_CHUNK_TYPE.equals(chunkType)) {
      return null;
    }

    // --- extract the dimensions ---
    // width: 4 bytes
    const width = buffer.readUInt32BE(16);
    // height: 4 bytes
    const height = buffer.readUInt32BE(20);

    return { width, height, type: 'png' };

  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Parses a Buffer to extract dimensions of a JPG image.
 * @param {Buffer} buffer The buffer containing the image data.
 * @returns {{width: number, height: number, type: 'jpg'} | null}
 */
function parseJPG(buffer){
  //TODO: implement
}

module.exports = {
  imageSize,
  parsePNG, 
  //parseJPG,
};