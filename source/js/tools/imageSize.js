/**
 * @file imageSize.js
 * A image dimension parser.
 * Supports PNG and JPEG formats.
 */


/**
 * A function to get dimensions of PNG and JPEG images from a Buffer.
 * @param {Buffer} buffer The image data buffer.
 * @returns {{width: number, height: number, type: 'png' | 'jpeg'} | null}
 */
function imageSize(buffer) {
  try {
    //PNG
    const pngResult = parsePNG(buffer);
    if (pngResult) {
      return pngResult;
    }

    //JPEG
    const jpegResult = parseJPEG(buffer);
    if(jpegResult){
      return jpegResult;
    }

    console.error('Unsupported image format')
    return null; 
  } catch (e) {
    console.error(e);
    return null;
  }
}


// --- Constants for PNG Parsing ---
// reference: https://www.w3.org/TR/png-3/#5DataRep
// All PNG files start with this 8-byte signature.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
// The IHDR chunk type identifier in ASCII.
const IHDR_CHUNK_TYPE = Buffer.from('IHDR');
// The IHDR chunk's data section must be 13 bytes long.
const EXPECTED_IHDR_LENGTH = 13;
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


// --- Constants for JPEG Parsing ---
// reference: ITU T.81, Annex B  https://www.w3.org/Graphics/JPEG/itu-t81.pdf
// Start of Image marker
const JPG_SOI = 0xFFD8;
// End of Image marker
const JPG_EOI = 0xFFD9;

// Start of Frame markers 
//non-differential, Huffman coding
const JPG_SOF0  = 0xFFC0; // Baseline DCT
const JPG_SOF1  = 0xFFC1; // Extended sequential DCT
const JPG_SOF2  = 0xFFC2; // Progressive DCT
const JPG_SOF3  = 0xFFC3; // Lossless (sequential)
//differential, Huffman coding
const JPG_SOF5  = 0xFFC5; // sequential DCT
const JPG_SOF6  = 0xFFC6; // progressive DCT
const JPG_SOF7  = 0xFFC7; // lossless (sequential)
//non-differential, arithmetic coding
const JPG_SOF9  = 0xFFC9; // Extended sequential DCT
const JPG_SOF10 = 0xFFCA; // Progressive DCT
const JPG_SOF11 = 0xFFCB; // Lossless (sequential)
//differential, arithmetic coding
const JPG_SOF13 = 0xFFCD; // sequential DCT
const JPG_SOF14 = 0xFFCE; // progressive DCT
const JPG_SOF15 = 0xFFCF; // lossless (sequential)

const SOF_MARKERS = [
  JPG_SOF0, JPG_SOF1, JPG_SOF2, JPG_SOF3,
  JPG_SOF5, JPG_SOF6, JPG_SOF7,
  JPG_SOF9, JPG_SOF10, JPG_SOF11,
  JPG_SOF13, JPG_SOF14, JPG_SOF15
]

/**
 * Parses a Buffer to extract dimensions of a JPEG image.
 * @param {Buffer} buffer The buffer containing the image data.
 * @returns {{width: number, height: number, type: 'jpeg'} | null}
 */
function parseJPEG(buffer){
  try{
    //Start with SOI
    if(buffer.readUInt16BE(0) !== JPG_SOI){
      return null;
    }

    let offset = 2;
    while(offset < buffer.length){
      //find next marker
      while(buffer[offset] !== 0xFF){
        offset++;
        if(offset >= buffer.length) return null;
      }
      //jump over fill bytes
      while(buffer[offset] === 0xFF){
        offset++;
        if(offset >= buffer.length) return null;//for broken image
      }

      //now offset points to the second byte of marker
      const markerByte = buffer[offset];
      offset++;
      if(markerByte === 0x00){
        //not a marker, but a data
        continue;
      }
      const marker = 0xFF00 | markerByte;

      if(SOF_MARKERS.includes(marker)){
        //find Frame header
        //For frameheader: 2 for marker, 2 for length, 1 for precision, 2 for height, 2 for width
        return { height: buffer.readUInt16BE(offset+3), width: buffer.readUInt16BE(offset+5), type: 'jpeg' };
      }

      //if not the SOF marker, skip to the next marker; 
      if(marker === JPG_EOI || (marker >= 0xFFD0 && marker <= 0xFFD7)){
        // note: RST_m(and SOI,EOI) doesn't have its length field, even though it won't occur before frame header; for safety, do not try to read length field
        continue;
      }
      const length = buffer.readUInt16BE(offset);
      offset += length;
    }

    return null;
  }catch(e){
    console.error(e);
    return null;
  }
}

module.exports = {
  imageSize,
  parsePNG, 
  parseJPEG,
};