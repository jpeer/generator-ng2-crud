var fs = require('fs');
var configParser = require('./configparser');
var Context = require('./context').Context;

var configJson = JSON.parse(fs.readFileSync('../project-config.json'));
var context = new Context(configJson);

context.firstclassEntities.forEach(function (entity) {
    var res = context.determineForeignServices(entity);
    console.log('required services for ', entity.name, ': ', res);
});

