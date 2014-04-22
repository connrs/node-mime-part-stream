var sandwichStream = require('sandwich-stream');
var mimeHeaders = require('mime-headers');
var transferStream = {
  "": require('stream').PassThrough,
  "quoted-printable": require('quoted-printable-stream'),
  "base64": require('mime-base64-stream')
};
var NEWLINE = '\r\n';

function headers(options) {
  var h = mimeHeaders();

  if (options.type) {
    h.push('Content-Type', options.type);
  }

  if (options.disposition) {
    h.push('Content-Disposition', options.disposition);
  }

  if (options.transferEncoding) {
    h.push('Content-Transfer-Encoding', options.transferEncoding);
  }

  if (options.headers) {
    for (var key in options.headers) {
      h.push(key, options.headers[key])
    }
  }

  return h.toString();
}

function mimePartStream(options) {
  var stream = sandwichStream({ head: headers(options), tail: NEWLINE });
  var encodeStream = new transferStream[options.transferEncoding || ""]();
  var body = options.body;

  stream.add(body.pipe(encodeStream));
  
  return stream;
}

module.exports = mimePartStream;
