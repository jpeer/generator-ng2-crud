'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var exec = require('child_process').exec;
var Context = require('../utils/context').Context;

module.exports = yeoman.Base.extend({

    prompting: function () {
        this.log(yosay(
            'Welcome to the ' + chalk.red('generator-ng2-crud:client') + ' generator!'
        ));

        console.log('config path arg = ', this.configPathArg);

        var storedConfigPath = this.config.get('configpath');

        var prompts = [];
        if (storedConfigPath === undefined) {
            prompts.push({
                type: 'input',
                name: 'configpath',
                message: 'Path to project-config file: ',
                default: 'project-config.json'
            });
        } else {
            this.props = {configpath: storedConfigPath};
            return Promise.resolve();
        }

        return this.prompt(prompts).then(function (props) {
            this.props = props;
            this.config.set('configpath', props.configpath);
            this.config.save();
        }.bind(this));
    },

    writing: function () {

        var configJson = JSON.parse(fs.readFileSync(this.props.configpath));
        var context = new Context(configJson);

        this.fs.copyTpl(
            this.templatePath('static/**/*'),
            this.destinationPath('frontend'),
            {context: context}
        );

        context.firstclassEntities.forEach(function (entity) {
            context.entity = entity;
            this.fs.copyTpl(
                this.templatePath('entity/**/*'),
                this.destinationPath('frontend/src/app/entities/' + entity.name),
                {context: context})
        }.bind(this));

    },

    install: function () {
        if (!process.env.NO_NPM_INSTALL) {
            var curDir = process.cwd();
            var npmdir = curDir + '/frontend';
            console.log("installing frontend");
            exec("cd " + npmdir + "; npm install; npm run build", function (error, stdout, stderr) {
                if (error) {
                    console.log("error:", error);
                    return;
                }
                console.log("frontend is built, stdout = ", stdout, 'stderr = ', stderr);
            });
        }
    }

});


