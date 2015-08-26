'use strict';

/* Filters */

angular.module('myApp.filters', [])
        .filter('interpolate', ['version', function (version) {
                return function (text) {
                    return String(text).replace(/\%VERSION\%/mg, version);
                };
            }])
        .filter('getByProperty', function () {
            return function (propertyName, propertyValue, collection) {
                var i = 0, len = collection.length;
                for (; i < len; i++) {
                    if (collection[i][propertyName] == propertyValue) {
                        return collection[i];
                    }
                }
                return null;
            };
        }).filter('getAllByProperty', function () {
    return function (propertyName, propertyValue, collection) {
        var i = 0, len = collection.length, output = [];
        if (propertyValue == null || propertyValue == undefined) {
            return collection;
        }
        for (; i < len; i++) {
            if (collection[i][propertyName] == propertyValue) {
                output.push(collection[i]);
            }
        }
        return output;
    };
}).filter('getAllObjectsByProperty', function () {
    return function (propertyName, propertyValue, collection) {
        var i = 0, output = [];
        if (propertyValue == null || propertyValue == undefined) {
            return collection;
        }
        angular.forEach(collection, function (value, key) {
            if (value[propertyName]==propertyValue){
                output.push(value);
            }
        });
        return output;
    };
});
