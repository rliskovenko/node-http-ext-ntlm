
var request = require('http-ext');
var https = require('https');
var http = require('http');
var NtlmAuthFilter = require('http-ext-ntlm');

// use http-ext-ntlm module to authorize
request.globalFilterManager.use(NtlmAuthFilter);

var keepAliveAgent = new http.Agent({keepAlive: true});
var requestConfig = {
  ntlmAuth: {
    username: username,
    password: password,
    domain: domain,
  },
  proxy: {      // if you need connect to proxy server
    host: 'localhost',
    port: 8888,
  },
  rejectUnauthorized: false,  // ignore unauthorized ssl cert error
  keepAlive: true,
  agent: keepAliveAgent
};

request.get(url, requestConfig, function(err, result) {
  if(err) throw err;
  console.log('DONE!');
});
