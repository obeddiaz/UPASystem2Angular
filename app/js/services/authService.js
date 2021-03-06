var UPapp_Auth = angular.module('Auth_Service', []);
UPapp_Auth.factory('authService', ['$http', '$q', '$window', function ($http, $q, $window) {
        var authServiceFactory = {};
        var _authentication = {
            isAuth: false
        };

        var _login = function (loginData) {
            var deferred = $q.defer();
            $http.post(serviceBase + '/user/login', {'u': loginData.userName, 'p': loginData.password}).
                    success(function (data, status) {
                        if (!data.error) {
                            var response_data = data.respuesta[0];
                            var persona = response_data.user.persona;
                            $window.localStorage.setItem('token', response_data._token);
                            $window.localStorage.setItem('persona', JSON.stringify(persona));
                            _authentication.isAuth = true;
                            _authentication.token = ('token', response_data._token);
                            _authentication.persona = ('persona', persona);
                            //console.log(parseInt(persona.alumno_activo));
                            if (parseInt(persona.alumno_activo) === 1||parseInt(persona.alumno) === 1) {
                                _authentication.user_type = 'alumno';
                                $window.localStorage.setItem('user_type', 'alumno');
                            } else if (parseInt(persona.admin_activo) === 1) {
                                _authentication.user_type = 'administrador';
                                $window.localStorage.setItem('user_type', 'administrador');
                            } else if (parseInt(persona.profesor_activo) === 1) {
                                _authentication.user_type = 'profesor';
                                $window.localStorage.setItem('user_type', 'administrador');
                            } else {
                                _authentication.user_type = 'alumno';
                                $window.localStorage.setItem('user_type', 'alumno');
                            }
                            deferred.resolve(data);
                        } else {
                            _logOut();
                            deferred.resolve('Usuario o contraseña incorrectos');
                        }
                    }).
                    error(function (err, status) {
                        _logOut();
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _logOut = function () {
            $window.localStorage.removeItem('persona');
            $window.localStorage.removeItem('token');
            $window.localStorage.removeItem('user_type');
            _authentication.isAuth = false;
            _authentication.token = false;
            _authentication.persona = false;
            _authentication.user_type = false;
        };

        var _fillAuthData = function () {
            var authData = $window.localStorage.getItem('token');
            var persona = $window.localStorage.getItem('persona');
            var user_type = $window.localStorage.getItem('user_type');
            if (authData)
            {
                _authentication.isAuth = true;
                _authentication.persona = JSON.parse(persona);
                if (user_type === 'administrador') {
                    _authentication.user_type = 'administrador';
                } else {
                    if (user_type === 'profesor') {
                        _authentication.user_type = 'profesor';
                    } else {
                        _authentication.user_type = 'alumno';
                    }
                }
            }

        };

        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        return authServiceFactory;
    }]);