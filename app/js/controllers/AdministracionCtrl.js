UPapp.controller('Administracion_Generales', function ($scope, $routeParams) {
    //console.log($routeParams);
    $scope.tabs = [
        {title: 'Planes de Pago', click: 'planes_de_pago'},
        {title: 'Nuevo Plan de Pago', click: 'nuevo_plan_pago'},
        {title: 'Becas', click: 'becas'}
    ];
    $scope.subPageTemplate = 'partials/administrador/administracion/generales/planes_de_pago.html';
    $scope.subPageContent = function (page) {
        $scope.subPageTemplate = 'partials/administrador/administracion/generales/' + page + '.html';
    };
});

UPapp.controller('Administracion_Generales_planes_pago', function ($scope, $routeParams, adminService) {
    adminService.getPlanesPago().then(function (data) {
        $scope.planes = data;
    }, function (err) {

    });
});

UPapp.controller('Administracion_Agrupaciones', function ($scope, $routeParams, adminService) {
    $scope.tabs = [
        {title: 'Alumno', click: 'agrupaciones'}
    ];
    $scope.title = "Agrupaciones";
    $scope.subPageTemplate = 'partials/administrador/administracion/agrupaciones/agrupaciones.html';
    $scope.subPageContent = function (page) {
        $scope.subPageTemplate = 'partials/administrador/administracion/agrupaciones/' + page + '.html';
    };
    $scope.subPageRigth = function (page, custom_data, type) {
        $scope.subPageTemplate = 'partials/administrador/administracion/agrupaciones/' + page + '.html';
        if (type === 'planes') {
            $scope.title = "Agrupacion" + custom_data.nombre;
            adminService.getPaqueteAgrupacion(custom_data.id).then(function (data) {
                $scope.planes = data;
            }, function (err) {

            });
        }
        if (type === 'alumnos') {
            $scope.title = "Alumnos";
            console.log(custom_data);
        }
    };
});


UPapp.controller('Administracion_Agrupaciones_agrupaciones', function ($scope, $routeParams, adminService) {
    adminService.getAgrupaciones().then(function (data) {
        $scope.agrupaciones = data;
    }, function (err) {

    });
    $scope.subpagesnames =
            $scope.subPageLoad = function (html, data, type) {
                $scope.subPageRigth(html, data, type);
            };
});

UPapp.controller('Administracion_Agrupaciones_showalumnos', function ($scope, $routeParams, adminService) {
    adminService.getalumnos().then(function (data) {
        console.log(data);
        $scope.alumnos = data;
    }, function (err) {

    });
});
