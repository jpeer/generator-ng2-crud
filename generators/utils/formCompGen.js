/* helpers for creating typescript code for 'form' components of the ng2 frontend */

'use strict';

var generateValidatorArray = function(prop) {
    return prop.validators.map(function(validator) { return 'Validators.' + validator});
}

var generateFormGroup = function(entity, context, path) {

    var result = "this.fb.group(\n{\n";
    if(entity.firstclass) {
        result += "_id : value._id,\n"
    }

    entity.properties.forEach(function(prop) {

        result += (prop.name + " : ");
        var fullPropName = path !== '' ? path + '.' + prop.name :  prop.name;
        var valPath = "value." + fullPropName;

        if(context.datatypes.isSingleValued(prop.typeInfo.type)) {
            result += ("[ "+valPath+" , ["+ generateValidatorArray(prop) + "]],\n");
        } else if(prop.typeInfo.type === 'array') {
            var uniqueName = fullPropName.replace('.', '_');
            result += "this.create_arr_" + uniqueName + "("+valPath+"),\n";
        } else if(prop.typeInfo.type === 'object') {
            result += generateFormGroup(context.entityMap[prop.typeInfo.refType], context, fullPropName);
        } else {
            throw "error during generateFormGroup()";
        }

    });

    result += "}\n)";
    return result;
}


var generateArrayMethods = function(entity, context, path) {

    var result = "";

    entity.properties.forEach(function(prop) {

        var fullPropName = path !== '' ? path + '.' + prop.name :  prop.name;
        var valPath = "value." + fullPropName;

        if(context.datatypes.isSingleValued(prop.typeInfo.type)) {

        } else if (prop.typeInfo.type === 'array') {
            var uniqueName = fullPropName.replace('.', '_');
            var createMethod = "create_arr_" + uniqueName;
            var addArrElemMethod = "add_arr_elem_" + uniqueName;

            var compType = undefined;
            if(prop.typeInfo.componentType.type === 'object') {
                compType = prop.typeInfo.componentType.refType;
            } else if(prop.typeInfo.componentType.type === 'reference') {
                compType = 'string';
            } else {
                compType = context.datatypes.translateToTypeScript(prop.typeInfo.componentType);
            }

            result += createMethod + "(values : "+compType+"[]) {\n";
            result += "   var result = this.fb.array([]);\n";
            result += "   if(values !== undefined && values.length > 0) {\n";
            result += "     values.forEach(function(elem) {\n";
            result += "         this." + addArrElemMethod + "(result, elem);\n";
            result += "     }.bind(this))\n";
            result += "   }\n";
            result += "   return result;\n";
            result += "}\n";

            result += addArrElemMethod + "(parent : any, value : "+compType+") {\n";
            if(!context.datatypes.isPrimitive(compType)) {
                result += "  if(value === undefined) { value = new " + compType + "(); }\n";
            }
            result += "console.log('greating formgroup for value: ', value);\n"
            var spec = prop.typeInfo.componentType.type === 'object' ? generateFormGroup(context.entityMap[prop.typeInfo.componentType.refType], context, '') : "new FormControl(value)";
            result += "  var ctrl = " + spec +  "\n";
            result += "  parent.push(ctrl);\n";
            result += "}\n";


        } else if(prop.typeInfo.type === 'object') {
            result += generateArrayMethods(context.entityMap[prop.typeInfo.refType], context, fullPropName);
        } else {
            throw "error in generateArrayMethods()";
        }

    });

    return result;
}


module.exports = { generateFormGroup : generateFormGroup, generateArrayMethods : generateArrayMethods };
