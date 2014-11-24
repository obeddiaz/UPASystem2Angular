var UPapp_Auth = angular.module('Auth_Service', []);
UPapp_Auth.factory('authService', ['$http', '$q', '$window', function ($http, $q, $window) {

        var serviceBase = 'http://upadev.tesconmedia.com/app/public/index.php/user/login';
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false
        };

        var _login = function (loginData) {

            var deferred = $q.defer();
//            $http.get(serviceBase, {params: {'u': loginData.userName, 'p': loginData.password}}).
//                    success(function (data, status) {
//                        if (!data.error) {
//                            $window.sessionStorage.setItem('token', data._token);
//                            $window.sessionStorage.setItem('nocuenta', data.user[0].nocuenta);
//                            $window.sessionStorage.setItem('nombre', data.user[0].nombre);
//                            $window.sessionStorage.setItem('apellido_paterno', data.user[0].apellidopat);
//                            $window.sessionStorage.setItem('apellido_materno', data.user[0].apellidomat);
//                            $window.sessionStorage.setItem('email', data.user[0].email);
//                            _authentication.isAuth = true;
//                            _authentication.nocuenta = data.user[0].nocuenta;
//                            _authentication.nombre = data.user[0].nombre;
//                            _authentication.apellido_pat = data.user[0].apellidopat;
//                            _authentication.apellido_mat = data.user[0].apellidomat;
//                            _authentication.email = data.user[0].email;
//                            if (data.user[0].admin_activo == 1) {
//                                _authentication.user_type = 'Admin';
//                                $window.sessionStorage.setItem('user_type', 'Admin');
//                            } else {
//                                if (data.user[0].profesor_activo == 1) {
//                                    _authentication.user_type = 'Profesor';
//                                    $window.sessionStorage.setItem('user_type', 'Profesor');
//                                } else {
//                                    _authentication.user_type = 'Alumno';
//                                    $window.sessionStorage.setItem('user_type', 'Alumno');
//                                }
//                            }
//                            deferred.resolve(data);
//                        } else {
//                            _logOut();
//                            deferred.resolve('Usuario o contraseña incorrectos');
//                        }
//                    }).
//                    error(function (err, status) {
//                        _logOut();
//                        deferred.reject(err);
//                    });
            var data = {
                "_token": "b5CREEOD77NjAilb2F7KDoO5UxB3Cd9rOs9QrSRd",
                "flash": {
                    "old": [],
                    "new": []
                },
                "user": {
                    "persona": {
                        "idpersonas": 4241,
                        "apellidopat": "MEDRANO",
                        "apellidomat": "HERNÁNDEZ",
                        "nombre": "FERNANDO ULISES",
                        "iemail": "fernando.medrano@upa.edu.mx",
                        "fechanaci": "0000-00-00",
                        "sexo": 0,
                        "alumno": 0,
                        "alumno_activo": 0,
                        "profesor": 1,
                        "profesor_activo": 1,
                        "token": "$2y$10$mIJQXLhDX/5dgu.ie2/Dwu1KLn22hG3jv19z7hFC9UdozjWeV2Rzu"
                    }
                }
            };
//            $window.sessionStorage.setItem('token', data._token);
//            $window.sessionStorage.setItem('nocuenta', data.user[0].nocuenta);
//            $window.sessionStorage.setItem('nombre', data.user[0].nombre);
//            $window.sessionStorage.setItem('apellido_paterno', data.user[0].apellidopat);
//            $window.sessionStorage.setItem('apellido_materno', data.user[0].apellidomat);
//            $window.sessionStorage.setItem('email', data.user[0].email);
//            _authentication.isAuth = true;
//            _authentication.nocuenta = data.user[0].nocuenta;
//            _authentication.nombre = data.user[0].nombre;
//            _authentication.apellido_pat = data.user[0].apellidopat;
//            _authentication.apellido_mat = data.user[0].apellidomat;
//            _authentication.email = data.user[0].email;
//            if (data.user[0].admin_activo == 1) {
//                _authentication.user_type = 'Admin';
//                $window.sessionStorage.setItem('user_type', 'Admin');
//            } else {
//                if (data.user[0].profesor_activo == 1) {
//                    _authentication.user_type = 'Profesor';
//                    $window.sessionStorage.setItem('user_type', 'Profesor');
//                } else {
//                    _authentication.user_type = 'Alumno';
//                    $window.sessionStorage.setItem('user_type', 'Alumno');
//                }
//            }
            console.log(data);
            //return deferred.promise;
        };

        var _logOut = function () {
            $window.sessionStorage.removeItem('token');
            $window.sessionStorage.removeItem('nocuenta');
            $window.sessionStorage.removeItem('nombre');
            $window.sessionStorage.removeItem('apellido_paterno');
            $window.sessionStorage.removeItem('apellido_materno');
            $window.sessionStorage.removeItem('email');
            _authentication.isAuth = false;
            _authentication.userdata = "";
        };

        var _fillAuthData = function () {
            var authData = $window.sessionStorage.getItem('token');
            var nocuenta = $window.sessionStorage.getItem('nocuenta');
            var nombre = $window.sessionStorage.getItem('nombre');
            var ap_pat = $window.sessionStorage.getItem('apellido_paterno');
            var ap_mat = $window.sessionStorage.getItem('apellido_materno');
            var email = $window.sessionStorage.getItem('email');
            var user_type = $window.sessionStorage.getItem('user_type');
            if (authData)
            {
                _authentication.isAuth = true;
                _authentication.nocuenta = nocuenta;
                _authentication.nombre = nombre;
                _authentication.apellido_pat = ap_pat;
                _authentication.apellido_mat = ap_mat;
                _authentication.email = email;
                if (user_type == 1) {
                    _authentication.user_type = 'Admin';
                } else {
                    if (user_type == 1) {
                        _authentication.user_type = 'Profesor';
                    } else {
                        _authentication.user_type = 'Alumno';
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