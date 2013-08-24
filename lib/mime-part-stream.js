var Duplex = require('stream').Duplex;
var transferStream = {
  "quoted-printable": require('quoted-printable-stream'),
  "base64": require('base64-stream').encode
};
var NEWLINE = '\r\n';

function MimePartStream(options) {
  Duplex.call(this, options);
  this._headers = [];
  this._chunks = [];
  this._inboundStreamFinished = false;
  this._pushEnabled = false;
  this.on('finish', this._onFinish.bind(this));
}

MimePartStream.prototype = Object.create(Duplex.prototype, {
  constructor: MimePartStream
});

MimePartStream.prototype.setType = function (type) {
  this._addToHeaders('Content-Type', type);
};

MimePartStream.prototype.setTransferEncoding = function (transferEncoding) {
  this._addToHeaders('Content-Transfer-Encoding', transferEncoding);
  this._initEncodingStream(transferEncoding);
};

MimePartStream.prototype._write = function (chunk, encoding, callback) {
  this._encodingStream.write(chunk, encoding, callback);
};

MimePartStream.prototype._read = function (size) {
  if (!this._headersPushed) {
    this._pushEnabled = this._pushHeaders();
  }

  if (this._finishedStreaming()) {
    this._pushFinalData();
  }
  else if (this._chunksEmpty()) {
    this._pushEmptyChunk();
  }
  else {
    this._pushChunks();
  }
};

MimePartStream.prototype._onFinish = function () {
  this._inboundStreamFinished = true;
  this._encodingStream.end();
};

MimePartStream.prototype._addToHeaders = function (name, value) {
  this._headers.push(name + ': ' + value);
};

MimePartStream.prototype._initEncodingStream = function (transferEncoding) {
  this._encodingStream = transferStream[transferEncoding]();
  this._encodingStream.on('data', this._onEncodingStreamData.bind(this));
  this._encodingStream.on('error', this.emit.bind(this, 'error'));
};

MimePartStream.prototype._onEncodingStreamData = function (chunk) {
  if (this._pushEnabled) {
    this._pushEnabled = this.push(chunk);
  }
  else {
    this._addToChunks(chunk);
  }
};

MimePartStream.prototype._addToChunks = function (chunk) {
  this._chunks.push(chunk);
};

MimePartStream.prototype._pushHeaders = function () {
  this._headersPushed = true;
  return this.push(this._headers.join(NEWLINE) + NEWLINE + NEWLINE);
};

MimePartStream.prototype._finishedStreaming = function () {
  return this._chunksEmpty() && this._inboundStreamFinished;
};

MimePartStream.prototype._chunksEmpty = function () {
  return this._chunks.length === 0;
};

MimePartStream.prototype._pushFinalData = function () {
    this.push(NEWLINE);
    this.push(null);
};

MimePartStream.prototype._pushEmptyChunk = function () {
  this.push('');
};

MimePartStream.prototype._pushChunks = function () {
  this._pushEnabled = this.push(Buffer.concat(this._chunks));
  this._clearChunks();
};

MimePartStream.prototype._clearChunks = function () {
  this._chunks = [];
};

function mimePartStream(options) {
  var stream = new MimePartStream(options);

  options = options || {};
  stream.setType(options.type);
  stream.setTransferEncoding(options.transferEncoding);

  return stream;
}

module.exports = mimePartStream;
