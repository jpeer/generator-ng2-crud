var fs = require('fs');
var configParser = require('./configparser');
var Context = require('./context').Context;
var formCompGen = require('./formCompGen');

var configJson = JSON.parse(fs.readFileSync('../project-config.json'));
var context = new Context(configJson);

context.firstclassEntities.forEach(function (entity) {

    var result = formCompGen.generateFormGroup(entity, context, '');
    console.log('generateFormGroup for ' + entity.name + ':\n-------------------------\n', result, '\n\n');

    result = formCompGen.generateArrayMethods(entity, context, '');
    console.log('generateArrayMethods for ' + entity.name + ':\n-------------------------\n', result, '\n\n');

});

