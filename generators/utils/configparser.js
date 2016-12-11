/* code for parsing the configuration json and building a model of the configuration */

'use strict';

var parseReference = function(s) {

    var str = s.substring(4);

    var nextColon = str.indexOf(':');
    var refType = str.substring(0, nextColon);
    var label = str.substring(nextColon + 1);

    return {
        type : 'reference',
        refType : refType,
        label : label
    };
}

var parseSingleType = function(s) {
    var typeInfo = {};
    if(s === 'string') {
      typeInfo.type = 'string';
    } else if (s === 'text') {
      typeInfo.type = 'text';
    } else if (s === 'number') {
      typeInfo.type = 'number';
    } else if (s === 'boolean') {
      typeInfo.type = 'boolean';
    } else if (s === 'date') {
      typeInfo.type = 'date';
    } else if (s.indexOf('ref:') === 0) {
      typeInfo = parseReference(s);
    }
    return typeInfo;
}

var amendWithValidationInfo = function(rawPropDef, result, required) {
    if(rawPropDef.hasOwnProperty('validators')) {
        result['validators'] = rawPropDef['validators'];
    } else {
        // set defaults
        result['validators'] = (required) ? ['required'] : [];
    }
}

var isAlphaNumeric = function(s) {
    var reg = /[^A-Za-z0-9]/;
    return !reg.test(s);
}

var checkPropertyName = function(s) {
    if(!isAlphaNumeric(s)) {
        throw "only alphanumeric property names are supported, but found:" +  s;
    }
}

var checkEntityName = function(s) {
    if(!isAlphaNumeric(s)) {
        throw "only alphanumeric entity names are supported, but found:" +  s;
    }
}

var parseProperty = function(rawPropName, rawPropDef, entityPath, parsedEntities) {
    var qm = rawPropName.indexOf('?');

    var propName = (qm != -1) ? rawPropName.substring(0, qm) : rawPropName;

    checkPropertyName(propName);

    var required = (qm == -1);
    var typeInfo = {};
    var result = { name : propName, required : required };
    var rawPropTypeDef = (rawPropDef.hasOwnProperty('type')) ? rawPropDef['type'] : rawPropDef;

    if (rawPropTypeDef.constructor !== Array) {

        if(typeof rawPropTypeDef === 'object' ) {
            var customTypeName = entityPath + '_' + propName;
            var entity = parseEntity(customTypeName, rawPropTypeDef, false, parsedEntities);
            parsedEntities.push(entity);
            typeInfo = { type: 'object', refType: customTypeName};

        } else {
            typeInfo = parseSingleType(rawPropTypeDef);
            amendWithValidationInfo(rawPropDef, result, required);
        }

    } else {

        typeInfo.type = 'array';
        var compType = rawPropTypeDef[0];
        if(typeof compType === 'object') {
          var customTypeName = entityPath + '_' + propName;
          entity = parseEntity(customTypeName, compType, false, parsedEntities);
          parsedEntities.push(entity);
          typeInfo['componentType'] = { type: 'object', refType: customTypeName};
        } else {
          typeInfo['componentType'] = parseSingleType(compType);
        }

    }

    result['typeInfo'] = typeInfo;

    return result;
}

var parseEntity = function(name, rawProps, firstclass, parsedEntities) {
    var props = [];
    for (var prop in rawProps) {
      var propDef = rawProps[prop];
      props.push(parseProperty(prop, propDef, name, parsedEntities));
    }
    return { "name" : name, "firstclass" : firstclass, "properties" : props };
}

var applyPaginationSettings = function(regex, paginationSettings, entities) {

    entities.forEach(function(entity) {
        var patt = new RegExp(regex, "g");
        var matches = patt.test(entity.name);
        if(matches) {
            entity['pagination'] = paginationSettings;
        }
    });
}

var amendWithPaginationInfo = function(json, entities) {

    if(json.hasOwnProperty('pagination')) {
        var paginationJson = json['pagination'];

        for(var key in paginationJson) {
            var value = paginationJson[key];
            applyPaginationSettings(key, value, entities);
        }
    }
}

var applyValidators = function(regex, defaultValidators, entities) {

    var patt = new RegExp(regex, "g");

    entities.forEach(function(entity) {
        entity.properties.forEach(function (prop) {
            var s = entity.name + '.' + prop.name;
            s = s.replace('_', '.');

            var matches = patt.test(s);
            if(matches) {
                entity['validators'] = defaultValidators;
            }
        });
    });
}

var amendWithDefaultValidators = function(json, entities) {

    if(json.hasOwnProperty('validators')) {
        var validationJson = json['validators'];

        for(var key in validationJson) {
            var value = validationJson[key];
            applyValidators(key, value, entities);
        }
    }

}

var parseEntitiesInternal = function(entitiesJson) {
    var parsedEntities = [];

    for (var key in entitiesJson) {
        checkEntityName(key);
        var processedEntity = parseEntity(key, entitiesJson[key], true, parsedEntities);
        parsedEntities.push(processedEntity);
    }

    return parsedEntities;
}

/* parses the config file and assembles the model (of the model) */
var parseEntities = function(json) {

    var entities = parseEntitiesInternal(json.entities);

    amendWithPaginationInfo(json, entities);
    amendWithDefaultValidators(json, entities);

    return entities;
}

var parseServerConfig = function(json) {

    if(json.hasOwnProperty('serverConfig')) {
        return json.serverConfig;
    } else {
        return {
            expressPort: 3000,
            mongoDbUrl: "mongodb://localhost/demo"

        };
    }
}


module.exports = { parseEntities : parseEntities, parseSingleType : parseSingleType, parseServerConfig: parseServerConfig};