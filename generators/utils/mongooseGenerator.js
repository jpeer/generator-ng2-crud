/* helpers for creating mongoose datamodel code for the REST backend */

'use strict';

function generateForEntity(entity, context) {
    var requiredEntities = context.getDepsForEntity(entity);
    var result = '';

    requiredEntities.forEach(function (e) {
        var ent = context.entityMap[e];
        result += 'var '+ ent.name + 'Schema = new Schema({\n';
        if (ent.firstclass) {
            result += '  _id: {type: ObjectIdSchema, default: new ObjectId(), auto: true},\n';
            result += '  __v: {type: Number, select: false},\n'
        }

        ent.properties.forEach(function (prop) {
            result += '  ' + prop.name + ': ' + context.datatypes.translateToMongoose(prop.typeInfo) + ',\n';
        });

        result += '}\n';


        if (!ent.firstclass) {
            result += ',{ _id : false }\n';
        }

        result += ');\n';

        if (ent.firstclass) {
            result += "var " + ent.name + "Model = mongoose.model('" + ent.name + "', " + ent.name + "Schema);\n";
        }
    });

    return result;
}

function generateMongooseModel(context) {

    var result = '';
    context.firstclassEntities.forEach(function(entity) {
        result += generateForEntity(entity, context)
        result += '\n';
    });
    return result;
}

module.exports = { generateMongooseModel : generateMongooseModel };