"use strict";

var fs = require('fs');
var mustache = require('mustache');
var mkdirp = require('mkdirp');
var config = require('./config');
var _ = require('lodash');
var pluralize = require('pluralize');

worker();

function worker() {
    buildDomainClasses();
    buildRepositoryInterfaces();
    buildRepositoryImplementations();
    buildControllers();
}

function buildDomainClasses() {
    config.entities.forEach(function(entity) {
        buildFile({
            template: './templates/Domain.mustache',
            entity: entity,
            filePath: '{{solution}}\\{{rootNamespace}}.Core\\Domain\\{{entityFolder}}',
            fileName: '{{entityName}}.cs'
        });
    });
}

function buildRepositoryInterfaces() {
    config.entities.forEach(function(entity) {
        buildFile({
            template: './templates/IEntityRepository.mustache',
            entity: entity,
            filePath: '{{solution}}\\{{rootNamespace}}.Core\\Repository\\{{entityFolder}}',
            fileName: 'I{{entityName}}Repository.cs'
        });
    });
}

function buildRepositoryImplementations() {
    config.entities.forEach(function(entity) {
        buildFile({
            template: './templates/EntityRepository.mustache',
            entity: entity,
            filePath: '{{solution}}\\{{rootNamespace}}.Data\\Repository\\{{entityFolder}}',
            fileName: '{{entityName}}Repository.cs'
        });
    });
}

function buildControllers() {
    config.entities.forEach(function(entity) {
        buildFile({
            template: './templates/Controller.mustache',
            entity: entity,
            filePath: '{{solution}}\\{{rootNamespace}}.Api\\Controllers\\{{entityFolder}}',
            fileName: '{{entityNamePluralized}}Controller.cs'
        });
    });
}

function buildFile({ template='', entity={}, filePath='', fileName='' } = {}) {
    let entitySplit = _.split(entity, '.');
    let entityName = _.last(entitySplit);
    let namespaceSplit = _.take(entitySplit, entitySplit.length - 1);

    let view = {
        solution: config.solution,
        rootNamespace: config.rootNamespace,
        entityFolder: _.join(namespaceSplit, '\\'),
        entityNamespace: _.join(namespaceSplit, '.'),
        entityName: entityName,
        entityNameLower: _.camelCase(entityName),
        entityNamePluralized: pluralize(entityName, 2),
        entityNameLowerPluralized: pluralize(_.camelCase(entityName), 2),
        entityClass: entityName
    };

    if (entitySplit.length > 1 && view.entityName === entitySplit.slice(-2)[0]) {
        view.entityClass = `Core.Domain.${view.entityNamespace}.${view.entityName}`;
    }

    fs.readFile(template, { encoding: 'utf-8' }, function(err, template) {
        if (err) {
            return console.log(err);
        }

        let output = mustache.render(template, view);

        filePath = mustache.render(filePath, view);
        fileName = mustache.render(fileName, view);

        if (!fs.existsSync(`${filePath}\\${fileName}`)) {
            mkdirp(filePath, function(err) {
                if (err) {
                    return console.log(err);
                }

                fs.writeFile(`${filePath}\\${fileName}`, output, function(err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log('Wrote ' + fileName);
                });
            });
        } else {
            console.log('Skipping ' + filePath)
        }
    });
}
