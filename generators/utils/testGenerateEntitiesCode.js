var fs = require('fs');
var configParser = require('./configparser');
var Context = require('./context').Context;
var entityGenerator = require('./entityGenerator');

var configJson = JSON.parse(fs.readFileSync('../project-config.json'));
var context = new Context(configJson);

console.log('result', JSON.stringify(parsedEntities, null, 2));

context.firstclassEntities.forEach(function (entity) {

    var result = entityGenerator.generateEntitiesCode(entity, context, '');
    console.log('generated typescript for ' + entity.name + ':\n-------------------------\n', result, '\n\n');

});

