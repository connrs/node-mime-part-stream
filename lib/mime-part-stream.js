var StreamStream = require('stream-stream');
var PassThrough = require('stream').PassThrough;
var mimeHeaders = require('mime-headers');
var transferStream = {
  "quoted-printable": require('quoted-printable-stream'),
  "base64": require('base64-stream').encode
};
var NEWLINE = '\r\n';

function headerStream(options) {
  var headers = mimeHeaders();
  var stream = new PassThrough();

  if (options.type) {
    headers.push('Content-Type', options.type);
  }

  if (options.disposition) {
    headers.push('Content-Disposition', options.disposition);
  }

  if (options.transferEncoding) {
    headers.push('Content-Transfer-Encoding', options.transferEncoding);
  }
  
  stream.end(headers.toString());

  return stream;
}

function footerStream() {
  var stream = new PassThrough();

  stream.end(NEWLINE);

  return stream;
}

function encodeStream(transferEncoding) {
  var stream = new transferStream[transferEncoding]();

  return stream;
}

function concatStream(header, encode, footer) {
  var stream = new StreamStream();

  stream.write(header);
  stream.write(encode);
  stream.write(footer);
  stream.end();

  return stream;
}

function mimePartStream(options) {
  // The encode stream is used to transform the MIME data
  var encode = encodeStream(options.transferEncoding);
  // The header stream creates a MIME header
  var header = headerStream(options);
  // The footer stream ensures that the MIME content ends in
  // a newline
  var footer = footerStream();
  var read = concatStream(header, encode, footer);

  return {
    writeStream: encode,
    readStream: read
  };
}

module.exports = mimePartStream;
