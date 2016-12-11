/* holds configuration state and helper functions.
   an instance of Context is made available to the EJS templating engine */

'use strict';

var _ = require('lodash');
var configHelper = require('./confighelper');
var configParser = require('./configparser');
var datatypes = require('./datatypes');
var entityGenerator = require('./entityGenerator');
var formCompGen = require('./formCompGen');
var formTemplGen = require('./formTemplGen');
var mongooseGenerator = require('./mongooseGenerator');
var templateUtils = require('./templateUtils');

function Context(configJson) {

    this.title = configJson.title;
    this.entities = configParser.parseEntities(configJson);
    this.serverConfig = configParser.parseServerConfig(configJson);

    this.firstclassEntities = configHelper.firstClassEntities(this.entities, true);
    this.entityMap = {};
    this.datatypes = datatypes;
    this.entityGenerator = entityGenerator;
    this.formCompGen = formCompGen;
    this.formTemplGen = formTemplGen;
    this.mongooseGenerator = mongooseGenerator;
    this.templateUtils = templateUtils;
    this._ = _;

    this.entities.forEach(function(e) {
        this.entityMap[e.name] = e;
    }.bind(this));

    this.entity = undefined; // the current entity
}

Context.prototype.getEntities = function() {
    return this.entities;
}

Context.prototype.getDepsForEntityInternal = function(entity, level, result) {

    result.push({ name : entity.name, level : level  });

    entity.properties.forEach(function(prop) {

        if(prop.typeInfo.type ==='array' && prop.typeInfo.componentType.type === 'object') {
            this.getDepsForEntityInternal(this.entityMap[prop.typeInfo.componentType.refType], level +1, result);

        } else if (prop.typeInfo.type === 'object') {
            this.getDepsForEntityInternal(this.entityMap[prop.typeInfo.refType], level +1, result);
        }

    }.bind(this));


}

/* get array of entity names used directly or indireclty by enttiy. references to top-level entities are not included  */
Context.prototype.getDepsForEntity = function(entity, level) {
    var result = [];
    this.getDepsForEntityInternal(entity, 0, result);
    result.sort(function(a, b) { return b.level - a.level });

    var names = result.map(function(tuple) { return tuple.name});
    names = names.filter(function(item, pos) {
        return names.indexOf(item) == pos;
    })
    return names;
}


Context.prototype.determineForeignServicesInternal = function(entity, set) {

    entity.properties.forEach(function(prop) {
        // this is what we are watching out for: references
        if(prop.typeInfo.type === 'reference') {
            set.add(prop.typeInfo.refType);
        }
        // maybe a reference is hidden in complex object in array?
        else if(prop.typeInfo.type === 'array' && prop.typeInfo.componentType.type === 'object') {
            this.determineForeignServicesInternal(this.entityMap[prop.typeInfo.componentType.refType], set);
        }

        else if(prop.typeInfo.type === 'array' && prop.typeInfo.componentType.type === 'reference') {
            set.add(prop.typeInfo.componentType.refType);
        }

        // or maybe a reference is hidden in a sub-document?
        else if(prop.typeInfo.type === 'object') {
            this.determineForeignServicesInternal(this.entityMap[prop.typeInfo.refType], set);
        }
    }.bind(this));

}


Context.prototype.determineForeignServices = function(entity) {
    var set = new Set();
    this.determineForeignServicesInternal(entity, set);
    return Array.from(set);
}

module.exports = { Context : Context };