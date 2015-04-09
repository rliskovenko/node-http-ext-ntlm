# node-ntlm

**http-ext-ntlm** is a [http-ext](https://github.com/liuxiong332/node-http-ext) plugin to do NTLM authentication

It's a port from the Python libary [python-ntml](https://code.google.com/p/python-ntlm/)

## Install

You can install http-ext-ntlm using the Node Package Manager (npm):

    npm install http-ext-ntlm

## How to use

this module is the plugin of **http-ext**, so you should use with http-ext.

```js
var request = require('http-ext');
var https = require('https');
var http = require('http');
var NtlmAuthFilter = require('http-ext-ntlm');

// use http-ext-ntlm module to authorize
request.globalFilterManager.use(NtlmAuthFilter);

var keepAliveAgent = new http.Agent({keepAlive: true});
var requestConfig = {
  ntlmAuth: {  
    username: <username>,
    password: <password>,
    domain: <domain>,
  },
  agent: keepAliveAgent
};

request.get(url, requestConfig, function(err, result) {
  if(err) throw err;
  console.log('DONE!');
});
```

more examples you can see the example directory of source repository.

## ntlmAuth Options

- `username:` _{String}_   Username. (Required)
- `password:` _{String}_   Password. (Required)
- `workstation:` _{String}_ Name of workstation or `''`.
- `domain:`   _{String}_   Name of domain or `''`.

## More information

* [python-ntlm](https://code.google.com/p/python-ntlm/)
* [NTLM Authentication Scheme for HTTP](http://www.innovation.ch/personal/ronald/ntlm.html)
* [LM hash on Wikipedia](http://en.wikipedia.org/wiki/LM_hash)


## License (MIT)

Copyright (c) liuxiong <https://github.com/liuxiong332/>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
