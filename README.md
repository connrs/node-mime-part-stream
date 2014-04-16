#MIME Part Stream

[![Travis CI Test Status](https://travis-ci.org/connrs/node-mime-part-stream.png)](https://travis-ci.org/connrs/node-mime-part-stream)

Pipe data in to this transform stream and receive an encoded MIME part for a multipart MIME block.

    npm install mime-part-stream

To use:

    var mimePartStream = require('mime-part-stream');
    fs.createReadStream('logo.png').pipe(mimePartStream({
      type: 'image/png',
      transferEncoding: 'base64'
    }).pipe(res);

When initialising a new stream, there are 2 options available in the options object:

* type: this should be a valid MIME type eg. `'text/plain; charset=UTF-8'` or `'application/pdf'`
* transferEncoding: `base64` and `quoted-printable` are the 2 available options
* length: set the `Content-Length` header

Note that you should append '; charset=UTF-8' with any text/ MIME-types
