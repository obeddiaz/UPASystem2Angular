UPapp.controller("Control_loginCtrl", function ($scope, $location, authService, $window) {
    //console.log($window.sessionStorage.getItem('token'));
    //console.log($scope);
    $scope.login = function () {
        authService.login($scope.loginData);
//        authService.login($scope.loginData).then(function (response) {
//            if (authService.authentication.isAuth) {
//                console.log(response);
//                //$window.sessionStorage.setItem('token', response._token);
//                //$scope.main_template = 'views/Menu/menu.html';
//                //$location.path('/cajas');
//            } else {
//                $scope.alerts = [
//                    {type: 'danger', msg: response}
//                ];
//            }
//
//        },
//                function (err) {
//                    $scope.alerts = [
//                        {type: 'danger', msg: 'Usuario o contraseña incorrectos'}
//                    ];
//                    $scope.message = err.error_description;
//                });

    };
    //console.log(authService.authentication.isAuth);
    $scope.logout = function () {
        authService.logOut();
        $scope.main_template = 'views/login/login_form.html';
        $location.path('/');
    };
    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
    if (authService.authentication.isAuth) {
        $scope.main_template = 'views/Menu/menu.html';
    } else {
        $scope.main_template = 'views/login/login_form.html';
    }
});
