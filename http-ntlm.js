var ntlm = require('./ntlm');
var httpExt = require('http-ext')

const NEED_TYPE1_AUTH = 1
const NEED_TYPE3_AUTH = 2
const NTLM_AUTH_OK = 3

function NtlmAuthFilter(config) {
  this.config = config || {};
}

NtlmAuthFilter.prototype.filterOption = function(option, requestOpts) {
  if(option.ntlmAuth != null)
    this.config = option.ntlmAuth;
};

NtlmAuthFilter.prototype.filterRequest = function(request, next) {
  request.on('socket', function(socket) {
    this.setAuthHeader(request, socket);
    next();
  }.bind(this));
};

NtlmAuthFilter.prototype.setAuthHeader = function(request, socket) {
  if(socket.ntlmStatus != null) {
    var status = socket.ntlmStatus;
    // require('util').log('filterRequest status: ' + status + ', socket: ' + socket.ntlmId);
    if(status === NEED_TYPE1_AUTH)
      request.setHeader('Authorization', ntlm.createType1Message(this.config));
    else if(status === NEED_TYPE3_AUTH) {
      var type3msg = ntlm.createType3Message(socket.ntlmInfo, this.config);
      request.setHeader('Authorization', type3msg);
    }
  }
};

NtlmAuthFilter.prototype.setManagerScope = function(scope) {
  this.managerScope = scope;
  if (scope.count == null)
    scope.count = 0;
};

NtlmAuthFilter.prototype.filterResponse = function(res, next) {
  var resSocket = res.socket;

  authVal = res.headers['www-authenticate'];
  if(res.statusCode === 401 && authVal != null && /\bNTLM\b/.test(authVal)) {
    if(resSocket.ntlmStatus == null) {
      // client need send TYPE1 message
      resSocket.ntlmId = this.managerScope.count++;
      resSocket.ntlmStatus = NEED_TYPE1_AUTH;
      throw new httpExt.RetryError;
    } else {
      resSocket.ntlmInfo = ntlm.parseType2Message(authVal, function(err) {
        resSocket.ntlmStatus = NEED_TYPE1_AUTH;
        throw new httpExt.RetryError;
      });
      //client need send request again with TYPE2 message Authrization
      resSocket.ntlmStatus = NEED_TYPE3_AUTH;
      throw new httpExt.RetryError;
    }
  } else if(resSocket.ntlmStatus != NTLM_AUTH_OK) {
    // NTLM Auth success
    resSocket.ntlmStatus = NTLM_AUTH_OK;
  }
  next()
};

module.exports = NtlmAuthFilter
