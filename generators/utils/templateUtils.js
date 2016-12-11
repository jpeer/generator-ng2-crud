/* helpers used from templates for the ng2 frontend */

'use strict';

var generateReferenceLabel = function(typeInfo, objName, context) {

    var labelTemplate = '' + typeInfo.label;
    var refEntity = context.entityMap[typeInfo.refType];
    refEntity.properties.forEach(function (refProp) {
        labelTemplate = labelTemplate.replace(refProp.name, '{{'+objName+'.' + refProp.name + '}}');
    });
    return labelTemplate;

}

module.exports = { generateReferenceLabel : generateReferenceLabel }