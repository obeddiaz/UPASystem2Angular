UPapp.controller('HomeCtrl', function ($scope, $routeParams, authService, $location) {
    var curr_user = authService.authentication;;
    if (curr_user.isAuth) {
        if (curr_user.user_type === 'alumno') {
            var main_route = '#/home/alumno';
            $scope.UserData = curr_user.persona;
            $scope.menus = [
                {
                    title: "Estado de Cuenta",
                    action: main_route + "/estado_de_cuenta"
                }
            ];
            if ($routeParams.pagename && $routeParams.subpagename) {
                $scope.template = 'partials/alumno/' + $routeParams.pagename + '/' + $routeParams.subpagename + '.html?ver='+app_version;
            } else if ($routeParams.pagename) {
                $scope.template = 'partials/alumno/' + $routeParams.pagename + '.html?ver='+app_version;
            } else {
                $scope.template = 'partials/alumno/estado_de_cuenta.html?ver='+app_version;
            }
        } else if (curr_user.user_type === 'profesor' || curr_user.user_type === 'administrador') {
            var main_route = '#/home/admin';
            $scope.UserData = curr_user.persona;
            $scope.menus = [
                {
                    title: "Administracion",
                    menu: [
                        {
                            title: "Agrupaciones",
                            action: main_route + "/administracion/agrupaciones"
                        },
                        {
                            title: "Generales",
                            action: main_route + "/administracion/generales"
                        }
                    ]
                },
                {
                    title: "Alumnos",
                    menu: [
                        {
                            title: "Consultas",
                            action: main_route + "/alumnos/consultas"
                        }
                    ]
                },
                {
                    title: "Caja",
                    menu: [
                        {
                            title: "Caja",
                            action: main_route + "/caja/caja"
                        }
                    ]
                }
            ];
            if ($routeParams.pagename && $routeParams.subpagename) {
                $scope.template = 'partials/administrador/' + $routeParams.pagename + '/' + $routeParams.subpagename + '.html?ver='+app_version;
            } else if ($routeParams.pagename) {
                $scope.template = 'partials/administrador/' + $routeParams.pagename + '.html?ver='+app_version;
            } else {
                $location.path('/home/admin/administracion/agrupaciones');
            }

        }

    }
    $scope.logout = function () {
        authService.logOut();
        //$scope.main_template = 'views/login/login_form.html';
        $location.path('/login');
    };

    //if ($routeParams.pagename&&$routeParams.subpagename){
    //     $scope.template = 'partials/'+$routeParams.pagename+'/'+$routeParams.subpagename+'.html';//caja' + $location.$$path + '.html';
    //}else if($routeParams.pagename){
//        $scope.template = 'partials/'+$routeParams.pagename+'/'+$routeParams.subpagename+'.html';
//        $scope.template = 'partials//index.html';
    //}
    //$scope.template = 'partials/admin/index.html';//caja' + $location.$$path + '.html';

});
