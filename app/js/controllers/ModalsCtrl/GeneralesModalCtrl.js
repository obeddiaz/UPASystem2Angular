UPapp.controller('Modal_AlumnosBeca', function ($scope, adminService, $filter, $modal) {
    $scope.model = [];
    $scope.model['idbeca'] = $scope.data_modal['id'];
    var alm_insc = false;
    var alm_insc_car = [];
    var alm_noinsc = false;
    var alm_noinsc_car = [];
    var filter = [];
    $scope.maxSize = 10;
    $scope.items_per_page = 30;
    $scope.show_alumnos = true;
    $scope.$parent.isBusy = true;
    adminService.getPeriodos().then(function (data) {
        $scope.$parent.isBusy = true;
        $scope.periodos = data;
        data.forEach(function (val, key) {
            if (val.actual == 1) {
                $scope.model.periodo = $scope.periodos[key];
            }
        });
        _PeriodosReady();
    }, function (err) {
    });
    var _PeriodosReady = function () {
        $scope.$parent.isBusy = true;
        adminService.getNiveles().then(function (data) {
            if (data.respuesta.data) {
                $scope.niveles = data.respuesta.data;
                $scope.model.nivel = Object.keys(data.respuesta.data)[0];
                _NivelesReady();
            }
        });
    };
    var _NivelesReady = function () {
        $scope.$parent.isBusy = true;
        adminService.getAlumnosBecas($scope.model).then(function (data) {
            $scope.$parent.isBusy = false;
            if (data.respuesta) {
                if (data.respuesta.data) {
                    alm_insc = data.respuesta.data;
                    angular.forEach(data.respuesta.data, function (value, genre) {
                        if (alm_insc_car.indexOf(value.carrera) == -1)
                        {
                            alm_insc_car.push(value.carrera);
                        }
                    });
                }
            }
            $scope.insc_noinsc();
        });
        adminService.getAlumnosNoBecas($scope.model).then(function (datanoinsc) {
            if (datanoinsc.respuesta) {
                if (datanoinsc.respuesta.data) {
                    alm_noinsc = datanoinsc.respuesta.data;
                    angular.forEach(datanoinsc.respuesta.data, function (value, genre) {
                        if (alm_noinsc_car.indexOf(value.carrera) == -1)
                        {
                            alm_noinsc_car.push(value.carrera);
                        }
                    });
                }
            }
        });

    };
    var render_table = function () {
        var begin = (($scope.bigCurrentPage - 1) * $scope.items_per_page)
                , end = begin + $scope.items_per_page;
        //console.log(filter.slice(begin, end));
        if (filter) {
            $scope.filteredTodos = filter.slice(begin, end);
        }
    };

    $scope.$watchCollection('bigCurrentPage', function () {
        //console.log($scope.bigCurrentPage);
        if ($scope.bigCurrentPage) {
            render_table();
        }
    });

    $scope.make_filters = function () {
        filter = $filter('getAllObjectsByProperty')('carrera', $scope.alumno_filter.carrera, $scope.alumnos);
        $scope.bigTotalItems = filter.length;
        $scope.bigCurrentPage = 1;
        console.log($scope.alumnos);
        render_table();
    };
    $scope.insc_noinsc = function () {
        $scope.alumno_filter = [];
        $scope.carreras = false;
        console.log($scope.show_alumnos);
        if ($scope.show_alumnos) {
            $scope.show_alumnos = false;
            $scope.alumnos = alm_insc;
            $scope.carreras = alm_insc_car;
            $scope.alumno_filter.carrera = alm_insc_car[0];
            $scope.make_filters();
        } else {
            $scope.show_alumnos = true;
            $scope.alumnos = alm_noinsc;
            $scope.carreras = alm_noinsc_car;
            $scope.alumno_filter.carrera = alm_noinsc_car[0];
            $scope.make_filters();
        }
    };
    $scope.add = function () {
        $scope.$parent.isBusy = true;
        adminService.addNIAlumnosBeca($scope.model).then(function (data) {
            $scope.$parent.isBusy = false;
            if (data.respuesta.data) {
                alm_insc = data.respuesta.data;
                angular.forEach(data.respuesta.data, function (value, genre) {
                    if (alm_insc_car.indexOf(value.carrera) == -1)
                    {
                        alm_insc_car.push(value.carrera);
                    }
                });
                $scope.model.idpersona = [];
            }
        });
    };
    $scope.activate = function () {
        $scope.$parent.isBusy = true;
        adminService.reactivarBecaAlumno($scope.model).then(function (data) {
            $scope.$parent.isBusy = false;
            if (data.respuesta.data) {
                alm_insc = data.respuesta.data;
                angular.forEach(data.respuesta.data, function (value, genre) {
                    if (alm_insc_car.indexOf(value.carrera) == -1)
                    {
                        alm_insc_car.push(value.carrera);
                    }
                });
                $scope.model.idpersona = [];
                $scope.alumnos = alm_insc;
                $scope.alumno_filter.carrera = alm_insc_car[0];
            }
        });
    };
    $scope.deactivate = function () {
        $scope.$parent.isBusy = true;
        adminService.desactivarBecaAlumno($scope.model).then(function (data) {
            $scope.$parent.isBusy = false;
            if (data.respuesta.data) {
                alm_insc = data.respuesta.data;
                angular.forEach(data.respuesta.data, function (value, genre) {
                    if (alm_noinsc_car.indexOf(value.carrera) == -1)
                    {
                        alm_insc_car.push(value.carrera);
                    }
                });
                $scope.model.idpersona = [];
                $scope.alumnos = alm_insc;
                $scope.alumno_filter.carrera = alm_noinsc_car[0];
                $scope.make_filters();
            }
        });
    };

    $scope.Buscar_alumno = function (html) {
        var SearchInstance = $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'md',
            resolve: {
                custom_data: function () {
                    return false;
                }
            }
        });

        SearchInstance.result.then(function (searchParams) {
            console.log(searchParams);
            //$scope.selected = selectedItem;
        });
    };

    $scope.consultar_adeudos = function (html, alumno_data) {
        var ConsultarInstance = $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                custom_data: function () {
                    return {alumno_data: alumno_data, periodo_data: $scope.model.periodo};
                }
            }
        });
    };
});


