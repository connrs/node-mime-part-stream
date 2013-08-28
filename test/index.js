/*jslint stupid: true */
var test = require('tape');
var mimePartStream = require('../');

test('Text plain quoted printable', function (t) {
  var output = '';
  var expected = 'Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\nHello world!\r\n';
  var mimePart = mimePartStream({type: 'text/plain; charset=UTF-8', transferEncoding: 'quoted-printable'});

  mimePart.readStream.on('end', function () {
    t.equal(output, expected);
    t.end();
  });
  mimePart.readStream.on('data', function (data) {
    console.log(data.toString());
    output += data.toString();
  });
  mimePart.writeStream.end('Hello world!');
});

test('Text html quoted printable', function (t) {
  var output = '';
  var expected = 'Content-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n<html><body><div class=3D"qp">Hello world!</div></body></html>\r\n';
  var mimePart = mimePartStream({type: 'text/html; charset=UTF-8', transferEncoding: 'quoted-printable'});

  mimePart.readStream.on('end', function () {
    t.equal(output, expected);
    t.end();
  });
  mimePart.readStream.on('data', function (data) {
    output += data.toString();
  });
  mimePart.writeStream.end('<html><body><div class="qp">Hello world!</div></body></html>');
});

test('Image/png base64 encoding', function (t) {
  var output = '';
  var expected = 'Content-Type: image/png\r\nContent-Transfer-Encoding: base64\r\n\r\nWU9VUkVBTExZU0hPVUxEUFJFVEVORFRIQVRUSElTSVNBTklNQUdFIA==\r\n';
  var mimePart = mimePartStream({type: 'image/png', transferEncoding: 'base64'});

  mimePart.readStream.on('end', function () {
    t.equal(output, expected);
    t.end();
  });
  mimePart.readStream.on('data', function (data) {
    output += data.toString();
  });
  mimePart.writeStream.end('YOUREALLYSHOULDPRETENDTHATTHISISANIMAGE ');
});

test('Content-Disposition header', function (t) {
  var output = '';
  var expected = 'Content-Type: image/png\r\nContent-Disposition: attachment; filename=potato.jpg\r\nContent-Transfer-Encoding: base64\r\n\r\nWU9VUkVBTExZU0hPVUxEUFJFVEVORFRIQVRUSElTSVNBTklNQUdFIA==\r\n';
  var mimePart = mimePartStream({type: 'image/png', transferEncoding: 'base64', disposition: 'attachment; filename=potato.jpg'});

  mimePart.readStream.on('end', function () {
    t.equal(output, expected);
    t.end();
  });
  mimePart.readStream.on('data', function (data) {
    output += data.toString();
  });
  mimePart.writeStream.end('YOUREALLYSHOULDPRETENDTHATTHISISANIMAGE ');
  
});
