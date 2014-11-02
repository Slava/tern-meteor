var fs = require('fs');
var _ = require('underscore');

var jsdoc = eval(fs.readFileSync(process.argv[2], 'utf8'));
var O = {
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
  'Tracker.autorun': 'Tracker.Computation',
  'Blaze.TemplateInstance.prototype.autorun': 'Tracker.Computation'
};

var commonSkips = ['longname', 'kind', 'name', 'scope', 'memberof', 'options', 'instancename'];

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
  t[lastProp] = _.extend({}, t[lastProp], o);
};

var attach = {};
attach.namespace = function (namespace) {
  var o = {};
  _.each(namespace, function (def, symbol) {
    if (dealWithMisc(def, symbol, o)) return;
    attach[def.kind](def);
  });
  if (namespace !== jsdoc)
    set(namespace, o);
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
attach['class'] = attach['function'] = function (fun) {
  var o = {};
  var params = [];
  var returns = null;
  _.each(fun, function (def, symbol) {
    if (symbol === 'params') {
      params = _.map(def, function (param) {
        var type = 
          processParamType(param.type.names[0]); // XXX hardcoding first acceptable type
        return processParamName(param) + (type ? ': ' + type : '');
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
  if (param.optional && !param.name.match(/\.\.\.$/))
    r += '?';
  return r;
};

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

  if (_.contains(['String', 'Number', 'Boolean'], type))
    type = type.toLowerCase();
  else if (type === 'Object')
    type = 'Object';
  else if (type === 'function')
    type = 'fn()';
  // XXX do something with this?
  else if (_.contains(['Error', 'Buffer', 'Tracker.Computation', 'EJSON', 'EJSONable', 'JSONCompatible', 'MongoSelector', 'MongoModifier', 'Template', 'DOMNode', 'DOMElement', 'Blaze.View', 'EventMap', 'MatchPattern', 'Mongo.Collection', 'Mongo.Cursor'], type))
    type = type;
  else if (type === 'Integer')
    type = 'number';
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
console.log(JSON.stringify({
  "!name": "meteor",
  "!define": O
}, null, 2))

