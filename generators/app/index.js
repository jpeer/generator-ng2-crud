'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({

  'initializing' : function () {
    this.composeWith('ng2-crud:server');
    this.composeWith('ng2-crud:client');
  }

});
