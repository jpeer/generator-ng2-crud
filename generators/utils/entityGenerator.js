/* helpers for transforming entity-information from project config into typescript code for the ng2 frontend */

'use strict';

var generateEntitiesCode = function(root, context) {

    var result = "";

    context.getDepsForEntity(root).forEach(function(e) {
        var ent = context.entityMap[e];
        result += generateEntityCode(ent, context);
        result += "\n\n";
    });

    return result;
}

var generateEntityCode = function(entity, context) {

    var result = "export class " + entity.name + "{";
    result += "  constructor() { \n";
    entity.properties.forEach(function(prop) {
        if(prop.typeInfo.type === 'object') {
            result += "this." + prop.name + " = new " + context.datatypes.translateToTypeScript(prop.typeInfo) + "();\n"
        }
    });
    result += "  }\n";

    if(entity.firstclass) {
        result += "  _id : string;\n"
    }
    entity.properties.forEach(function(prop) {
      result += ("  " + prop.name + " : " + context.datatypes.translateToTypeScript(prop.typeInfo) + ";\n");
     });
    result += "}";
    return result;
}

module.exports = { generateEntitiesCode: generateEntitiesCode}