var fs = require('fs');
var _ = require('underscore');

var jsdoc = eval(fs.readFileSync(process.argv[2], 'utf8'));
var O = {
  "!name": "meteor",
  Match: {
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
  MeteorSubscribeHandle: {
    'stop': 'fn()',
    'ready': 'fn() -> bool'
  }
};
var specialFunctionReturns = {
  'Meteor.subscribe': 'MeteorSubscribeHandle',
  'Tracker.autorun': '+Tracker.Computation',
  'Blaze.TemplateInstance#autorun': '+Tracker.Computation'
};

var commonSkips = ['longname', 'kind', 'name', 'scope', 'memberof', 'options', 'instancename'];

var nameToId = eval(fs.readFileSync('/Users/slava/work/meteor/docs/client/full-api/nameToId.js', 'utf8'));
var getDocsUrl = function (name) {
  function h () {
    var special = {
      Meteor: 'core',
      Match: 'check',
      Mongo: 'mongo_collections',
      Session: 'session',
      Accounts: 'accounts_api',
      Template: 'templates_api',
      Blaze: 'blaze',
      Tracker: 'tracker',
      EJSON: 'ejson',
      ReactiveVar: 'reactivevar',
      HTTP: 'http',
      Email: 'email',
      Assets: 'assets',
      Package: 'packagejs',
      App: 'mobileconfigjs'
    };
    return special[name] || nameToId[name] || name.replace(/[.#]/g, "-");
  }

  return 'https://docs.meteor.com/#/full/' + h();
};

var set = function (def, o) {
  var path = def.longname;
  path = path.replace('#', '.prototype.');
  path = path.split('.')
  var t = O;
  _.each(path.slice(0, path.length - 1), function (prop) {
    if (! t[prop])
      t[prop] = {};
    t = t[prop];
  });
  var lastProp = path[path.length - 1];
  t[lastProp] = _.extend({}, t[lastProp], o, {
    '!url': getDocsUrl(def.longname)
  });
};

var attach = {};
attach.namespace = function (namespace) {
  var o = {};
  // try to discover declarations first
  _.each(namespace, function (def, symbol) {
    if (def.kind === 'typedef' || def.kind === 'class')
      attach[def.kind](def);
  });
  _.each(namespace, function (def, symbol) {
    if (dealWithMisc(def, symbol, o)) return;
    if (def.kind === 'typedef' || def.kind === 'class') return;
    attach[def.kind](def);
  });
  if (namespace !== jsdoc)
    set(namespace, o);
};

var typedefs = {};
attach.typedef = function (td) {
  typedefs[td.name] = td;
};

attach.member = function (member) {
  var o = {};
  _.each(member, function (def, symbol) {
    if (symbol === 'type') {
      o['!type'] = processParamType(def.names[0]); // XXX hardcoding first acceptable type
      if (! o['!type'])
        delete o['!type'];
      return;
    }
    if (dealWithMisc(def, symbol, o)) return;
  });
  set(member, o);
};

var classes = {};
attach['class'] = attach['function'] = function (fun) {
  // set all classes to a table
  if (fun.kind === 'class')
    classes[fun.name] = fun;

  var o = {};
  var params = [];
  var returns = null;
  _.each(fun, function (def, symbol) {
    if (symbol === 'params') {
      params = _.map(def, function (param) {
        var name = processParamName(param);
        var type = null;
        if (! name.match(/\.\.\.\?$/) && name !== 'thisArg?')
          type = processParamType(param.type.names[0]); // XXX hardcoding first acceptable type
        else
          name = name.substr(0, name.length - 1);
        return  name + (type ? ': ' + type : '');
      });
      return;
    }
    if (symbol === 'returns') {
      returns = processParamType(def[0].type.names[0]);
      return;
    }
    if (dealWithMisc(def, symbol, o)) return;
  });
  // XXX no return type
  o['!type'] = 'fn(' + params.join(', ') + ')';
  if (_.has(specialFunctionReturns, fun.longname))
    o['!type'] += ' -> ' + specialFunctionReturns[fun.longname];
  else if (returns)
    o['!type'] += ' -> ' + returns;
  set(fun, o);
};

function processParamName (param) {
  var r = '';
  if (! param.name)
    throw new Error('param w/o a name');
  r = param.name;
  if (param.optional)
    r += '?';
  return r;
};

function embedTypeDef (td) {
  if (td.type.names[0] !== 'function')
    throw new Error('This script doesnt know how to embed non-callback typedefs yet');
  // XXX doesn't put the return value
  return 'fn(' + _.map(td.params, function (p) {
    return processParamType(p.type.names[0])
  }).join(', ') + ')';
}

function processParamType (type) {
  if (! type || type === 'Any')
    return null;
  var rgx = /^Array\.<(.*)>$/;
  var m = type.match(rgx);
  var isArray = false;
  if (m) {
    type = m[1];
    isArray = true;
  }

  if (_.contains(['String', 'Number'], type))
    type = type.toLowerCase();
  else if (type === 'Boolean')
    type = 'bool';
  else if (type === 'Object')
    type = '?';
  else if (type === 'function')
    type = 'fn()';
  // XXX do something with this?
  else if (_.contains(['Error', 'Buffer', 'Tracker.Computation', 'EJSON', 'EJSONable', 'JSONCompatible', 'MongoSelector', 'MongoModifier', 'Template', 'DOMNode', 'DOMElement', 'Blaze.View', 'EventMap', 'MatchPattern', 'Mongo.Collection', 'Mongo.Cursor', 'SubscriptionHandle', 'Blaze.TemplateInstance'], type))
    type = "+" + type;
  else if (type === 'Integer')
    type = 'number';
  else if (classes[type])
    type = "+" + type;
  else if (typedefs[type])
    type = embedTypeDef(typedefs[type]);
  else
    throw new Error('Unknown type: ' + type);

  if (isArray)
    type = '[' + type + ']';
  return type;
}

function dealWithMisc (def, symbol, o) {
  if (symbol === 'summary') {
    o['!doc'] = def;
    return true;
  }
  if (symbol === 'locus') {
    o['!doc'] = def + '\n' + (o['!doc'] || '');
    return true;
  }

  if (_.contains(commonSkips, symbol))
    return true;
  if (! def.kind) {
    def.kind = 'namespace';
    def.longname = symbol;
  }
}

attach.namespace(jsdoc);
console.log(JSON.stringify(O, null, 2))

