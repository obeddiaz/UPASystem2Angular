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

        var _getPlanesPagoAgrupacion = function (id) {
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

        var _setAdeudosalumno = function (paquete_id, id_personas) {
            var deferred = $q.defer();
            console.log(paquete_id);
            console.log(id_personas);
            $http.post(serviceBase + '/administracion/agrupaciones/alumnos_paquete/agregar', {"paquete_id": paquete_id, "id_personas": id_personas})
                    .success(function (data) {
                        console.log(data);
                    }).
                    error(function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };

        var _setAdeudosalumno = function (paquete_id, id_personas) {
            var deferred = $q.defer();
            console.log(paquete_id);
            console.log(id_personas);
            $http.post(serviceBase + '/administracion/agrupaciones/alumnos_paquete/agregar', {"paquete_id": paquete_id, "id_personas": id_personas})
                    .success(function (data) {
                        console.log(data);
                    }).
                    error(function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };

        var _getPeriodos = function () {
            var deferred = $q.defer();
            //console.log(serviceBase);
            $http.get(serviceBase + '/periodos')
                    .success(function (data) {
                        //console.log(data);
                        deferred.resolve(data.respuesta.data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            //console.log(deferred.promise);
            return deferred.promise;

        };

        adminServiceFactory.getPlanesPago = _getPlanesPago;
        adminServiceFactory.getAgrupaciones = _getAgrupaciones;
        adminServiceFactory.getPlanesPagoAgrupacion = _getPlanesPagoAgrupacion;
        adminServiceFactory.getalumnos = _getalumnos;
        adminServiceFactory.setAdeudosalumno = _setAdeudosalumno;
        adminServiceFactory.getPeriodos = _getPeriodos;
        return adminServiceFactory;
    }]);