/**
 * airlog-server.js
 *
 * @author bigggge
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var ua = require('useragent');
var ip = require('ip');
var morgan = require('morgan');

var port = process.argv.length > 2 ? ~~process.argv[2] : 3000;
var address = ip.address() + ':' + port;

app.use(bodyParser({limit: '50mb'}));
app.use(morgan('short'));

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/report', sendLog);

function sendLog (req, res) {

  if (!req.body.data) {
    return res.status(400).json({msg: 'no data'});
  }

  var body = req.body;
  body.data.ua = ua.parse(req.headers['user-agent']).toString();
  body.data.type = body.type;
  io.emit(body.type, body.data);

  res.status(200).json({msg: 'ok'});
}

server.listen(port, function () {
  console.log('AirLog listening on port ' + port + '!');
  console.log('\x1b[36m%s\x1b[0m', '在需要调试的页面引入以下脚本：\n');
  console.log(
    '<script id="airlog" al-level="default" src="//' + address + '/airlog-client.js"></script>');
  console.log('\x1b[35m', '\n请不要关闭此窗口，在 ' + address + ' 查看调试页面的LOG');
});