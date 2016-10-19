"use strict";

const fs = require('fs');
const mustache = require('mustache');
const mkdirp = require('mkdirp');
const config = require('./config');

worker();

function worker() {
    buildRepositoryInterfaces();
    buildRepositoryImplementations();
}

function buildRepositoryInterfaces() {
    buildRepositories('./templates/IEntityRepository.mustache', 'Core', true);
}

function buildRepositoryImplementations() {
    buildRepositories('./templates/EntityRepository.mustache', 'Data', false);
}

function buildRepositories(templateFile, project, isInterface) {
	config.entities.forEach(function(repository) {
        let split = repository.split('/');
        let entity = split[split.length - 1];
        let namespaceSplit = split.slice(0, split.length - 1);

        let view = {
            rootNamespace: config.rootNamespace,
            entityNamespace: namespaceSplit.join('.'),
            entity: entity,
            entityClass: entity
        };

        if(split.length > 1 && view.entity === split[split.length - 2]) {
        	view.entityClass = `Core.Domain.${view.entityNamespace}.${view.entity}`;
        }

        fs.readFile(templateFile, { encoding: 'utf-8' }, function(err, template) {
            if (err) {
                return console.log(err);
            }

            let output = mustache.render(template, view);
            let filePath = `${config.solution}\\${config.rootNamespace}.${project}\\Repository\\${namespaceSplit.join('\\')}`;
            let fileName = `${filePath}\\${isInterface ? 'I' : ''}${view.entity}Repository.cs`;

            mkdirp(filePath, function(err) {
                if (err) {
                    return console.log(err);
                }

                fs.writeFile(fileName, output, function(err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log('Wrote ' + fileName);
                });
            });
        });
    });
}