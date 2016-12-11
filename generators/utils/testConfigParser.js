var fs = require('fs');
var configParser = require('./configparser');

var configJson = JSON.parse(fs.readFileSync('../project-config.json'));
var parsedEntities = configParser.parseEntities(configJson);

console.log('result', JSON.stringify(parsedEntities, null, 2));
