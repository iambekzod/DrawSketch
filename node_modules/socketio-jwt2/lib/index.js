var xtend = require('underscore').extend;
var jwt = require('jsonwebtoken');
var UnauthorizedError = require('./UnauthorizedError');

function noQsMethod(options) {
  var defaults = { required: true };
  options = xtend(defaults, options);

  return function (socket) {
    var server = this.server || socket.server;

    if (!server.$emit) {
      //then is socket.io 1.0
      var Namespace = Object.getPrototypeOf(server.sockets).constructor;
      // Add authenticated event if there is no authenticated event in Namespace.events
      if (!~Namespace.events.indexOf('authenticated')) {
        Namespace.events.push('authenticated');
      }
    }

    if (options.required) {
      var auth_timeout = setTimeout(function () {
        socket.disconnect('unauthorized');
      }, options.timeout || 5000);
    }

    socket.on('authenticate', function (data) {
      var authToken = (data && data.token) ? data.token : socket.request.headers.authorization;
      if (options.required) {
        clearTimeout(auth_timeout);
      }
      // error handler
      var onError = function(err, code) {
          if (err) {
            code = code || 'unknown';
            var error = new UnauthorizedError(code, {
              message: (Object.prototype.toString.call(err) === '[object Object]' && err.message) ? err.message : err
            });
            var callback_timeout;
            // If callback explicitely set to false, start timeout to disconnect socket 
            // callback is the milliseconds of setTimeout
            if (options.callback === false || typeof options.callback === "number") {
              if (typeof options.callback === "number") {
                if (options.callback < 0) {
                  // If callback is negative(invalid value), make it positive
                  options.callback = Math.abs(options.callback);
                }
              }
              callback_timeout = setTimeout(function () {
                socket.disconnect('unauthorized');
              }, (options.callback === false ? 0 : options.callback));
            }
            socket.emit('unauthorized', error, function() {
              if (typeof options.callback === "number") {
                clearTimeout(callback_timeout);
              }
              socket.disconnect('unauthorized');
            });
            return; // stop logic, socket will be close on next tick
          }
      };

      // data -> { token: 'jwtToken' }
      if (!authToken) {
        return onError({ message: 'invalid token datatype' }, 'invalid_token');
      }

      var onJwtVerificationReady = function(err, decoded) {
        if (err) { 
          return onError(err, 'invalid_token'); 
        }
        // success handler
        var onSuccess = function() {
          socket[options.decodedPropertyName] = decoded;
          socket.emit('authenticated');
          if (server.$emit) {
            server.$emit('authenticated', socket);
          } else {
            //try getting the current namespace otherwise fallback to all sockets.
            var namespace = (server.nsps && socket.nsp &&
                             server.nsps[socket.nsp.name]) ||
                            server.sockets;

            // explicit namespace
            namespace.emit('authenticated', socket);
          }
        };

        if(options.additional_auth && typeof options.additional_auth === 'function') {
          options.additional_auth(decoded, onSuccess, onError);
        } else {
          onSuccess();
        }
      };

      var onSecretReady = function(err, secret) {
        if (err || !secret) {
          return onError(err, 'invalid_secret');
        }

        jwt.verify(authToken, secret, options, onJwtVerificationReady);
      };

      getSecret(socket.request, options.secret, authToken, onSecretReady);
    });
  };
}

function authorize(options, onConnection) {
  options = xtend({ decodedPropertyName: 'decoded_token' }, options);
  
  if (!options.handshake) {
    return noQsMethod(options);
  }
  
  var defaults = {
    success: function (socket, accept) {
      if (socket.request) {
        accept();
      } else {
        accept(null, true);
      }
    },
    fail: function(error, socket, accept){
      if (socket.request) {
        accept(error);
      } else {
        accept(null, false);
      }
    }
  };

  var auth = xtend(defaults, options);

  return function(socket, accept) {
    var token, error;
    var req = socket.request || socket;
    var authorizationHeader = (req.headers || {}).authorization;
    if (authorizationHeader) {

      var parts = authorizationHeader.split(' ');
      if (parts.length == 2) {
        var scheme = parts[0],
          credentials = parts[1];

        if (scheme.toLowerCase() === 'bearer') {
          token = credentials;
        }
      } else if (isJWT(authorizationHeader)) {
        token = authorizationHeader;
      } else {
        error = new UnauthorizedError('credentials_bad_format', {
          message: 'Format is Authorization: Bearer [token]'
        });
        return auth.fail(error, socket, accept);
      }
    }

    //get the token from query string
    if (req._query && req._query.token) {
      token = req._query.token;
    }
    else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      error = new UnauthorizedError('credentials_required', {
        message: 'No Authorization header was found'
      });
      return auth.fail(error, socket, accept);
    }

    var onJwtVerificationReady = function(err, decoded) {

      if (err) {
        error = new UnauthorizedError(err.code || 'invalid_token', err);
        return auth.fail(error, socket, accept);
      }

      socket[options.decodedPropertyName] = decoded;

      return auth.success(socket, accept);
    };

    var onSecretReady = function(err, secret) {
      if (err) {
        error = new UnauthorizedError(err.code || 'invalid_secret', err);
        return auth.fail(error, socket, accept);
      }
      console.log('onSecretReady called');
      jwt.verify(token, secret, options, onJwtVerificationReady);
    };

    getSecret(req, options.secret, token, onSecretReady);
  };
}

function getSecret(request, secret, token, onSecretReady) {
  if (typeof secret === 'function') {
    if (!token) {
      return onSecretReady({ code: 'invalid_token', message: 'jwt must be provided' });
    }

    var parts = token.split('.');

    if (parts.length < 3) {
      return onSecretReady({ code: 'invalid_token', message: 'jwt malformed' });
    }

    if (parts[2].trim() === '') {
      return onSecretReady({ code: 'invalid_token', message: 'jwt signature is required' });
    }

    var decodedToken = jwt.decode(token);

    if (!decodedToken) {
      return onSecretReady({ code: 'invalid_token', message: 'jwt malformed' });
    }

    secret(request, decodedToken, onSecretReady);
  } else {
    onSecretReady(null, secret);
  }
};

function isJWT (token) {
  var parts = token.split('.');
  return parts.length === 3;
}

exports.authorize = authorize;
