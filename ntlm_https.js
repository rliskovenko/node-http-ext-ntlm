var https = require('https');
var ntlm = require('ntlm');
var async = require('async');

var addRequest = https.Agent.prototype.addRequest;
https.Agent.prototype.addRequest = function(req, options) {
  if (options.reqSocket != null) {
    req.onSocket(socket);
  } else {
    addRequest.apply(this, arguments);
  }
};

var originRequest = https.request;
https.request = function(options, callback) {
  options.headers.Connection = 'keep-alive';
  var req = originRequest(options);
  var reqSocket = null;
  req.on('socket', function(socket) { reqSocket = socket; });
  req.on('response', function(response) {
    if (response.statusCode !== 401)  //Unauthorize
      return callback(response);
    requestSock.removeAllListeners('free');
    console.log(requestSock._httpMessage != null);
    options.reqSocket = requestSock;
    authorize(options, callback);
  });
  return req;
}

function notFreeRequest(options, callback) {
  var req = https.request(options);
  var reqSocket = null;
  req.on('socket', function(socket) { reqSocket = socket; });
  req.on('response', function(response) {
    reqSocket.removeAllListeners('free');
    callback(null, response);
  });
  req.on('error', function(error) { callback(error); })
}

function authorize(options, callback) {
  async.waterfall([
    function(callback) {
      var type1msg = ntlm.createType1Message(options);
      options.headers.Connection = 'keep-alive';
      options.headers.Authorization = type1msg;
      notFreeRequest(options, callback);
    },
    function(res, callback) {
      if(!res.headers['www-authenticate'])
        return callback(new Error('www-authenticate not found on response of second request'));

      var type2msg = ntlm.parseType2Message(res.headers['www-authenticate']);
      var type3msg = ntlm.createType3Message(type2msg, options);
      options.headers.Authorization = type3msg;
      var req = https.request(options, function(response) {
        callback(null, response);
      });
    }
  ], function(err, res) {
    if(err) return callback(err);
    callback(res);
    console.log(res.headers);
    console.log(res.body);
  });
}
