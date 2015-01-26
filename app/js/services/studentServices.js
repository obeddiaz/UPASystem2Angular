UPapp.factory('studentService', ['$http', '$q', '$window', function ($http, $q, $window) {
        //var deferred = $q.defer();
        var studentServiceFactory = {};
        var _getPeriodos = function () {
            var deferred = $q.defer();
            $http.get(serviceBase + '/periodos')
                    .success(function (data) {
                        deferred.resolve(data.respuesta.data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };

        var _getAdeudos = function (persona, periodo) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/estado_de_cuenta/adeudos', {params: {id_persona: persona, periodo: periodo}})
                    .success(function (data) {
                        deferred.resolve(data.respuesta);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });

            return deferred.promise;

        };
        var _setReferencias = function (referencias) {
            var deferred = $q.defer();
            console.log(referencias);
            $http.post(serviceBase + '/estado_de_cuenta/referencias', {adeudos: referencias})
                    .success(function (data) {
                        deferred.resolve(data.respuesta);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };

        studentServiceFactory.getPeriodos = _getPeriodos;
        studentServiceFactory.getAdeudos = _getAdeudos;
        studentServiceFactory.setReferencias = _setReferencias;
        return studentServiceFactory;
    }]);