UPapp.controller('Modal_BuscarAlumnoBeca', function ($scope, $rootScope, adminService, $filter) {
    $scope.buscar = function () {
        if ($scope.model) {
            $scope.$parent.return_data = $scope.model;
            $scope.$parent.ok();
        }
    };
});

UPapp.controller('Modal_ConsultarAdeudosBeca', function ($scope, adminService) {
    console.log($scope.$parent.data_modal);
    var idpersona = $scope.$parent.data_modal.alumno_data.idpersonas;
    var idperiodo = $scope.$parent.data_modal.periodo_data.idperiodo;
    adminService.getAdeudosAlumnoNew(idpersona, idperiodo).then(function (data) {
        console.log(data);
        if (data.respuesta) {
            $scope.adeudos_alumno = data.respuesta;
        } else {
            $scope.adeudos_alumno = false;
        }
    }, function (err) {
    });
    $scope.beca_activar_suspender = function (id_adeudo, aplica_beca) {
        adminService.suspenderBeca(id_adeudo, idpersona, idperiodo, aplica_beca).then(function (data) {
            if (data.respuesta) {
                $scope.adeudos_alumno = data.respuesta.data;
            } else {
                $scope.adeudos_alumno = false;
            }
        }, function (err) {
        });
    };
});


UPapp.controller('Modal_ConsultaAlumno', function ($scope, adminService) {
    $scope.model = [];
    $scope.model['id_persona'] = $scope.data_modal['idpersonas'];
    adminService.getPeriodos().then(function (data) {
        $scope.periodos = data;
        data.forEach(function (val, key) {
            if (val.actual == 1) {
                $scope.model.periodo = $scope.periodos[key];
                $scope.Mostrar_Referencia();
            }
        });
    }, function (err) {
    });



    $scope.Mostrar_Referencia = function () {
        ref_count = 0;
        console.log($scope.model);
        adminService.getAdeudosAlumno($scope.model).then(function (data) {
            if (data.respuesta) {
                $scope.adeudos = data.respuesta;
            }
        }, function (err) {
        });
    };
});