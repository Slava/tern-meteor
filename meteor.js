(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(require("../lib/infer"), require("../lib/tern"), require);
  if (typeof define == "function" && define.amd) // AMD
    return define(["../lib/infer", "../lib/tern"], mod);
  mod(tern, tern);
})(function(infer, tern, require) {
  "use strict";

  function resolvePath(base, path) {
    if (path[0] == "/") return path;
    var slash = base.lastIndexOf("/"), m;
    if (slash >= 0) path = base.slice(0, slash + 1) + path;
    while (m = /[^\/]*[^\/\.][^\/]*\/\.\.\//.exec(path))
      path = path.slice(0, m.index) + path.slice(m.index + m[0].length);
    return path.replace(/(^|[^\.])\.\//g, "$1");
  }

  function buildWrappingScope(parent, origin, node) {
    var scope = new infer.Scope(parent);
    return scope;
  }

  tern.registerPlugin("meteor", function(server, options) {
    server._node = {
      modules: Object.create(null),
      options: options || {},
      currentFile: null,
      server: server
    };

    server.on("beforeLoad", function(file) {
      // Just building a wrapping scope for a file
      this._node.currentFile = resolvePath(server.options.projectDir + "/", file.name.replace(/\\/g, "/"));
      file.scope = buildWrappingScope(file.scope, file.name, file.ast);
    });

    server.on("afterLoad", function(file) {
      // XXX do we even need this stuff?
      this._node.currentFile = null;
    });

    server.on("reset", function() {
      // XXX
    });

    return {defs: defs};
  });

  var defs = {
    "!name": "meteor",
    "!define": {
      "IMeteor.absoluteUrl.options": {
        "secure": "bool",
        "replaceLocalhost": "bool",
        "rootUrl": "string"
      },
      "IMeteor.status.!ret": {
        "connected": "bool",
        "status": "string",
        "retryCount": "number",
        "retryTime": "number",
        "reason": "string"
      },
      "IMeteor.Collection.options": {
        "connection": "Object",
        "idGeneration": "string",
        "transform": "fn()"
      },
      "IMeteor.loginWithExternalService.options": {
        "requestPermissions": "[string]",
        "requestOfflineToken": "bool",
        "forceApprovalPrompt": "bool"
      },
      "IMeteor.loginWithFacebook.options": {
        "requestPermissions": "[string]",
        "requestOfflineToken": "bool",
        "forceApprovalPrompt": "bool"
      },
      "IMeteor.loginWithGithub.options": {
        "requestPermissions": "[string]",
        "requestOfflineToken": "bool",
        "forceApprovalPrompt": "bool"
      },
      "IMeteor.loginWithGoogle.options": {
        "requestPermissions": "[string]",
        "requestOfflineToken": "bool",
        "forceApprovalPrompt": "bool"
      },
      "IMeteor.loginWithMeetup.options": {
        "requestPermissions": "[string]",
        "requestOfflineToken": "bool",
        "forceApprovalPrompt": "bool"
      },
      "IMeteor.loginWithTwitter.options": {
        "requestPermissions": "[string]",
        "requestOfflineToken": "bool",
        "forceApprovalPrompt": "bool"
      },
      "IMeteor.loginWithWeibo.options": {
        "requestPermissions": "[string]",
        "requestOfflineToken": "bool",
        "forceApprovalPrompt": "bool"
      },
      "IMeteorViewModel.events.eventMap": {
        "__item": "fn(eventName: string) -> fn()"
      },
      "IMeteorManager.events.eventMap": {
        "__item": "fn(eventType: string) -> fn()"
      },
      "IMeteorAccounts.config.options": {
        "sendVerificationEmail": "bool",
        "forbidClientAccountCreation": "bool"
      },
      "IMeteorAccounts.ui.config.options": {
        "requestPermissions": "Object",
        "requestOfflineToken": "Object",
        "passwordSignupFields": "string"
      },
      "IMeteorAccounts.createUser.options": {
        "username": "string",
        "email": "string",
        "password": "string",
        "profile": "string"
      },
      "IMeteorAccounts.forgotPassword.options": {
        "email": "string"
      },
      "IMeteorHTTP.call.options": {
        "content": "string",
        "data": "Object",
        "query": "string",
        "params": "Object",
        "auth": "string",
        "headers": "Object",
        "timeout": "number",
        "followRedirects": "bool"
      },
      "IMeteorHTTP.get.options": {
        "content": "string",
        "data": "Object",
        "query": "string",
        "params": "Object",
        "auth": "string",
        "headers": "Object",
        "timeout": "number",
        "followRedirects": "bool"
      },
      "IMeteorHTTP.post.options": {
        "content": "string",
        "data": "Object",
        "query": "string",
        "params": "Object",
        "auth": "string",
        "headers": "Object",
        "timeout": "number",
        "followRedirects": "bool"
      },
      "IMeteorHTTP.put.options": {
        "content": "string",
        "data": "Object",
        "query": "string",
        "params": "Object",
        "auth": "string",
        "headers": "Object",
        "timeout": "number",
        "followRedirects": "bool"
      },
      "IMeteorHTTP.del.options": {
        "content": "string",
        "data": "Object",
        "query": "string",
        "params": "Object",
        "auth": "string",
        "headers": "Object",
        "timeout": "number",
        "followRedirects": "bool"
      },
      "IMeteorEmail.send.options": {
        "from": "string",
        "to": "?",
        "cc": "?",
        "bcc": "?",
        "replyTo": "?",
        "subject": "string",
        "text": "string",
        "html": "string",
        "headers": "Object"
      }
    },
    "IMeteor": {
      "isClient": "bool",
      "isServer": "bool",
      "startup": "fn(func: fn())",
      "absoluteUrl": "fn(path: string, options: IMeteor.absoluteUrl.options)",
      "settings": "Object",
      "release": "string",
      "publish": "fn(name: string, func: fn()) -> ?",
      "subscribe": "fn(name: string, arg1?: ?, arg2?: ?, ars3?: ?, arg4?: ?, callbacks?: Object) -> IMeteorHandle",
      "methods": "fn(methods: Object)",
      "Error": "fn(error: number, reason?: string, details?: string)",
      "call": "fn(name: string, param1?: Object, param2?: Object, param3?: Object, param4?: Object, asyncCallback?: fn())",
      "apply": "fn(name: string, options: [?], asyncCallback?: fn())",
      "defer": "fn(callback: fn())",
      "status": "fn() -> IMeteor.status.!ret",
      "reconnect": "fn()",
      "disconnect": "fn()",
      "Collection": {
        "!type": "fn(name: string, options?: IMeteor.Collection.options)",
        "prototype": {
          "find": "fn(selector?: ?, options?: Object) -> IMeteorCursor",
          "findOne": "fn(selector: ?, options?: Object) -> ?",
          "insert": "fn(doc: Object, callback?: fn()) -> string",
          "update": "fn(selector: ?, modifier: ?, options?: Object, callback?: fn())",
          "remove": "fn(selector: ?, callback?: fn())",
          "allow": "fn(options: Object) -> bool",
          "deny": "fn(options: Object) -> bool",
          "ObjectID": "fn(hexString?: string) -> Object"
        }
      },
      "user": "fn() -> IMeteorUser",
      "userId": "fn() -> string",
      "users": "IMeteor.Collection.prototype",
      "loggingIn": "fn() -> bool",
      "logout": "fn(callback?: fn())",
      "loginWithPassword": "fn(user: Object, password: string, callback?: fn())",
      "loginWithExternalService": "fn(options?: IMeteor.loginWithExternalService.options, callback?: fn())",
      "loginWithFacebook": "fn(options?: IMeteor.loginWithFacebook.options, callback?: fn())",
      "loginWithGithub": "fn(options?: IMeteor.loginWithGithub.options, callback?: fn())",
      "loginWithGoogle": "fn(options?: IMeteor.loginWithGoogle.options, callback?: fn())",
      "loginWithMeetup": "fn(options?: IMeteor.loginWithMeetup.options, callback?: fn())",
      "loginWithTwitter": "fn(options?: IMeteor.loginWithTwitter.options, callback?: fn())",
      "loginWithWeibo": "fn(options?: IMeteor.loginWithWeibo.options, callback?: fn())",
      "render": "fn(htmlFunc: fn()) -> DocumentFragment",
      "renderList": "fn(observable: IMeteorCursor, docFunc: fn(), elseFunc?: fn()) -> DocumentFragment",
      "setTimeout": "fn(func: fn(), delay: number)",
      "setInterval": "fn(func: fn(), delay: number)",
      "clearTimeout": "fn(id: number)",
      "clearInterval": "fn(id: number)",
      "subscribeWithPagination": "fn(collection: string, limit: number) -> IMeteorHandle",
      "Template": "fn()",
      "Router": "IMeteorRouter",
      "Errors": "IMeteorErrors"
    },
    "IMeteorCursor": {
      "forEach": "fn(callback: fn())",
      "map": "fn(callback: fn())",
      "fetch": "fn() -> [?]",
      "count": "fn() -> number",
      "rewind": "fn()",
      "observe": "fn(callbacks: Object)",
      "observeChanges": "fn(callbacks: Object)"
    },
    "IMeteorViewModel": {
      "rendered": "fn(callback: fn())",
      "created": "fn(callback: fn())",
      "destroyed": "fn(callback: fn())",
      "events": "fn(eventMap: IMeteorViewModel.events.eventMap)",
      "helpers": "fn(helpers: Object)",
      "preserve": "fn(selector: Object)"
    },
    "IMeteorManager": {
      "rendered": "fn(callback: fn())",
      "created": "fn(callback: fn())",
      "destroyed": "fn(callback: fn())",
      "events": "fn(eventMap: IMeteorManager.events.eventMap)",
      "helpers": "fn(helpers: Object) -> ?",
      "preserve": "fn(selector: Object)"
    },
    "IMeteorEvent": {
      "type": "MeteorEventType.Value",
      "target": "Element",
      "currentTarget": "Element",
      "which": "number",
      "stopPropogation": "fn()",
      "stopImmediatePropogation": "fn()",
      "preventDefault": "fn()",
      "isPropogationStopped": "fn() -> bool",
      "isImmediatePropogationStopped": "fn() -> bool",
      "isDefaultPrevented": "fn() -> bool"
    },
    "MeteorEventType": {
      "Value": {
        "_map": "?",
        "click": "click",
        "dblclick": "dblclick",
        "focus": "focus",
        "blur": "blur",
        "change": "change",
        "mouseenter": "mouseenter",
        "mouseleave": "mouseleave",
        "mousedown": "mousedown",
        "mouseup": "mouseup",
        "keydown": "keydown",
        "keypress": "keypress",
        "keyup": "keyup",
        "tap": "tap"
      }
    },
    "IMeteorSession": {
      "set": "fn(key: string, value: Object)",
      "setDefault": "fn(key: string, value: Object)",
      "get": "fn(key: string) -> Object",
      "equals": "fn(key: string, value: ?)"
    },
    "IMeteorHandle": {
      "loaded": "fn() -> number",
      "limit": "fn() -> number",
      "ready": "fn() -> bool",
      "loadNextPage": "fn()"
    },
    "IMeteorUser": {
      "_id": "string",
      "username": "string",
      "emails": {
        "address": "string",
        "verified": "bool"
      },
      "profile": "?",
      "services": "?",
      "createdAt": "number"
    },
    "IMeteorAccounts": {
      "config": "fn(options: IMeteorAccounts.config.options)",
      "ui": {
        "config": "fn(options: IMeteorAccounts.ui.config.options)"
      },
      "validateNewUser": "fn(func: fn())",
      "onCreateUser": "fn(func: fn())",
      "createUser": "fn(options: IMeteorAccounts.createUser.options, callback?: fn())",
      "changePassword": "fn(oldPassword: string, newPassword: string, callback?: fn())",
      "forgotPassword": "fn(options: IMeteorAccounts.forgotPassword.options, callback?: fn())",
      "resetPassword": "fn(token: string, newPassword: string, callback?: fn())",
      "setPassword": "fn(userId: string, newPassword: string)",
      "verifyEmail": "fn(token: string, callback?: fn())",
      "sendResetPasswordEmail": "fn(userId: string, email?: string)",
      "sendEnrollmentEmail": "fn(userId: string, email?: string)",
      "sendVerificationEmail": "fn(userId: string, email?: string)",
      "emailTemplates": {
        "from": "string",
        "siteName": "string",
        "resetPassword": "IMeteorEmailValues",
        "enrollAccount": "IMeteorEmailValues",
        "verifyEmail": "IMeteorEmailValues"
      },
      "loginServiceConfiguration": {
        "remove": "fn(options: Object)",
        "insert": "fn(options: Object)"
      }
    },
    "IMeteorEmailValues": {
      "subject": "fn()",
      "text": "fn()"
    },
    "IMeteorMatch": {
      "test": "fn(value: ?, pattern: ?) -> bool",
      "Any": "?",
      "String": "?",
      "Number": "?",
      "Boolean": "?",
      "undefined": "?",
      "null": "?",
      "Integer": "?",
      "ObjectIncluding": "?",
      "Object": "?",
      "Optional": "fn(pattern: string)",
      "OneOf": "fn()",
      "Where": "fn(condition: bool)"
    },
    "IExternalServiceParams": {
      "options": {
        "requestPermissions": "[string]",
        "requestOfflineToken": "bool",
        "forceApprovalPrompt": "bool"
      },
      "callback": "fn()"
    },
    "IMeteorDeps": {
      "autorun": "fn(runFunc: fn()) -> IMeteorComputationObject",
      "flush": "fn()",
      "nonreactive": "fn(func: fn())",
      "active": "bool",
      "currentComputation": "IMeteorComputationObject",
      "onInvalidate": "fn(callback: fn())",
      "afterFlush": "fn(callback: fn())",
      "Computation": "fn()",
      "Dependency": "fn()"
    },
    "IMeteorComputationObject": {
      "stop": "fn()",
      "invalidate": "fn()",
      "onInvalidate": "fn(callback: fn())",
      "stopped": "bool",
      "invalidated": "bool",
      "firstRun": "bool"
    },
    "IMeteorDependencyObject": {
      "changed": "fn()",
      "depend": "fn(fromComputation?: IMeteorComputationObject) -> bool",
      "hasDependents": "fn() -> bool"
    },
    "IMeteorEJSON": {
      "parse": "fn(str: string)",
      "stringify": "fn(val: ?) -> string",
      "fromJSONValue": "fn(val: ?) -> ?",
      "toJSONValue": "fn(val: ?) -> JSON",
      "equals": "fn(any: ?) -> bool",
      "clone": "fn(val: ?) -> ?",
      "newBinary": "fn(size: number)",
      "isBinary": "fn(x: ?) -> bool",
      "addType": "fn(name: string, factory: fn())"
    },
    "IMeteorHTTP": {
      "call": "fn(method: string, url: string, options: IMeteorHTTP.call.options, asyncCallback?: fn()) -> IMeteorHTTPResult",
      "get": "fn(url: string, options?: IMeteorHTTP.get.options, asyncCallback?: fn()) -> IMeteorHTTPResult",
      "post": "fn(url: string, options?: IMeteorHTTP.post.options, asyncCallback?: fn()) -> IMeteorHTTPResult",
      "put": "fn(url: string, options?: IMeteorHTTP.put.options, asyncCallback?: fn()) -> IMeteorHTTPResult",
      "del": "fn(url: string, options?: IMeteorHTTP.del.options, asyncCallback?: fn()) -> IMeteorHTTPResult"
    },
    "IMeteorHTTPCallOptions": {
      "content": "string",
      "data": "Object",
      "query": "string",
      "params": "Object",
      "auth": "string",
      "headers": "Object",
      "timeout": "number",
      "followRedirects": "bool"
    },
    "IMeteorHTTPResult": {
      "statusCode": "number",
      "content": "string",
      "data": "JSON",
      "headers": "Object"
    },
    "IMeteorEmail": {
      "send": "fn(options: IMeteorEmail.send.options)"
    },
    "IMeteorAssets": {
      "getText": "fn(assetPath: string, asyncCallback?: fn()) -> string",
      "getBinary": "fn(assetPath: string, asyncCallback?: fn()) -> ?"
    },
    "IMeteorDPP": {
      "connect": "fn(url: string)"
    },
    "Meteor": "IMeteor",
    "Session": "IMeteorSession",
    "Deps": "IMeteorDeps",
    "Accounts": "IMeteorAccounts",
    "Match": "IMeteorMatch",
    "check": "fn(value: ?, pattern: ?)",
    "Computation": "IMeteorComputationObject",
    "Dependency": "IMeteorDependencyObject",
    "EJSON": "IMeteorEJSON",
    "HTTP": "IMeteorHTTP",
    "Email": "IMeteorEmail",
    "Assets": "IMeteorAssets",
    "DPP": "IMeteorDPP",
    "changed": "fn(collection: string, id: string, fields: ?, Object: ?)",
    "IMeteorRouter": {
      "page": "fn()",
      "add": "fn(route: Object)",
      "to": "fn(path: string)",
      "filters": "fn(filtersMap: Object)",
      "filter": "fn(filterName: string, options?: Object)",
      "map": "fn(routeMap: fn())",
      "path": "fn(route: string, params?: Object)",
      "url": "fn(route: string)",
      "routes": "Object",
      "configure": "fn(options: IMeteorRouterConfig)"
    },
    "IMeteorRouterConfig": {
      "layout": "string",
      "notFoundTemplate": "string",
      "loadingTemplate": "string",
      "renderTemplates": "Object"
    },
    "IMeteorErrors": {
      "throw": "fn(message: string)",
      "clear": "fn()"
    },
    "Router": "IMeteorRouter"
  };
});
