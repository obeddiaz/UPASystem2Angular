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
            if (value[propertyName] == propertyValue) {
                output.push(value);
            }
        });
        return output;
    };
}).filter('getAllObjectsBySubProperty', function () {
    return function (subProperty, propertyName, propertyValue, collection) {
//        console.log(subProperty);
//        console.log(propertyName);
//        console.log(propertyValue);
//        console.log(collection);
        if (propertyValue == null || propertyValue == undefined) {
            return collection;
        }
        var output = new Array();
        var tempsub = new Array();
        var found = false;
        angular.forEach(collection, function (value) {
            tempsub = new Array();
            //console.log(value[subProperty]);
            angular.forEach(value[subProperty], function (value2) {
                if (value2[propertyName] == propertyValue) {
                    tempsub.push(value2);
                    found = true;
                }
            });
            if (found) {
                found = false;
                var length = output.push(value);
                //console.log(length);
                output[length - 1][subProperty] = tempsub;
            }
        });
        return output;
    };
}).filter('getAllObjectsByArray', function () {
    return function (propertyName, ArraySearch, collection) {
        if (ArraySearch == null || ArraySearch == undefined || ArraySearch.length == 0) {
            return collection;
        }
        var output = new Array();
        angular.forEach(collection, function (value) {
            if (ArraySearch.indexOf(value[propertyName]) != -1) {
                output.push(value);
            }
        });
        return output;
    };
});
