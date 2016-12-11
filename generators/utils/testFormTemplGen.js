var fs = require('fs');
var configParser = require('./configparser');
var Context = require('./context').Context;
var templateGenerator = require('./formTemplGen');

var configJson = JSON.parse(fs.readFileSync('../project-config.json'));
var context = new Context(configJson);

console.log('result', JSON.stringify(parsedEntities, null, 2));

context.firstclassEntities.forEach(function (entity) {

    var result = templateGenerator.generateTemplate(entity, context);
    console.log('generated template for: ' + entity.name + ':\n-------------------------\n', result, '\n\n');

});

