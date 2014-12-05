UPapp.controller('Administracion_Generales', function ($scope, $routeParams) {
    //console.log($routeParams);
    $scope.tabs = [
        {title: 'Planes de Pago', click: 'planes_de_pago'},
        {title: 'Nuevo Plan de Pago', click: 'nuevo_plan_pago'},
        {title: 'Becas', click: 'becas'},
        {title: 'Conceptos', click: 'conceptos'}
    ];
    $scope.subPageTemplate = 'partials/administrador/administracion/generales/planes_de_pago.html';
    $scope.subPageContent = function (page) {
        $scope.subPageTemplate = 'partials/administrador/administracion/generales/' + page + '.html';
    };
});

UPapp.controller('Administracion_Generales_planes_pago', function ($scope, $routeParams, adminService, $modal) {
    adminService.getPlanesPago().then(function (data) {
        $scope.planes = data;
    }, function (err) {

    });
    $scope.open = function (data, type, html) {
        $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                custom_data: function () {
                    return data;
                },
                type: function () {
                    return type;
                }
            }
        });
    };
});

UPapp.controller('Administracion_Generales_conceptos', function ($scope, $routeParams, adminService, $modal) {
    adminService.getconceptos().then(function (data) {
        console.log(data);
        if (!data.error) {
            $scope.conceptos = data.respuesta.data;
        }
    }, function (err) {

    });
    $scope.open = function (data, type, html) {
        $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                custom_data: function () {
                    return data;
                },
                type: function () {
                    return type;
                }
            }
        });
    };
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
    $scope.alumnos_inscritos = true;
    var paquete_periodo = {};
    adminService.getalumnos().then(function (data) {
        $scope.alumno_filter = {
            carrera: false
        };
        $scope.alumnos = data;
        $scope.carreras = [];
        angular.forEach(data, function (value, genre) {
            //console.log($scope.carreras.indexOf(value.carrera));
            if ($scope.carreras.indexOf(value.carrera) === -1)
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
            if (val.actual === 1) {
                $scope.Modelo_Periodo = $scope.periodos[key];
                $scope.aif();
            }
        });
    }, function (err) {
        $scope.alerts = [
            {type: 'danger', msg: 'Usuario o contraseña incorrectos'}
        ];
        $scope.message = err.error_description;
    });
    //funcion Alumnos Inscritos
    $scope.aif = function () {
        adminService.getAlumnosPaquete($scope.Modelo_Periodo.idperiodo, $scope.data_plan.id).then(function (data) {
            if (!data.error) {
                paquete_periodo = data.respuesta.paquete;
                $scope.alumnos_insc = data.respuesta.data;
                $scope.alerts = false;
            } else {
                paquete_periodo = false;
                $scope.alumnos_insc = false;
                $scope.alumnos_inscritos = true;
                $scope.alerts = [
                    {type: 'danger', msg: 'No existe Ningun Paquete para el periodo ' + $scope.Modelo_Periodo.periodo}
                ];
            }
        }, function (err) {

        });
    };
    $scope.mostrar_ocultar = function (show) {
        if (show === 'inscritos') {
            $scope.alumnos_todos = false;
            $scope.alumnos_inscritos = true;
            //console.log($scope.Modelo_Periodo);
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
        if (paquete_periodo) {
            adminService.setAdeudosalumno(paquete_periodo.id, $scope.alumno_assign.add).then(function (data) {
                console.log(data);
            }, function (err) {

            });
        }
    };
    //
});

UPapp.controller('ModalInstanceCtrl', function ($scope, $modalInstance, $http, adminService, custom_data, type) {
    $scope.info = custom_data;
    adminService.getPeriodos().then(function (data) {
        $scope.periodos = data;
        data.forEach(function (val, key) {
            if (val.actual == 1) {
                $scope.Modelo_Periodo = $scope.periodos[key];
            }
        });
        adminService.getNiveles().then(function (data) {
            console.log(data);
            $scope.niveles = data.respuesta.data;
            $scope.Modelo_Nivel = Object.keys(data.respuesta.data)[0];
            $scope.getSubConceptos();
        });

    }, function (err) {
    });
    console.log(custom_data);


    $scope.getSubConceptos = function () {
        //(conceptos_id, periodo, nivel_id)
        console.log(custom_data.id);
        console.log($scope.Modelo_Periodo);
        console.log($scope.Modelo_Nivel);
        //  (custom_data.id, $scope.Modelo_Periodo, $scope.Modelo_Nivel.id)
        adminService.getSubConceptos(custom_data.id, $scope.Modelo_Periodo.idperiodo, $scope.Modelo_Nivel).then(function (data) {
            console.log(data);
            if (!data.error) {
                $scope.subconceptos = data.respuesta.data;
            }

        });
    };
    if (type === 'concepto') {
        $scope.Nuevo_Subconcepto = function () {

        };
    }
    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
        // $modalInstance.close($scope.selected.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});