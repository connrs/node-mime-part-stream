/*jslint stupid: true */
var test = require('tape');
var mimePartStream = require('../');

test('Text plain quoted printable', function (t) {
  var output = '';
  var expected = 'Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\nHello world!\r\n';
  var stream = mimePartStream({type: 'text/plain; charset=UTF-8', transferEncoding: 'quoted-printable'});

  stream.on('end', function () {
    t.equal(output, expected);
    t.end();
  });
  stream.on('data', function (data) {
    output += data.toString();
  });
  stream.end('Hello world!');
});

test('Text html quoted printable', function (t) {
  var output = '';
  var expected = 'Content-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n<html><body><div class=3D"qp">Hello world!</div></body></html>\r\n';
  var stream = mimePartStream({type: 'text/html; charset=UTF-8', transferEncoding: 'quoted-printable'});

  stream.on('end', function () {
    t.equal(output, expected);
    t.end();
  });
  stream.on('data', function (data) {
    output += data.toString();
  });
  stream.end('<html><body><div class="qp">Hello world!</div></body></html>');
});

test('Image/png base64 encoding', function (t) {
  var output = '';
  var expected = 'Content-Type: image/png\r\nContent-Transfer-Encoding: base64\r\n\r\nWU9VUkVBTExZU0hPVUxEUFJFVEVORFRIQVRUSElTSVNBTklNQUdFIA==\r\n';
  var stream = mimePartStream({type: 'image/png', transferEncoding: 'base64'});

  stream.on('end', function () {
    t.equal(output, expected);
    t.end();
  });
  stream.on('data', function (data) {
    output += data.toString();
  });
  stream.end('YOUREALLYSHOULDPRETENDTHATTHISISANIMAGE ');
});
