'use strict';

var serviceBase = 'http://pagos.upa.edu.mx/indexapi.php';
// Declare app level module which depends on filters, and services
var UPapp = angular.module('UPA_Pagos', [
    'ngRoute',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'appFilereader',
    'myApp.controllers',
    'Interceptor_Service',
    'ui.bootstrap',
    'Auth_Service',
    'checklist-model',
    'angular-data.DSCacheFactory',
    'ngGrid'
]);

UPapp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'partials/index.html',
            controller: 'HomeCtrl'
        });
        //.../home/admin
        $routeProvider.when('/home/admin/:pagename', {
            templateUrl: 'partials/index.html',
            controller: 'HomeCtrl'
        });
        $routeProvider.when('/home/alumno/recibo', {
            templateUrl: 'partials/alumno/recibo.html',
            controller: 'ReciboCtrl'
        });
        $routeProvider.when('/home/alumno/:pagename', {
            templateUrl: 'partials/index.html',
            controller: 'HomeCtrl'
        });
        $routeProvider.when('/home/admin/:pagename/:subpagename', {
            templateUrl: 'partials/index.html',
            controller: 'HomeCtrl'
        });
        $routeProvider.when('/home/alumno/:pagename/:subpagename', {
            templateUrl: 'partials/index.html',
            controller: 'HomeCtrl'
        });
        $routeProvider.when('/login', {
            templateUrl: 'partials/login/index.html'
        });
        $routeProvider.otherwise({redirectTo: '/login'});
    }]);
UPapp.run(['authService', function (authService) {
        authService.fillAuthData();
    }]);

var waitingDialog = waitingDialog || (function ($) {
    'use strict';

    // Creating modal dialog's DOM
    var $dialog = $(
            '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
            '<div class="modal-dialog modal-m">' +
            '<div class="modal-content">' +
            '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
            '<div class="modal-body">' +
            '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
            '</div>' +
            '</div></div></div>');

    return {
        /**
         * Opens our dialog
         * @param message Custom message
         * @param options Custom options:
         * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
         * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
         */
        show: function (message, options) {
            // Assigning defaults
            if (typeof options === 'undefined') {
                options = {};
            }
            var settings = $.extend({
                dialogSize: 'm',
                progressType: ''
            }, options);
            if (typeof message === 'undefined') {
                message = 'Cargando';
            }
            // Configuring dialog
            $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
            $dialog.find('.progress-bar').attr('class', 'progress-bar');
            if (settings.progressType) {
                $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
            }
            $dialog.find('h3').text(message);
            // Opening dialog
            $dialog.modal();
        },
        /**
         * Closes dialog
         */
        hide: function () {
            $dialog.modal('hide');
        }
    };

})(jQuery);
