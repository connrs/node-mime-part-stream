/*jslint stupid: true */
var test = require('tape');
var mimePartStream = require('../');
var PassThrough = require('stream').PassThrough;

test('Text plain quoted printable', function (t) {
  var output = '';
  var expected = 'Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\nHello world!\r\n';
  var body = new PassThrough();
  var mimePart = mimePartStream({type: 'text/plain; charset=UTF-8', transferEncoding: 'quoted-printable', body: body});

  mimePart.on('end', function () {
    t.equal(output, expected);
    t.end();
  });
  mimePart.on('data', function (data) {
    output += data.toString();
  });
  body.end('Hello world!');
});

test('Text html quoted printable', function (t) {
  var output = '';
  var expected = 'Content-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n<html><body><div class=3D"qp">Hello world!</div></body></html>\r\n';
  var body = new PassThrough();
  var mimePart = mimePartStream({type: 'text/html; charset=UTF-8', transferEncoding: 'quoted-printable', body: body});

  mimePart.on('end', function () {
    t.equal(output, expected);
    t.end();
  });
  mimePart.on('data', function (data) {
    output += data.toString();
  });
  body.end('<html><body><div class="qp">Hello world!</div></body></html>');
});

test('Image/png base64 encoding', function (t) {
  var output = '';
  var expected = 'Content-Type: image/png\r\nContent-Transfer-Encoding: base64\r\n\r\nWU9VUkVBTExZU0hPVUxEUFJFVEVORFRIQVRUSElTSVNBTklNQUdFIA==\r\n';
  var body = new PassThrough();
  var mimePart = mimePartStream({type: 'image/png', transferEncoding: 'base64', body: body});

  mimePart.on('end', function () {
    t.equal(output, expected);
    t.end();
  });
  mimePart.on('data', function (data) {
    output += data.toString();
  });
  body.end('YOUREALLYSHOULDPRETENDTHATTHISISANIMAGE ');
});

test('Content-Disposition header', function (t) {
  var output = '';
  var expected = 'Content-Type: image/png\r\nContent-Disposition: attachment; filename=potato.jpg\r\nContent-Transfer-Encoding: base64\r\n\r\nWU9VUkVBTExZU0hPVUxEUFJFVEVORFRIQVRUSElTSVNBTklNQUdFIA==\r\n';
  var body = new PassThrough();
  var mimePart = mimePartStream({type: 'image/png', transferEncoding: 'base64', disposition: 'attachment; filename=potato.jpg', body: body});

  mimePart.on('end', function () {
    t.equal(output, expected);
    t.end();
  });
  mimePart.on('data', function (data) {
    output += data.toString();
  });
  body.end('YOUREALLYSHOULDPRETENDTHATTHISISANIMAGE ');
});

test('Arbitrary headers', function (t) {
  var output = '';
  var expected = 'Content-Type: image/png\r\nContent-Transfer-Encoding: base64\r\nX-Custom-Header: here\r\nX-Custom-Header-2: si\r\n\r\nWU9VUkVBTExZU0hPVUxEUFJFVEVORFRIQVRUSElTSVNBTklNQUdFIA==\r\n';
  var body = new PassThrough();
  var mimePart = mimePartStream({type: 'image/png', transferEncoding: 'base64', headers: { 'X-Custom-Header': 'here', 'X-Custom-Header-2': 'si' }, body: body});

  mimePart.on('end', function () {
    t.equal(output, expected);
    t.end();
  });
  mimePart.on('data', function (data) {
    output += data.toString();
  });
  body.end('YOUREALLYSHOULDPRETENDTHATTHISISANIMAGE ');
});