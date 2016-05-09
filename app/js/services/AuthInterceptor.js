
var UPapp_Interceptor = angular.module('Interceptor_Service', []);
UPapp_Interceptor.config(function ($provide, $httpProvider) {
    // Intercept http calls.
    $provide.factory('AuthInterceptor', ['$window', '$q', '$location', '$injector', function ($window, $q, $location, $injector) {
            return {
                request: function (config) {
                    var Auth_Service = $injector.get('authService');
                    //console.log(Auth_Service.authentication.isAuth);
                    config.headers = config.headers || {};

                    if (Auth_Service.authentication.isAuth) {
                        config.headers.Authorization = $window.sessionStorage.getItem('token');
                    } else {
                        if ($location.path() != "/login") {
                            alert("Tu Sesión se a terminado.");
                            $location.path('/login');
                        }
                    }
                    return config || $q.when(config);
                },
                responseError: function (response) {
                    //$window.sessionStorage.removeItem('token');
                    //$location.path('/login');
                    if (response.status === 401) {

                    }
                    return response || $q.when(response);
                }
            };
        }]);

    $provide.factory('isloggedinHttpInterceptor', ['$q', '$location', '$injector', function ($q, $location, $injector) {
            return {
                response: function (response) {
                    // do something on success
//                console.log(response.data);
//               if (IsJsonString(JSON.stringify(response.data))){
//                    console.log(response);
//               }
                    var Modals = $injector.get('$modalStack');
                    var Auth_Service = $injector.get('authService');

                    if (response.headers()['content-type'] === "application/json; charset=utf-8" || (response.headers()['content-type'] === "application/json")) {
                        // Validate response, if not ok rejectresponse.headers()['content-type'] === "application/json; charset=utf-8"||
                        //var data = examineJSONResponse(response); // assumes this function is available
                        //console.log(response.data);
                        if (response.data.error) {
                            waitingDialog.hide();
                            //console.log(response.data);
                            if (response.data.message == "Usuario no autenticado" || response.data.message == "Bad Token at filter") {
                                //console.log(response.data);
                                Modals.dismissAll();
                                Auth_Service.logOut();
                                if ($location.path() != "/login") {
                                    alert("Tu Sesión se a terminado.");
                                    $location.path('/login');
                                }
                                //$location.path('/login');
                            }
                        }
                        //console.log(response.data);
                    }
                    return response;
                },
                responseError: function (response) {
                    // do something on error
                    return $q.reject(response);
                }
            };
        }]);
    $httpProvider.interceptors.push('AuthInterceptor');
    $httpProvider.interceptors.push('isloggedinHttpInterceptor');
});