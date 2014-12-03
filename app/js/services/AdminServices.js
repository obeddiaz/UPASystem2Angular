UPapp.factory('adminService', ['$http', '$q', '$window', function ($http, $q, $window) {
        var deferred = $q.defer();
        var serviceBase = 'http://localhost:8000/';
        var adminServiceFactory = {};
//        var _getCiclos = function (Matricula) {
//            $http.get(serviceBase + 'ciclos/show', {params: {'nocuenta': Matricula}})
//                    .success(function (data) {
//                        deferred.resolve(data.response);
//                    }).
//                    error(function (err, status) {
//                        deferred.reject(err);
//                    });
//            return deferred.promise;
//
//        };
//
//        var _getReferencias = function (Matricula) {
//
//            var deferred = $q.defer();
//            $http.get(serviceBase + 'cobros/show_estado_de_cuenta', {params: {'nocuenta': Matricula}}).
//                    success(function (data, status) {
//                        deferred.resolve(data.response);
//                    }).
//                    error(function (err, status) {
//                        deferred.reject(err);
//                    });
//            return deferred.promise;
//        };
//
//        var _getAlumnos = function (nombre, ap_paterno, ap_materno) {
//            var deferred = $q.defer();
//            $http.get(serviceBase + 'personas/alumno/nombre', {params: {'nombre': nombre, 'apellidopat': ap_paterno, 'apellidomat': ap_materno}}).
//                    success(function (data, status) {
//                        deferred.resolve(data.response);
//                    }).
//                    error(function (err, status) {
//                        deferred.reject(err);
//                    });
//            return deferred.promise;
//        };
//
//        var _getDataByNoCuenta = function (Matricula) {
//            var deferred = $q.defer();
//            $http.get(serviceBase + 'cobros/show_info', {params: {'nocuenta': Matricula}}).
//                    success(function (data, status) {
//                        deferred.resolve(data.response);
//                    }).
//                    error(function (err, status) {
//                        deferred.reject(err);
//                    });
//            return deferred.promise;
//        };
//
//        var _getAlumno = function (Matricula) {
//            var deferred = $q.defer();
//            $http.get(serviceBase + 'personas/alumno/matricula/' + Matricula).
//                    success(function (data, status) {
//                        deferred.resolve(data.response[0]);
//                    }).
//                    error(function (err, status) {
//                        deferred.reject(err);
//                    });
//            return deferred.promise;
//        };
//
//        adminServiceFactory.getCiclos = _getCiclos;
//        adminServiceFactory.getReferencias = _getReferencias;
//        adminServiceFactory.getAlumnos = _getAlumnos;
//        adminServiceFactory.getAlumno = _getAlumno;
//        adminServiceFactory.getDataByNoCuenta = _getDataByNoCuenta;
//        return adminServiceFactory;
        return {
            getPeriodod: function (matricula) {
                return $http.get(serviceBase + 'personas/alumno/matricula/' + matricula);
            },
            getciclos:function (){
                return $http.get(serviceBase + 'ciclos/show' + matricula);
            }
        };
    }]);