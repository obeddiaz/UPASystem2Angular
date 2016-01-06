'use strict';

/* Directives */


angular.module('myApp.directives', [])
        .directive('appVersion', ['version', function (version) {
                return function (scope, elm, attrs) {
                    elm.text(version);
                };
            }])
        .directive('ngConfirmClick', [
            function () {
                return {
                    priority: -1,
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        element.bind('click', function (e) {
                            var message = attrs.ngConfirmClick;
                            if (message && !confirm(message)) {
                                e.stopImmediatePropagation();
                                e.preventDefault();
                            }
                        });
                    }
                }
            }
        ]).directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);
angular.module('appFilereader', [])
        .directive('appFilereader', function (
                $q
                ) {
            /*
             made by elmerbulthuis@gmail.com WTFPL licensed
             */
            var slice = Array.prototype.slice;

            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, element, attrs, ngModel) {
                    if (!ngModel)
                        return;

                    ngModel.$render = function () {
                    }

                    element.bind('change', function (e) {
                        var element = e.target;
                        if (!element.value)
                            return;

                        element.disabled = true;
                        $q.all(slice.call(element.files, 0).map(readFile))
                                .then(function (values) {
                                    if (element.multiple)
                                        ngModel.$setViewValue(values);
                                    else
                                        ngModel.$setViewValue(values.length ? values[0] : null);
                                    //element.value = null;
                                    element.disabled = false;
                                });

                        function readFile(file) {
                            var deferred = $q.defer();

                            var reader = new FileReader()
                            reader.onload = function (e) {
                                deferred.resolve(e.target.result);
                            }
                            reader.onerror = function (e) {
                                deferred.reject(e);
                            }
                            reader.readAsDataURL(file);

                            return deferred.promise;
                        }

                    }); //change

                } //link

            }; //return

        }).directive('fileInput', ['$parse', function ($parse) {
        return{
            restrict: 'A',
            link: function (scope, elm, attrs) {
                elm.bind('change', function () {
                    $parse(attrs.fileInput).assign(scope, elm[0].files);
                    scope.$apply();
                });
            }
        };
    }]); //appFilereader