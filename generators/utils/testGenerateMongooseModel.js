var fs = require('fs');
var configParser = require('./configparser');
var Context = require('./context').Context;
var entityGenerator = require('./entityGenerator');

var configJson = JSON.parse(fs.readFileSync('../project-config.json'));
var context = new Context(configJson);

console.log(context.mongooseGenerator.generateMongooseModel(context));