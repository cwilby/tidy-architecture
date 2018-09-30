"use strict";

var fs = require('fs');
var mustache = require('mustache');
var mkdirp = require('mkdirp');
var config = require('./config');
var _ = require('lodash');
var pluralize = require('pluralize');

worker();

function worker() {
    buildModels();
    buildRepositories();
}

function buildModels() {
    config.models.forEach(buildModel);
}

function buildRepositories() {
    config.models.forEach(buildRepository);
}

function buildModel(model) {
    fs.readFile('./templates/Model.mustache', { encoding: 'utf-8' }, (err, template) => {
        if(err) return console.error(err);

        const output = mustache.render(template, model);
        
        const filePath = `${root}/Models/${model.area}/${model.module}`;
        const fileName = `${filePath}/${model.name}.php`;

        if(!fs.existsSync(fileName)) {
            mkdirp(filePath, (err) => {
                if(err) {
                    return console.error(err);
                }

                fs.writeFile(fileName, output, (err) => {
                    if(err) {
                        return console.log(err);
                    }

                    console.log(`Add ${fileName}`);
                });
            });    
        } else {
            console.log(`Skip ${fileName}`);
        }
    });
}

function buildRepository(model) {
    fs.readFile('./templates/Repository.mustache', { encoding: 'utf-8' }, (err, template) => {
        if(err) return console.error(err);

        const output = mustache.render(template, model);

        const filePath = `${root}/Repositories/${model.area}/${model.module}`;
        const fileName = `${filePath}/${model.name}Repository.php`;
        
        if(!fs.existsSync(fileName)) {
            mkdirp(filePath, (err) => {
                if(err) {
                    return console.error(err);
                }


                fs.writeFile(fileName, output, (err) => {
                    if(err) {
                        return console.log(err);
                    }

                    console.log(`Add ${fileName}`);
                });
            });    
        } else {
            console.log(`Skip ${fileName}`);
        }
    });
}

function createBuilder(type, template) {
    return function buildFile(model) {
        fs.readFile(template, { encoding: 'utf-8' }, (err, template) => {
            if(err) return console.error(err);
    
            const output = mustache.render(template, model);
    
            const filePath = `${root}/Repositories/${model.area}/${model.module}`;
            const fileName = `${filePath}/${model.name}Repository.php`;
            
            if(!fs.existsSync(fileName)) {
                mkdirp(filePath, (err) => {
                    if(err) {
                        return console.error(err);
                    }
    
    
                    fs.writeFile(fileName, output, (err) => {
                        if(err) {
                            return console.log(err);
                        }
    
                        console.log(`Add ${fileName}`);
                    });
                });    
            } else {
                console.log(`Skip ${fileName}`);
            }
        });
    }
}
