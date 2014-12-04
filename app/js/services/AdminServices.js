UPapp.factory('adminService', ['$http', '$q', '$window', function ($http, $q, $window) {
        //var deferred = $q.defer();
        var adminServiceFactory = {};
        var _getPlanesPago = function (Matricula) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/administracion/generales/planes_de_pago/todos')
                    .success(function (data) {
                        if (!data.error) {
                            deferred.resolve(data.respuesta.data);
                        }
                        //console.log(data);
                        //deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };

        var _getAgrupaciones = function () {
            var deferred = $q.defer();
            $http.get(serviceBase + '/administracion/agrupaciones')
                    .success(function (data) {
                        //console.log(data);
                        if (!data.error) {
                            deferred.resolve(data.respuesta.data);
                        }
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };

        var _getPaqueteAgrupacion = function (id) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/administracion/generales/planes_de_pago/todos_agrupaciones', {params: {id_agrupaciones: id}})
                    .success(function (data) {
                        //console.log(data);
                        if (!data.error) {
                            deferred.resolve(data.respuesta.data);
                        }
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };
        var _getalumnos = function (id) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/alumnos')
                    .success(function (data) {
                        //console.log(data);
                        if (!data.error) {
                            deferred.resolve(data.respuesta.data);
                        }
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };
        adminServiceFactory.getPlanesPago = _getPlanesPago;
        adminServiceFactory.getAgrupaciones = _getAgrupaciones;
        adminServiceFactory.getPaqueteAgrupacion = _getPaqueteAgrupacion;
        adminServiceFactory.getalumnos = _getalumnos;
        return adminServiceFactory;
    }]);