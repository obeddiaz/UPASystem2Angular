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
            $scope.title = "Agrupacion: " + custom_data.nombre;
            adminService.getPlanesPagoAgrupacion(custom_data.id).then(function (data) {
                $scope.planes = data;
            }, function (err) {

            });
        }
        if (type === 'alumnos') {
            console.log(custom_data);
            $scope.title = "Alumnos";
            $scope.data_plan = custom_data;
        }
    };
});


UPapp.controller('Administracion_Agrupaciones_agrupaciones', function ($scope, $routeParams, adminService) {
    adminService.getAgrupaciones().then(function (data) {
        $scope.agrupaciones = data;
    }, function (err) {

    });
    $scope.subPageLoad = function (html, data, type) {
//        console.log(html);
//        console.log(data);
//        console.log(type);
        $scope.subPageRigth(html, data, type);
    };
});

UPapp.controller('Administracion_Agrupaciones_showalumnos', function ($scope, $routeParams, adminService) {
    $scope.alumnos_todos = false;
    adminService.getalumnos().then(function (data) {
        $scope.alumno_filter = {
            carrera: false
        };
        $scope.alumnos = data;
        $scope.carreras = [];
        angular.forEach(data, function (value, genre) {
            //console.log($scope.carreras.indexOf(value.carrera));
            if ($scope.carreras.indexOf(value.carrera) == -1)
            {
                $scope.carreras.push(value.carrera);
            }
        });
        $scope.alumno_filter.carrera = $scope.carreras[0];
    }, function (err) {

    });
    adminService.getPeriodos().then(function (data) {
        console.log(data);
        $scope.periodos = data;
        data.forEach(function (val, key) {
            if (val.actual == 1) {
                $scope.Modelo_Periodo = $scope.periodos[key];
                $scope.mostrar_ocultar('inscritos');
            }
        });
    }, function (err) {
        $scope.alerts = [
            {type: 'danger', msg: 'Usuario o contraseña incorrectos'}
        ];
        $scope.message = err.error_description;
    });
    $scope.mostrar_ocultar = function (show) {
        if (show === 'inscritos') {
            $scope.alumnos_todos = false;
            $scope.alumnos_inscritos = true;
            console.log($scope.Modelo_Periodo);
            adminService.getAlumnosPaquete($scope.Modelo_Periodo.idperiodo, $scope.data_plan.id).then(function (data) {
                $scope.alumnos_insc = data;
            }, function (err) {

            });
        }
        if (show === 'no_inscritos') {
            $scope.alumnos_todos = true;
            $scope.alumnos_inscritos = false;
        }
    };
    $scope.alumno_assign = [];
    $scope.checkAll = function () {

        //console.log($scope.filteredAlumnos.map(function(item) { return item.idpersonas; }));
        $scope.alumno_assign.add = $scope.filteredAlumnos.map(function (item) {
            return item.idpersonas;
        });
    };
    $scope.uncheckAll = function () {
        $scope.alumno_assign.add = [];
    };
    $scope.asignar_alumnos = function () {
        adminService.setAdeudosalumno($scope.data_plan.id, $scope.alumno_assign.add).then(function (data) {
            console.log(data);
        }, function (err) {

        });
        //console.log($scope.data_plan.id);
        //console.log($scope.alumno_assign.add);

    };
    //
});
