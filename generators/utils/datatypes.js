/* helpers for translating types from config model to typescript and mongoose */

'use strict';

var translateToMongoose = function(typeInfo) {

    var mapping = {
        "string" : "mongoose.Schema.Types.String",
        "text" : "mongoose.Schema.Types.String",
        "number" : "mongoose.Schema.Types.Number",
        "boolean" : "mongoose.Schema.Types.Boolean",
        "date" : "mongoose.Schema.Types.Date"
    };

    var simple = mapping[typeInfo.type];
    if(simple !== undefined) {
        return simple;
    }

    if( typeInfo.type === "reference") {
        return "{ type: mongoose.Schema.Types.ObjectId, ref: '"+typeInfo.refType+"'}";
    }

    if (typeInfo.type === "object") {
        return typeInfo.refType + "Schema";
    }

    if (typeInfo.type === "array") {
        var compType = translateToMongoose(typeInfo.componentType);
        return "[" + compType + "]";
    }

    return typeInfo + "Schema";
}


var translateToTypeScript = function (typeInfo) {
    var mapping = {
        "string" : "string",
        "text" : "string",
        "number" : "number",
        "boolean" : "boolean",
        "date" : "Date",
        "reference" : "string"
    };

    var simple = mapping[typeInfo.type];
    if(simple !== undefined) {
        return simple;
    }

    if (typeInfo.type === "object") {
        return typeInfo.refType;
    }

    if (typeInfo.type === "array") {
        /* TODO: check that the entity really exists */
        // var mapped = mapping[prop.typeInfo.componentType.type];
        // var compType = mapped === undefined ? prop.typeInfo.componentType.type : mapped;
        // return  compType +  "[]";
        var compType = translateToTypeScript(typeInfo.componentType);
        return compType + "[]";
    }

    throw "unknown type: " + typeInfo;
}

var isPrimitive = function(str) {
    var supported = ["string", "text", "number", "boolean", "date"];
    var idx = supported.indexOf(str);
    return idx !== -1;
}

var isReference = function(str) {
    return str === 'reference';
}

/* text are strings that are long enough to warrant textarea instead of plain input field */
var isText = function(str) {
    return str === 'text';
}

var isSingleValued = function(str) {
    return isPrimitive(str) || isReference(str);
}

var isCustomType = function(str) {
    return str === 'object';
}

module.exports = { translateToMongoose : translateToMongoose,
    translateToTypeScript : translateToTypeScript,
    isCustomType : isCustomType,
    isPrimitive : isPrimitive,
    isReference : isReference,
    isSingleValued : isSingleValued};