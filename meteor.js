(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(require("tern/lib/infer"), require("tern/lib/tern"), require);
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
    server._meteor = {
      modules: Object.create(null),
      options: options || {},
      currentFile: null,
      server: server
    };

    server.on("beforeLoad", function(file) {
      // Just building a wrapping scope for a file
      this._meteor.currentFile = resolvePath(server.options.projectDir + "/", file.name.replace(/\\/g, "/"));
      file.scope = buildWrappingScope(file.scope, file.name, file.ast);
    });

    server.on("afterLoad", function(file) {
      // XXX do we even need this stuff?
      this._meteor.currentFile = null;
    });

    server.on("reset", function() {
      // XXX
    });

    return {defs: defs};
  });

  var defs = {
    "!name": "meteor",
    "Match": {
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
      "Where": "fn(condition: bool)",
      "!doc": "The namespace for all Match types and methods.",
      "test": {
        "!doc": "Returns true if the value matches the pattern.",
        "!type": "fn(value, pattern: +MatchPattern)"
      }
    },
    "MeteorSubscribeHandle": {
      "stop": "fn()",
      "ready": "fn() -> bool"
    },
    "Blaze": {
      "Template": {
        "!doc": "Constructor for a Template, which is used to construct Views with particular name and content.",
        "!type": "fn(viewName?: string, renderFunction: fn())"
      },
      "TemplateInstance": {
        "!doc": "The class for template instances",
        "!type": "fn(view: +Blaze.View)",
        "prototype": {
          "$": {
            "!doc": "Find all elements matching `selector` in this template instance, and return them as a JQuery object.",
            "!type": "fn(selector: string) -> [+DOMNode]"
          },
          "autorun": {
            "!doc": "A version of [Tracker.autorun](#tracker_autorun) that is stopped when the template is destroyed.",
            "!type": "fn(runFunc: fn()) -> +Tracker.Computation"
          },
          "data": {
            "!doc": "The data context of this instance's latest invocation."
          },
          "find": {
            "!doc": "Find one element matching `selector` in this template instance.",
            "!type": "fn(selector: string) -> +DOMElement"
          },
          "findAll": {
            "!doc": "Find all elements matching `selector` in this template instance.",
            "!type": "fn(selector: string) -> [+DOMElement]"
          },
          "firstNode": {
            "!doc": "The first top-level DOM node in this template instance.",
            "!type": "+DOMNode"
          },
          "lastNode": {
            "!doc": "The last top-level DOM node in this template instance.",
            "!type": "+DOMNode"
          },
          "subscribe": {
            "!doc": "A version of [Meteor.subscribe](#meteor_subscribe) that is stopped\nwhen the template is destroyed.",
            "!type": "fn(name: string, arg1, arg2..., callbacks?: fn()) -> +SubscriptionHandle"
          },
          "subscriptionsReady": {
            "!doc": "A reactive function that returns true when all of the subscriptions\ncalled with [this.subscribe](#TemplateInstance-subscribe) are ready.",
            "!type": "fn() -> bool"
          },
          "view": {
            "!doc": "The [View](#blaze_view) object for this invocation of the template.",
            "!type": "+Blaze.View"
          }
        }
      },
      "View": {
        "!doc": "Constructor for a View, which represents a reactive region of DOM.",
        "!type": "fn(name?: string, renderFunction: fn())"
      },
      "!doc": "The namespace for all Blaze-related methods and classes.",
      "Each": {
        "!doc": "Constructs a View that renders `contentFunc` for each item in a sequence.",
        "!type": "fn(argFunc: fn(), contentFunc: fn(), elseFunc?: fn())"
      },
      "If": {
        "!doc": "Constructs a View that renders content conditionally.",
        "!type": "fn(conditionFunc: fn(), contentFunc: fn(), elseFunc?: fn())"
      },
      "Unless": {
        "!doc": "An inverted [`Blaze.If`](#blaze_if).",
        "!type": "fn(conditionFunc: fn(), contentFunc: fn(), elseFunc?: fn())"
      },
      "With": {
        "!doc": "Constructs a View that renders content with a data context.",
        "!type": "fn(data: ?, contentFunc: fn())"
      },
      "currentView": {
        "!doc": "The View corresponding to the current template helper, event handler, callback, or autorun.  If there isn't one, `null`.",
        "!type": "+Blaze.View"
      },
      "getData": {
        "!doc": "Returns the current data context, or the data context that was used when rendering a particular DOM element or View from a Meteor template.",
        "!type": "fn(elementOrView?: +DOMElement)"
      },
      "getView": {
        "!doc": "Gets either the current View, or the View enclosing the given DOM element.",
        "!type": "fn(element?: +DOMElement)"
      },
      "isTemplate": {
        "!doc": "Returns true if `value` is a template object like `Template.myTemplate`.",
        "!type": "fn(value)"
      },
      "remove": {
        "!doc": "Removes a rendered View from the DOM, stopping all reactive updates and event listeners on it.",
        "!type": "fn(renderedView: +Blaze.View)"
      },
      "render": {
        "!doc": "Renders a template or View to DOM nodes and inserts it into the DOM, returning a rendered [View](#blaze_view) which can be passed to [`Blaze.remove`](#blaze_remove).",
        "!type": "fn(templateOrView: +Template, parentNode: +DOMNode, nextNode?: +DOMNode, parentView?: +Blaze.View)"
      },
      "renderWithData": {
        "!doc": "Renders a template or View to DOM nodes with a data context.  Otherwise identical to `Blaze.render`.",
        "!type": "fn(templateOrView: +Template, data: ?, parentNode: +DOMNode, nextNode?: +DOMNode, parentView?: +Blaze.View)"
      },
      "toHTML": {
        "!doc": "Renders a template or View to a string of HTML.",
        "!type": "fn(templateOrView: +Template)"
      },
      "toHTMLWithData": {
        "!doc": "Renders a template or View to HTML with a data context.  Otherwise identical to `Blaze.toHTML`.",
        "!type": "fn(templateOrView: +Template, data: ?)"
      }
    },
    "CompileStep": {
      "!doc": "The object passed into Plugin.registerSourceHandler",
      "!type": "fn()",
      "prototype": {
        "addAsset": {
          "!doc": "Add a file to serve as-is to the browser or to include on\nthe browser, depending on the target. On the web, it will be served\nat the exact path requested. For server targets, it can be retrieved\nusing `Assets.getText` or `Assets.getBinary`.",
          "!type": "fn(options: ?, path: string, data: +Buffer)"
        },
        "addHtml": {
          "!doc": "Works in web targets only. Add markup to the `head` or `body`\nsection of the document.",
          "!type": "fn(options: ?)"
        },
        "addJavaScript": {
          "!doc": "Add JavaScript code. The code added will only see the\nnamespaces imported by this package as runtime dependencies using\n['api.use'](#PackageAPI-use). If the file being compiled was added\nwith the bare flag, the resulting JavaScript won't be wrapped in a\nclosure.",
          "!type": "fn(options: ?)"
        },
        "addStylesheet": {
          "!doc": "Web targets only. Add a stylesheet to the document.",
          "!type": "fn(options: ?, path: string, data: string, sourceMap: string)"
        },
        "arch": {
          "!doc": "The architecture for which we are building. Can be \"os\",\n\"web.browser\", or \"web.cordova\".",
          "!type": "string"
        },
        "declaredExports": {
          "!doc": "The list of exports that the current package has defined.\nCan be used to treat those symbols differently during compilation.",
          "!type": "?"
        },
        "error": {
          "!doc": "Display a build error.",
          "!type": "fn(options: ?, message: string, sourcePath?: string, line: number, func: string)"
        },
        "fileOptions": {
          "!doc": "Any options passed to \"api.addFiles\".",
          "!type": "?"
        },
        "fullInputPath": {
          "!doc": "The filename and absolute path of the input file.\nPlease don't use this filename to read the file from disk, instead\nuse [compileStep.read](CompileStep-read).",
          "!type": "string"
        },
        "inputPath": {
          "!doc": "The filename and relative path of the input file.\nPlease don't use this filename to read the file from disk, instead\nuse [compileStep.read](CompileStep-read).",
          "!type": "string"
        },
        "inputSize": {
          "!doc": "The total number of bytes in the input file.",
          "!type": "number"
        },
        "packageName": {
          "!doc": "The name of the package in which the file being built exists.",
          "!type": "string"
        },
        "pathForSourceMap": {
          "!doc": "If you are generating a sourcemap for the compiled file, use\nthis path for the original file in the sourcemap.",
          "!type": "string"
        },
        "read": {
          "!doc": "Read from the input file. If `n` is specified, returns the\nnext `n` bytes of the file as a Buffer. XXX not sure if this actually\nreturns a String sometimes...",
          "!type": "fn(n?: number) -> +Buffer"
        },
        "rootOutputPath": {
          "!doc": "On web targets, this will be the root URL prepended\nto the paths you pick for your output files. For example,\nit could be \"/packages/my-package\".",
          "!type": "string"
        }
      }
    },
    "EJSON": {
      "CustomType": {
        "!doc": "The interface that a class must satisfy to be able to become an\nEJSON custom type via EJSON.addType.",
        "!type": "fn()",
        "prototype": {
          "clone": {
            "!doc": "Return a value `r` such that `this.equals(r)` is true, and modifications to `r` do not affect `this` and vice versa.",
            "!type": "fn()"
          },
          "equals": {
            "!doc": "Return `true` if `other` has a value equal to `this`; `false` otherwise.",
            "!type": "fn(other: ?)"
          },
          "toJSONValue": {
            "!doc": "Serialize this instance into a JSON-compatible value.",
            "!type": "fn()"
          },
          "typeName": {
            "!doc": "Return the tag used to identify this type.  This must match the tag used to register this type with [`EJSON.addType`](#ejson_add_type).",
            "!type": "fn()"
          }
        }
      },
      "!doc": "Namespace for EJSON functions",
      "addType": {
        "!doc": "Add a custom datatype to EJSON.",
        "!type": "fn(name: string, factory: fn())"
      },
      "clone": {
        "!doc": "Return a deep copy of `val`.",
        "!type": "fn(val: +EJSON)"
      },
      "equals": {
        "!doc": "Return true if `a` and `b` are equal to each other.  Return false otherwise.  Uses the `equals` method on `a` if present, otherwise performs a deep comparison.",
        "!type": "fn(a: +EJSON, b: +EJSON, options?: ?)"
      },
      "fromJSONValue": {
        "!doc": "Deserialize an EJSON value from its plain JSON representation.",
        "!type": "fn(val: +JSONCompatible)"
      },
      "isBinary": {
        "!doc": "Returns true if `x` is a buffer of binary data, as returned from [`EJSON.newBinary`](#ejson_new_binary).",
        "!type": "fn(x: ?)"
      },
      "newBinary": {
        "!doc": "Allocate a new buffer of binary data that EJSON can serialize."
      },
      "parse": {
        "!doc": "Parse a string into an EJSON value. Throws an error if the string is not valid EJSON.",
        "!type": "fn(str: string)"
      },
      "stringify": {
        "!doc": "Serialize a value to a string.\n\nFor EJSON values, the serialization fully represents the value. For non-EJSON values, serializes the same way as `JSON.stringify`.",
        "!type": "fn(val: +EJSON, options?: ?)"
      },
      "toJSONValue": {
        "!doc": "Serialize an EJSON-compatible value into its plain JSON representation.",
        "!type": "fn(val: +EJSON)"
      }
    },
    "Meteor": {
      "Error": {
        "!doc": "This class represents a symbolic error thrown by a method.",
        "!type": "fn(error: string, reason?: string, details?: string)"
      },
      "!doc": "The Meteor namespace",
      "absoluteUrl": {
        "!doc": "Generate an absolute URL pointing to the application. The server reads from the `ROOT_URL` environment variable to determine where it is running. This is taken care of automatically for apps deployed with `meteor deploy`, but must be provided when using `meteor build`.",
        "!type": "fn(path?: string, options?: ?)"
      },
      "apply": {
        "!doc": "Invoke a method passing an array of arguments.",
        "!type": "fn(name: string, args: [+EJSONable], options?: ?, asyncCallback?: fn())"
      },
      "call": {
        "!doc": "Invokes a method passing any number of arguments.",
        "!type": "fn(name: string, arg1, arg2..., asyncCallback?: fn())"
      },
      "clearInterval": {
        "!doc": "Cancel a repeating function call scheduled by `Meteor.setInterval`.",
        "!type": "fn(id: number)"
      },
      "clearTimeout": {
        "!doc": "Cancel a function call scheduled by `Meteor.setTimeout`.",
        "!type": "fn(id: number)"
      },
      "disconnect": {
        "!doc": "Disconnect the client from the server.",
        "!type": "fn()"
      },
      "isClient": {
        "!doc": "Boolean variable.  True if running in client environment.",
        "!type": "bool"
      },
      "isCordova": {
        "!doc": "Boolean variable.  True if running in a Cordova mobile environment.",
        "!type": "bool"
      },
      "isServer": {
        "!doc": "Boolean variable.  True if running in server environment.",
        "!type": "bool"
      },
      "loggingIn": {
        "!doc": "True if a login method (such as `Meteor.loginWithPassword`, `Meteor.loginWithFacebook`, or `Accounts.createUser`) is currently in progress. A reactive data source.",
        "!type": "fn()"
      },
      "loginWith<ExternalService>": {
        "!doc": "Log the user in using an external service.",
        "!type": "fn(options?: ?, callback?: fn())"
      },
      "loginWithPassword": {
        "!doc": "Log the user in with a password.",
        "!type": "fn(user: ?, password: string, callback?: fn())"
      },
      "logout": {
        "!doc": "Log the user out.",
        "!type": "fn(callback?: fn())"
      },
      "logoutOtherClients": {
        "!doc": "Log out other clients logged in as the current user, but does not log out the client that calls this function.",
        "!type": "fn(callback?: fn())"
      },
      "methods": {
        "!doc": "Defines functions that can be invoked over the network by clients.",
        "!type": "fn(methods: ?)"
      },
      "onConnection": {
        "!doc": "Register a callback to be called when a new DDP connection is made to the server.",
        "!type": "fn(callback: fn())"
      },
      "publish": {
        "!doc": "Publish a record set.",
        "!type": "fn(name: string, func: fn())"
      },
      "reconnect": {
        "!doc": "Force an immediate reconnection attempt if the client is not connected to the server.\n\n  This method does nothing if the client is already connected.",
        "!type": "fn()"
      },
      "release": {
        "!doc": "`Meteor.release` is a string containing the name of the [release](#meteorupdate) with which the project was built (for example, `\"1.2.3\"`). It is `undefined` if the project was built using a git checkout of Meteor.",
        "!type": "string"
      },
      "setInterval": {
        "!doc": "Call a function repeatedly, with a time delay between calls.",
        "!type": "fn(func: fn(), delay: number)"
      },
      "setTimeout": {
        "!doc": "Call a function in the future after waiting for a specified delay.",
        "!type": "fn(func: fn(), delay: number)"
      },
      "settings": {
        "!doc": "`Meteor.settings` contains deployment-specific configuration options. You can initialize settings by passing the `--settings` option (which takes the name of a file containing JSON data) to `meteor run` or `meteor deploy`. When running your server directly (e.g. from a bundle), you instead specify settings by putting the JSON directly into the `METEOR_SETTINGS` environment variable. If you don't provide any settings, `Meteor.settings` will be an empty object.  If the settings object contains a key named `public`, then `Meteor.settings.public` will be available on the client as well as the server.  All other properties of `Meteor.settings` are only defined on the server.",
        "!type": "?"
      },
      "startup": {
        "!doc": "Run code when a client or a server starts.",
        "!type": "fn(func: fn())"
      },
      "status": {
        "!doc": "Get the current connection status. A reactive data source.",
        "!type": "fn()"
      },
      "subscribe": {
        "!doc": "Subscribe to a record set.  Returns a handle that provides\n`stop()` and `ready()` methods.",
        "!type": "fn(name: string, arg1, arg2..., callbacks?: fn()) -> MeteorSubscribeHandle"
      },
      "user": {
        "!doc": "Get the current user record, or `null` if no user is logged in. A reactive data source.",
        "!type": "fn()"
      },
      "userId": {
        "!doc": "Get the current user id, or `null` if no user is logged in. A reactive data source.",
        "!type": "fn()"
      },
      "users": {
        "!doc": "A [Mongo.Collection](#collections) containing user documents.",
        "!type": "+Mongo.Collection"
      },
      "wrapAsync": {
        "!doc": "Wrap a function that takes a callback function as its final parameter. On the server, the wrapped function can be used either synchronously (without passing a callback) or asynchronously (when a callback is passed). On the client, a callback is always required; errors will be logged if there is no callback. If a callback is provided, the environment captured when the original function was called will be restored in the callback.",
        "!type": "fn(func: fn(), context?: ?)"
      }
    },
    "Mongo": {
      "Collection": {
        "!doc": "Constructor for a Collection",
        "!type": "fn(name: string, options?: ?)",
        "prototype": {
          "allow": {
            "!doc": "Allow users to write directly to this collection from client code, subject to limitations you define.",
            "!type": "fn(options: ?)"
          },
          "deny": {
            "!doc": "Override `allow` rules.",
            "!type": "fn(options: ?)"
          },
          "find": {
            "!doc": "Find the documents in a collection that match the selector.",
            "!type": "fn(selector?: +MongoSelector, options?: ?) -> +Mongo.Cursor"
          },
          "findOne": {
            "!doc": "Finds the first document that matches the selector, as ordered by sort and skip options.",
            "!type": "fn(selector?: +MongoSelector, options?: ?) -> ?"
          },
          "insert": {
            "!doc": "Insert a document in the collection.  Returns its unique _id.",
            "!type": "fn(doc: ?, callback?: fn())"
          },
          "remove": {
            "!doc": "Remove documents from the collection",
            "!type": "fn(selector: +MongoSelector, callback?: fn())"
          },
          "update": {
            "!doc": "Modify one or more documents in the collection. Returns the number of affected documents.",
            "!type": "fn(selector: +MongoSelector, modifier: +MongoModifier, options?: ?, callback?: fn())"
          },
          "upsert": {
            "!doc": "Modify one or more documents in the collection, or insert one if no matching documents were found. Returns an object with keys `numberAffected` (the number of documents modified)  and `insertedId` (the unique _id of the document that was inserted, if any).",
            "!type": "fn(selector: +MongoSelector, modifier: +MongoModifier, options?: ?, callback?: fn())"
          }
        }
      },
      "Cursor": {
        "!doc": "To create a cursor, use find. To access the documents in a cursor, use forEach, map, or fetch.",
        "!type": "fn()",
        "prototype": {
          "count": {
            "!doc": "Returns the number of documents that match a query.",
            "!type": "fn() -> number"
          },
          "fetch": {
            "!doc": "Return all matching documents as an Array.",
            "!type": "fn() -> [?]"
          },
          "forEach": {
            "!doc": "Call `callback` once for each matching document, sequentially and synchronously.",
            "!type": "fn(callback: fn(?, number), thisArg)"
          },
          "map": {
            "!doc": "Map callback over all matching documents.  Returns an Array.",
            "!type": "fn(callback: fn(?, number), thisArg)"
          },
          "observe": {
            "!doc": "Watch a query.  Receive callbacks as the result set changes.",
            "!type": "fn(callbacks: ?)"
          },
          "observeChanges": {
            "!doc": "Watch a query.  Receive callbacks as the result set changes.  Only the differences between the old and new documents are passed to the callbacks.",
            "!type": "fn(callbacks: ?)"
          }
        }
      },
      "ObjectID": {
        "!doc": "Create a Mongo-style `ObjectID`.  If you don't specify a `hexString`, the `ObjectID` will generated randomly (not using MongoDB's ID construction rules).",
        "!type": "fn(hexString: string)"
      },
      "!doc": "Namespace for MongoDB-related items"
    },
    "PackageAPI": {
      "!doc": "Type of the API object passed into the `Package.onUse` function.",
      "!type": "fn()",
      "prototype": {
        "addFiles": {
          "!doc": "Specify the source code for your package.",
          "!type": "fn(filename: string, architecture?: string)"
        },
        "export": {
          "!doc": "Export package-level variables in your package. The specified variables (declared without `var` in the source code) will be available to packages that use this package.",
          "!type": "fn(exportedObject: string, architecture?: string)"
        },
        "imply": {
          "!doc": "Give users of this package access to another package (by passing  in the string `packagename`) or a collection of packages (by passing in an  array of strings [`packagename1`, `packagename2`]",
          "!type": "fn(packageSpecs: string)"
        },
        "use": {
          "!doc": "Depend on package `packagename`.",
          "!type": "fn(packageNames: string, architecture?: string, options?: ?)"
        },
        "versionsFrom": {
          "!doc": "Use versions of core packages from a release. Unless provided, all packages will default to the versions released along with `meteorRelease`. This will save you from having to figure out the exact versions of the core packages you want to use. For example, if the newest release of meteor is `METEOR@0.9.0` and it includes `jquery@1.0.0`, you can write `api.versionsFrom('METEOR@0.9.0')` in your package, and when you later write `api.use('jquery')`, it will be equivalent to `api.use('jquery@1.0.0')`. You may specify an array of multiple releases, in which case the default value for constraints will be the \"or\" of the versions from each release: `api.versionsFrom(['METEOR@0.9.0', 'METEOR@0.9.5'])` may cause `api.use('jquery')` to be interpreted as `api.use('jquery@1.0.0 || 2.0.0')`.",
          "!type": "fn(meteorRelease: string)"
        }
      }
    },
    "ReactiveVar": {
      "!doc": "Constructor for a ReactiveVar, which represents a single reactive variable.",
      "!type": "fn(initialValue, equalsFunc?: fn())",
      "prototype": {
        "get": {
          "!doc": "Returns the current value of the ReactiveVar, establishing a reactive dependency.",
          "!type": "fn()"
        },
        "set": {
          "!doc": "Sets the current value of the ReactiveVar, invalidating the Computations that called `get` if `newValue` is different from the old value.",
          "!type": "fn(newValue)"
        }
      }
    },
    "Subscription": {
      "!doc": "The server's side of a subscription",
      "!type": "fn()",
      "prototype": {
        "added": {
          "!doc": "Call inside the publish function.  Informs the subscriber that a document has been added to the record set.",
          "!type": "fn(collection: string, id: string, fields: ?)"
        },
        "changed": {
          "!doc": "Call inside the publish function.  Informs the subscriber that a document in the record set has been modified.",
          "!type": "fn(collection: string, id: string, fields: ?)"
        },
        "connection": {
          "!doc": "Access inside the publish function. The incoming [connection](#meteor_onconnection) for this subscription."
        },
        "error": {
          "!doc": "Call inside the publish function.  Stops this client's subscription, triggering a call on the client to the `onStop` callback passed to [`Meteor.subscribe`](#meteor_subscribe), if any. If `error` is not a [`Meteor.Error`](#meteor_error), it will be [sanitized](#meteor_error).",
          "!type": "fn(error: +Error)"
        },
        "onStop": {
          "!doc": "Call inside the publish function.  Registers a callback function to run when the subscription is stopped.",
          "!type": "fn(func: fn())"
        },
        "ready": {
          "!doc": "Call inside the publish function.  Informs the subscriber that an initial, complete snapshot of the record set has been sent.  This will trigger a call on the client to the `onReady` callback passed to  [`Meteor.subscribe`](#meteor_subscribe), if any.",
          "!type": "fn()"
        },
        "removed": {
          "!doc": "Call inside the publish function.  Informs the subscriber that a document has been removed from the record set.",
          "!type": "fn(collection: string, id: string)"
        },
        "stop": {
          "!doc": "Call inside the publish function.  Stops this client's subscription and invokes the client's `onStop` callback with no error.",
          "!type": "fn()"
        },
        "userId": {
          "!doc": "Access inside the publish function. The id of the logged-in user, or `null` if no user is logged in."
        }
      }
    },
    "Template": {
      "!doc": "The class for defining templates",
      "!type": "fn()",
      "prototype": {
        "created": {
          "!doc": "Provide a callback when an instance of a template is created."
        },
        "destroyed": {
          "!doc": "Provide a callback when an instance of a template is destroyed."
        },
        "events": {
          "!doc": "Specify event handlers for this template.",
          "!type": "fn(eventMap: +EventMap)"
        },
        "helpers": {
          "!doc": "Specify template helpers available to this template.",
          "!type": "fn(helpers: ?)"
        },
        "onCreated": {
          "!doc": "Register a function to be called when an instance of this template is created."
        },
        "onDestroyed": {
          "!doc": "Register a function to be called when an instance of this template is removed from the DOM and destroyed."
        },
        "onRendered": {
          "!doc": "Register a function to be called when an instance of this template is inserted into the DOM."
        },
        "rendered": {
          "!doc": "Provide a callback when an instance of a template is rendered."
        }
      },
      "body": {
        "!doc": "The [template object](#templates_api) representing your `<body>`\ntag."
      },
      "currentData": {
        "!doc": "- Inside an `onCreated`, `onRendered`, or `onDestroyed` callback, returns\nthe data context of the template.\n- Inside a helper, returns the data context of the DOM node where the helper\nwas used.\n- Inside an event handler, returns the data context of the element that fired\nthe event.\n\nEstablishes a reactive dependency on the result.",
        "!type": "fn()"
      },
      "dynamic": {
        "!doc": "Choose a template to include dynamically, by name.",
        "!type": "fn(template: string, data?: ?)"
      },
      "instance": {
        "!doc": "The [template instance](#template_inst) corresponding to the current template helper, event handler, callback, or autorun.  If there isn't one, `null`.",
        "!type": "fn() -> +Blaze.TemplateInstance"
      },
      "parentData": {
        "!doc": "Accesses other data contexts that enclose the current data context.",
        "!type": "fn(numLevels?: number)"
      },
      "registerHelper": {
        "!doc": "Defines a [helper function](#template_helpers) which can be used from all templates.",
        "!type": "fn(name: string, function: fn())"
      }
    },
    "Tracker": {
      "Dependency": {
        "!doc": "A Dependency represents an atomic unit of reactive data that a\ncomputation might depend on. Reactive data sources such as Session or\nMinimongo internally create different Dependency objects for different\npieces of data, each of which may be depended on by multiple computations.\nWhen the data changes, the computations are invalidated.",
        "!type": "fn()",
        "prototype": {
          "changed": {
            "!doc": "Invalidate all dependent computations immediately and remove them as dependents.",
            "!type": "fn()"
          },
          "depend": {
            "!doc": "Declares that the current computation (or `fromComputation` if given) depends on `dependency`.  The computation will be invalidated the next time `dependency` changes.\n\nIf there is no current computation and `depend()` is called with no arguments, it does nothing and returns false.\n\nReturns true if the computation is a new dependent of `dependency` rather than an existing one.",
            "!type": "fn(fromComputation?: +Tracker.Computation) -> bool"
          },
          "hasDependents": {
            "!doc": "True if this Dependency has one or more dependent Computations, which would be invalidated if this Dependency were to change.",
            "!type": "fn() -> bool"
          }
        }
      },
      "!doc": "The namespace for Tracker-related methods.",
      "Computation": {
        "!doc": "A Computation object represents code that is repeatedly rerun\nin response to\nreactive data changes. Computations don't have return values; they just\nperform actions, such as rerendering a template on the screen. Computations\nare created using Tracker.autorun. Use stop to prevent further rerunning of a\ncomputation.",
        "!type": "fn()",
        "prototype": {
          "firstRun": {
            "!doc": "True during the initial run of the computation at the time `Tracker.autorun` is called, and false on subsequent reruns and at other times.",
            "!type": "bool"
          },
          "invalidate": {
            "!doc": "Invalidates this computation so that it will be rerun.",
            "!type": "fn()"
          },
          "invalidated": {
            "!doc": "True if this computation has been invalidated (and not yet rerun), or if it has been stopped.",
            "!type": "bool"
          },
          "onInvalidate": {
            "!doc": "Registers `callback` to run when this computation is next invalidated, or runs it immediately if the computation is already invalidated.  The callback is run exactly once and not upon future invalidations unless `onInvalidate` is called again after the computation becomes valid again.",
            "!type": "fn(callback: fn())"
          },
          "stop": {
            "!doc": "Prevents this computation from rerunning.",
            "!type": "fn()"
          },
          "stopped": {
            "!doc": "True if this computation has been stopped."
          }
        }
      },
      "active": {
        "!doc": "True if there is a current computation, meaning that dependencies on reactive data sources will be tracked and potentially cause the current computation to be rerun.",
        "!type": "bool"
      },
      "afterFlush": {
        "!doc": "Schedules a function to be called during the next flush, or later in the current flush if one is in progress, after all invalidated computations have been rerun.  The function will be run once and not on subsequent flushes unless `afterFlush` is called again.",
        "!type": "fn(callback: fn())"
      },
      "autorun": {
        "!doc": "Run a function now and rerun it later whenever its dependencies change. Returns a Computation object that can be used to stop or observe the rerunning.",
        "!type": "fn(runFunc: fn(+Tracker.Computation)) -> +Tracker.Computation"
      },
      "currentComputation": {
        "!doc": "The current computation, or `null` if there isn't one.  The current computation is the [`Tracker.Computation`](#tracker_computation) object created by the innermost active call to `Tracker.autorun`, and it's the computation that gains dependencies when reactive data sources are accessed.",
        "!type": "+Tracker.Computation"
      },
      "flush": {
        "!doc": "Process all reactive updates immediately and ensure that all invalidated computations are rerun.",
        "!type": "fn()"
      },
      "nonreactive": {
        "!doc": "Run a function without tracking dependencies.",
        "!type": "fn(func: fn())"
      },
      "onInvalidate": {
        "!doc": "Registers a new [`onInvalidate`](#computation_oninvalidate) callback on the current computation (which must exist), to be called immediately when the current computation is invalidated or stopped.",
        "!type": "fn(callback: fn())"
      }
    },
    "Accounts": {
      "!doc": "The namespace for all accounts-related methods.",
      "changePassword": {
        "!doc": "Change the current user's password. Must be logged in.",
        "!type": "fn(oldPassword: string, newPassword: string, callback?: fn())"
      },
      "config": {
        "!doc": "Set global accounts options.",
        "!type": "fn(options: ?)"
      },
      "createUser": {
        "!doc": "Create a new user.",
        "!type": "fn(options: ?, callback?: fn())"
      },
      "emailTemplates": {
        "!doc": "Options to customize emails sent from the Accounts system."
      },
      "forgotPassword": {
        "!doc": "Request a forgot password email.",
        "!type": "fn(options: ?, callback?: fn())"
      },
      "onCreateUser": {
        "!doc": "Customize new user creation.",
        "!type": "fn(func: fn())"
      },
      "onEmailVerificationLink": {
        "!doc": "Register a function to call when an email verification link is\nclicked in an email sent by\n[`Accounts.sendVerificationEmail`](#accounts_sendverificationemail).\nThis function should be called in top-level code, not inside\n`Meteor.startup()`.",
        "!type": "fn(callback: fn())"
      },
      "onEnrollmentLink": {
        "!doc": "Register a function to call when an account enrollment link is\nclicked in an email sent by\n[`Accounts.sendEnrollmentEmail`](#accounts_sendenrollmentemail).\nThis function should be called in top-level code, not inside\n`Meteor.startup()`.",
        "!type": "fn(callback: fn())"
      },
      "onLogin": {
        "!doc": "Register a callback to be called after a login attempt succeeds.",
        "!type": "fn(func: fn())"
      },
      "onLoginFailure": {
        "!doc": "Register a callback to be called after a login attempt fails.",
        "!type": "fn(func: fn())"
      },
      "onResetPasswordLink": {
        "!doc": "Register a function to call when a reset password link is clicked\nin an email sent by\n[`Accounts.sendResetPasswordEmail`](#accounts_sendresetpasswordemail).\nThis function should be called in top-level code, not inside\n`Meteor.startup()`.",
        "!type": "fn(callback: fn())"
      },
      "resetPassword": {
        "!doc": "Reset the password for a user using a token received in email. Logs the user in afterwards.",
        "!type": "fn(token: string, newPassword: string, callback?: fn())"
      },
      "sendEnrollmentEmail": {
        "!doc": "Send an email with a link the user can use to set their initial password.",
        "!type": "fn(userId: string, email?: string)"
      },
      "sendResetPasswordEmail": {
        "!doc": "Send an email with a link the user can use to reset their password.",
        "!type": "fn(userId: string, email?: string)"
      },
      "sendVerificationEmail": {
        "!doc": "Send an email with a link the user can use verify their email address.",
        "!type": "fn(userId: string, email?: string)"
      },
      "setPassword": {
        "!doc": "Forcibly change the password for a user.",
        "!type": "fn(userId: string, newPassword: string)"
      },
      "ui": {
        "!doc": "Accounts UI",
        "config": {
          "!doc": "Configure the behavior of [`{{> loginButtons}}`](#accountsui).",
          "!type": "fn(options: ?)"
        }
      },
      "validateLoginAttempt": {
        "!doc": "Validate login attempts.",
        "!type": "fn(func: fn())"
      },
      "validateNewUser": {
        "!doc": "Set restrictions on new user creation.",
        "!type": "fn(func: fn())"
      },
      "verifyEmail": {
        "!doc": "Marks the user's email address as verified. Logs the user in afterwards.",
        "!type": "fn(token: string, callback?: fn())"
      }
    },
    "App": {
      "!doc": "The App configuration object in mobile-config.js",
      "accessRule": {
        "!doc": "Set a new access rule based on origin domain for your app.\nBy default your application has a limited list of servers it can contact.\nUse this method to extend this list.\n\nDefault access rules:\n\n- `tel:*`, `geo:*`, `mailto:*`, `sms:*`, `market:*` are allowed and\n  launch externally (phone app, or an email client on Android)\n- `gap:*`, `cdv:*`, `file:` are allowed (protocols required to access\n  local file-system)\n- `http://meteor.local/*` is allowed (a domain Meteor uses to access\n  app's assets)\n- The domain of the server passed to the build process (or local ip\n  address in the development mode) is used to be able to contact the\n  Meteor app server.\n\nRead more about domain patterns in [Cordova\ndocs](http://cordova.apache.org/docs/en/4.0.0/guide_appdev_whitelist_index.md.html).\n\nStarting with Meteor 1.0.4 access rule for all domains and protocols\n(`<access origin=\"*\"/>`) is no longer set by default due to\n[certain kind of possible\nattacks](http://cordova.apache.org/announcements/2014/08/04/android-351.html).",
        "!type": "fn(domainRule: string, options?: ?)"
      },
      "configurePlugin": {
        "!doc": "Set the build-time configuration for a Phonegap plugin.",
        "!type": "fn(pluginName: string, config: ?)"
      },
      "icons": {
        "!doc": "Set the icons for your mobile app.",
        "!type": "fn(icons: ?)"
      },
      "info": {
        "!doc": "Set your mobile app's core configuration information.",
        "!type": "fn(options: ?)"
      },
      "launchScreens": {
        "!doc": "Set the launch screen images for your mobile app.",
        "!type": "fn(launchScreens: ?)"
      },
      "setPreference": {
        "!doc": "Add a preference for your build as described in the\n[PhoneGap documentation](http://docs.phonegap.com/en/3.5.0/config_ref_index.md.html#The%20config.xml%20File_global_preferences).",
        "!type": "fn(name: string, value: string)"
      }
    },
    "Assets": {
      "!doc": "The namespace for Assets functions, lives in the bundler.",
      "getBinary": {
        "!doc": "Retrieve the contents of the static server asset as an [EJSON Binary](#ejson_new_binary).",
        "!type": "fn(assetPath: string, asyncCallback?: fn())"
      },
      "getText": {
        "!doc": "Retrieve the contents of the static server asset as a UTF8-encoded string.",
        "!type": "fn(assetPath: string, asyncCallback?: fn())"
      }
    },
    "Cordova": {
      "!doc": "The Cordova object in package.js.",
      "depends": {
        "!doc": "Specify which [Cordova / PhoneGap](http://cordova.apache.org/)\nplugins your Meteor package depends on.\n\nPlugins are installed from\n[plugins.cordova.io](http://plugins.cordova.io/), so the plugins and\nversions specified must exist there. Alternatively, the version\ncan be replaced with a GitHub tarball URL as described in the\n[Cordova / PhoneGap](https://github.com/meteor/meteor/wiki/Meteor-Cordova-Phonegap-integration#meteor-packages-with-cordovaphonegap-dependencies)\npage of the Meteor wiki on GitHub.",
        "!type": "fn(dependencies: ?)"
      }
    },
    "DDP": {
      "!doc": "The namespace for DDP-related methods.",
      "connect": {
        "!doc": "Connect to the server of a different Meteor application to subscribe to its document sets and invoke its remote methods.",
        "!type": "fn(url: string)"
      }
    },
    "Email": {
      "send": {
        "!doc": "Send an email. Throws an `Error` on failure to contact mail server\nor if mail server returns an error. All fields should match\n[RFC5322](http://tools.ietf.org/html/rfc5322) specification.",
        "!type": "fn(options: ?)"
      }
    },
    "HTTP": {
      "call": {
        "!doc": "Perform an outbound HTTP request.",
        "!type": "fn(method: string, url: string, options?: ?, asyncCallback?: fn())"
      },
      "del": {
        "!doc": "Send an HTTP `DELETE` request. Equivalent to calling [`HTTP.call`](#http_call) with \"DELETE\" as the first argument. (Named `del` to avoid conflic with the Javascript keyword `delete`)",
        "!type": "fn(url: string, callOptions?: ?, asyncCallback?: fn())"
      },
      "get": {
        "!doc": "Send an HTTP `GET` request. Equivalent to calling [`HTTP.call`](#http_call) with \"GET\" as the first argument.",
        "!type": "fn(url: string, callOptions?: ?, asyncCallback?: fn())"
      },
      "post": {
        "!doc": "Send an HTTP `POST` request. Equivalent to calling [`HTTP.call`](#http_call) with \"POST\" as the first argument.",
        "!type": "fn(url: string, callOptions?: ?, asyncCallback?: fn())"
      },
      "put": {
        "!doc": "Send an HTTP `PUT` request. Equivalent to calling [`HTTP.call`](#http_call) with \"PUT\" as the first argument.",
        "!type": "fn(url: string, callOptions?: ?, asyncCallback?: fn())"
      }
    },
    "MethodInvocation": {
      "!doc": "The state for a single invocation of a method, referenced by this\ninside a method definition.",
      "!type": "fn(options: ?)",
      "prototype": {
        "connection": {
          "!doc": "Access inside a method invocation. The [connection](#meteor_onconnection) that this method was received on. `null` if the method is not associated with a connection, eg. a server initiated method call."
        },
        "isSimulation": {
          "!doc": "Access inside a method invocation.  Boolean value, true if this invocation is a stub.",
          "!type": "bool"
        },
        "setUserId": {
          "!doc": "Set the logged in user.",
          "!type": "fn(userId: string)"
        },
        "unblock": {
          "!doc": "Call inside a method invocation.  Allow subsequent method from this client to begin running in a new fiber.",
          "!type": "fn()"
        },
        "userId": {
          "!doc": "The id of the user that made this method call, or `null` if no user was logged in."
        }
      }
    },
    "Npm": {
      "!doc": "The Npm object in package.js and package source files.",
      "depends": {
        "!doc": "Specify which [NPM](https://www.npmjs.org/) packages\nyour Meteor package depends on.",
        "!type": "fn(dependencies: ?)"
      },
      "require": {
        "!doc": "Require a package that was specified using\n`Npm.depends()`.",
        "!type": "fn(name: string)"
      }
    },
    "Package": {
      "!doc": "The Package object in package.js",
      "describe": {
        "!doc": "Provide basic package information.",
        "!type": "fn(options: ?)"
      },
      "onTest": {
        "!doc": "Define dependencies and expose package methods for unit tests.",
        "!type": "fn(func: fn())"
      },
      "onUse": {
        "!doc": "Define package dependencies and expose package methods.",
        "!type": "fn(func: fn())"
      },
      "registerBuildPlugin": {
        "!doc": "Define a build plugin. A build plugin extends the build\nprocess for apps and packages that use this package. For example,\nthe `coffeescript` package uses a build plugin to compile CoffeeScript\nsource files into JavaScript.",
        "!type": "fn(options?: ?)"
      }
    },
    "Plugin": {
      "!doc": "The namespace that is exposed inside build plugin files.",
      "registerSourceHandler": {
        "!doc": "Inside a build plugin source file specified in\n[Package.registerBuildPlugin](#Package-registerBuildPlugin),\nadd a handler to compile files with a certain file extension.",
        "!type": "fn(fileExtension: string, handler: fn())"
      }
    },
    "Session": {
      "equals": {
        "!doc": "Test if a session variable is equal to a value. If inside a\n[reactive computation](#reactivity), invalidate the computation the next\ntime the variable changes to or from the value.",
        "!type": "fn(key: string, value: string)"
      },
      "get": {
        "!doc": "Get the value of a session variable. If inside a [reactive\ncomputation](#reactivity), invalidate the computation the next time the\nvalue of the variable is changed by [`Session.set`](#session_set). This\nreturns a clone of the session value, so if it's an object or an array,\nmutating the returned value has no effect on the value stored in the\nsession.",
        "!type": "fn(key: string)"
      },
      "set": {
        "!doc": "Set a variable in the session. Notify any listeners that the value\nhas changed (eg: redraw templates, and rerun any\n[`Tracker.autorun`](#tracker_autorun) computations, that called\n[`Session.get`](#session_get) on this `key`.)",
        "!type": "fn(key: string, value: +EJSONable)"
      },
      "setDefault": {
        "!doc": "Set a variable in the session if it hasn't been set before.\nOtherwise works exactly the same as [`Session.set`](#session_set).",
        "!type": "fn(key: string, value: +EJSONable)"
      }
    },
    "check": {
      "!doc": "Check that a value matches a [pattern](#matchpatterns).\nIf the value does not match the pattern, throw a `Match.Error`.\n\nParticularly useful to assert that arguments to a function have the right\ntypes and structure.",
      "!type": "fn(value, pattern: +MatchPattern)"
    },
    "currentUser": {
      "!doc": "Calls [Meteor.user()](#meteor_user). Use `{{#if currentUser}}` to check whether the user is logged in."
    },
    "loggingIn": {
      "!doc": "Calls [Meteor.loggingIn()](#meteor_loggingin)."
    }
  };
});


