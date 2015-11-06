UPapp.controller('Modal_AlumnosBeca', function ($scope, adminService, $filter, $modal) {
    $scope.model = [];
    $scope.model['idbeca'] = $scope.data_modal['id'];
    var alm_insc = false;
    var alm_insc_car = [];
    var alm_noinsc = false;
    var alm_noinsc_car = [];
    var filter = [];
    var carreras = {
        Inscritos: [],
        NoInscritos: []
    };
    var alumnos = {
        Inscritos: [],
        NoInscritos: []
    };
    $scope.maxSize = 10;
    $scope.items_per_page = 30;
    $scope.becados = true;
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
                $scope.NivelesReady();
            }
        });
    };
    var columnas = {
        Inscritos: [
//            {
//                title: "Añadir",
//                template: '<input type="checkbox" checklist-model="model.idpersona" checklist-value="dataItem.idpersonas">'
//            },
            {
                field: "matricula",
                title: "Matricula"
            }, {
                //field: "Col2",
                title: "Nombre",
                template: "#=nom + appat + apmat#"
            },
            {
                title: "Estatus",
                template: "<i class=\"fa\" ng-class=\"{'fa-times': dataItem.status == 0, 'fa-check': dataItem.status == 1}\"></i>"
            },
            {
                title: "Consultar",
                template: '<button class="btn btn-default btn-sm btn-block" ng-click="consultar_adeudos(\'m_consultarAdeudosBeca\', dataItem)">Consultar</button>'
            }],
        NoInscritos: [
//            {
//                title: "Añadir",
//                template: '<input type="checkbox" checklist-model="model.idpersona" checklist-value="dataItem.idpersonas">'
//            },
            {
                field: "matricula",
                title: "Matricula"
            },
            {
                title: "Nombre",
                template: "#=nom + appat + apmat#"
            },
            {
                title: "Añadir",
                template: '<button class="btn btn-default btn-sm btn-block" ng-click="add_beca(\'m_consultarAdeudosBeca\', dataItem)">Añadir Beca</button>'
            }]
    };
    $scope.add_beca = function (html, d_a) {
        $scope.model.idpersona = [d_a.idpersonas];
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
                $modal.open({
                    templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    resolve: {
                        custom_data: function () {
                            return {alumno_data: d_a, periodo_data: $scope.model.periodo};
                        }
                    }
                });
            }
        });
    };
    $scope.columns = columnas.Inscritos;
    $scope.mainGridOptions = {
        scrollable: {
            virtual: true
        },
        height: 543,
        pageable: {
            info: true,
            numeric: false,
            previousNext: false
        }
    };
    $scope.NivelesReady = function () {
        $scope.becados = true;
        $scope.$parent.isBusy = true;
        carreras = {
            Inscritos: [],
            NoInscritos: []
        };
        alumnos = {
            Inscritos: [],
            NoInscritos: []
        };
        adminService.getAlumnosBecas($scope.model).then(function (di) {
            $scope.$parent.isBusy = false;
            if (di.respuesta) {
                if (di.respuesta.data) {
                    alumnos.Inscritos = di.respuesta.data;
                    angular.forEach(di.respuesta.data, function (value, genre) {
                        if (carreras.Inscritos.indexOf(value.carrera) == -1)
                        {
                            carreras.Inscritos.push(value.carrera);
                        }
                    });
                }
                $scope.insc_noinsc();
            }
        });
        adminService.getAlumnosNoBecas($scope.model).then(function (dni) {
            if (dni.respuesta) {
                if (dni.respuesta.data) {
                    alumnos.NoInscritos = dni.respuesta.data;
                    angular.forEach(dni.respuesta.data, function (value, genre) {
                        if (carreras.NoInscritos.indexOf(value.carrera) == -1)
                        {
                            carreras.NoInscritos.push(value.carrera);
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
        // console.log($scope.alumno_filter.carrera);
        if ($scope.alumno_filter.carrera) {
            if ($scope.becados) {
                $scope.data_alumnos.data = $filter('getAllObjectsByProperty')('carrera', $scope.alumno_filter.carrera, alumnos.Inscritos);
            } else {
                $scope.data_alumnos.data = $filter('getAllObjectsByProperty')('carrera', $scope.alumno_filter.carrera, alumnos.NoInscritos);
            }
        } else {
            if ($scope.becados) {
                $scope.data_alumnos.data = alumnos.Inscritos;
            } else {
                $scope.data_alumnos.data = alumnos.NoInscritos;
            }
        }
    };
    $scope.limpiar_busqueda = function () {
        $scope.data_alumnos = {
            data: []
        };
        if ($scope.becados) {
            $scope.data_alumnos.data = alumnos.Inscritos;
        } else {
            $scope.data_alumnos.data = alumnos.NoInscritos;
        }
    };
    $scope.insc_noinsc = function () {
        $scope.carreras = false;
        $scope.data_alumnos = {
            data: [],
            pageSize: 20
        };
        if ($scope.becados) {
            $scope.becados = !$scope.becados;
            //$scope.alumnos = alm_insc;
            $scope.data_alumnos.data = alumnos.Inscritos;
            $scope.carreras = carreras.Inscritos;
            $scope.columns = columnas.Inscritos;
            //$scope.alumno_filter.carrera = alm_insc_car[0];
            //$scope.make_filters();
        } else {
            $scope.becados = !$scope.becados;
            $scope.data_alumnos.data = alumnos.NoInscritos;
            // $scope.alumnos = alm_noinsc;
            $scope.carreras = carreras.NoInscritos;
            $scope.columns = columnas.NoInscritos;
            //$scope.alumno_filter.carrera = alm_noinsc_car[0];
            //$scope.make_filters();
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
            console.log($scope.data_alumnos.data);
            if ($scope.alumno_filter.carrera) {
                filter = $filter('getAllObjectsByProperty')('carrera', $scope.alumno_filter.carrera, $scope.data_alumnos.data);
            } else {
                filter = $scope.data_alumnos.data;
            }
            filter = $filter('filter')(filter, {appat: searchParams.appat});
            filter = $filter('filter')(filter, {apmat: searchParams.apmat});
            filter = $filter('filter')(filter, {nom: searchParams.nom});
            filter = $filter('filter')(filter, {matricula: searchParams.matricula});
            $scope.data_alumnos = {
                data: []
            };
            $scope.data_alumnos.data = filter;
            //console.log(filter);
//            $scope.bigTotalItems = filter.length;
//            $scope.bigCurrentPage = 1;

//            filter = $filter('getAllObjectsByProperty')('appat', searchParams.apellido_paterno, filter);
//            filter = $filter('getAllObjectsByProperty')('apmat', searchParams.apellido_materno, filter);
//            filter = $filter('getAllObjectsByProperty')('nom', searchParams.nombre, filter);
//            filter = $filter('getAllObjectsByProperty')('matricula', searchParams.matricula, filter);
            //console.log(filter);
            //render_table();
            //$scope.make_filters();
            //filter = $filter('getAllObjectsByProperty')('carrera', searchParams, filter);
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

UPapp.controller('Modal_conceptosCtrl', function ($scope, adminService) {
    $scope.isBusy = true;
    $scope.new_sc = [];
    $scope.subconceptos = [];
    $scope.model = [];
    $scope.tipo_adeudo = [{
            name: 'Monetario', value: 1}, {
            name: 'No Monetario', value: 2
        }];
    $scope.new_sc.tipo_adeudo = $scope.tipo_adeudo[0];
    adminService.getPeriodos().then(function (data) {
        $scope.periodos = data;
        data.forEach(function (val, key) {
            if (val.actual == 1) {
                $scope.model.periodo = $scope.periodos[key];
            }
        });
        adminService.getNiveles().then(function (data) {
            $scope.niveles = data.respuesta.data;
            $scope.model.nivel = Object.keys(data.respuesta.data)[0];
            $scope.getSubConceptos();
        });

    }, function (err) {
    });
    $scope.getSubConceptos = function () {
        $scope.$parent.isBusy = true;
        adminService.getSubConceptos($scope.data_modal.id, $scope.model.periodo.idperiodo, $scope.model.nivel).then(function (data) {
            $scope.$parent.isBusy = false;
            if (!data.error) {
                var arr_length = data.respuesta.data.length;
                if (arr_length >= 1) {
                    $scope.subconceptos = data.respuesta.data;
                    $scope.alerts = [];
                } else {
                    $scope.subconceptos = [];
                    $scope.alerts = [
                        {type: 'danger', msg: 'No Existe ningun Subconcepto para este ciclo'}
                    ];
                }
            }

        });
    };
    $scope.Nuevo_Subconcepto = function () {
        $scope.$parent.isBusy = true;
        $scope.new_sc.nivel_id = $scope.model.nivel;
        $scope.new_sc.periodo = $scope.model.periodo.idperiodo;
        $scope.new_sc.conceptos_id = $scope.data_modal.id;
        $scope.new_sc.tipo_adeudo_id = $scope.new_sc.tipo_adeudo.value;
//        console.log($scope.new_sc);
        adminService.addSubConcepto($scope.new_sc).then(function (data) {
            $scope.$parent.isBusy = false;
            if (!data.error) {
                $scope.subconceptos.push(data.respuesta);
                $scope.alerts = [];
            }
        });
    };
    $scope.delete_sc = function (id) {
        $scope.$parent.isBusy = true;
        adminService.DeleteSubConcepto(id).then(function (data) {
            $scope.$parent.isBusy = false;
            if (!data.error) {
                $scope.getSubConceptos();
            }
        });
    };
});




UPapp.controller('Modal_ConsultarAdeudosDescuentos', function ($scope, adminService, $modal) {
    $scope.model = [];
    $scope.isBusy = true;
    adminService.getPeriodos().then(function (data) {
        $scope.isBusy = false;
        $scope.$parent.isBusy = true;
        $scope.periodos = data;
        data.forEach(function (val, key) {
            if (val.actual == 1) {
                $scope.model.periodo = $scope.periodos[key];
            }
        });
        $scope.getAdeudos();
    }, function (err) {
    });
    $scope.getAdeudos = function () {
        $scope.isBusy = true;
        console.log($scope.model.periodo);
        adminService.getAdeudosAlumnoNew($scope.$parent.data_modal.idpersonas, $scope.model.periodo.idperiodo).then(function (data) {
            console.log(data);
            $scope.isBusy = false;
            if (data.respuesta) {
                $scope.adeudos_alumno = data.respuesta;
            } else {
                $scope.adeudos_alumno = false;
            }
        }, function (err) {
        });
    };

    $scope.generar_Descuento = function (html, adeudo) {
        var SearchInstance = $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'md',
            resolve: {
                custom_data: function () {
                    return adeudo;
                }
            }
        });

//        SearchInstance.result.then(function (searchParams) {
//            console.log(searchParams);
//            if ($scope.alumno_filter.carrera) {
//                filter = $filter('getAllObjectsByProperty')('carrera', $scope.alumno_filter.carrera, $scope.alumnos);
//            } else {
//                filter = $scope.alumnos;
//            }
//            filter = $filter('filter')(filter, {appat: searchParams.appat});
//            filter = $filter('filter')(filter, {apmat: searchParams.apmat});
//            filter = $filter('filter')(filter, {nom: searchParams.nom});
//            filter = $filter('filter')(filter, {matricula: searchParams.matricula});
//            console.log(filter);
//            $scope.bigTotalItems = filter.length;
//            $scope.bigCurrentPage = 1;

//            filter = $filter('getAllObjectsByProperty')('appat', searchParams.apellido_paterno, filter);
//            filter = $filter('getAllObjectsByProperty')('apmat', searchParams.apellido_materno, filter);
//            filter = $filter('getAllObjectsByProperty')('nom', searchParams.nombre, filter);
//            filter = $filter('getAllObjectsByProperty')('matricula', searchParams.matricula, filter);
        //console.log(filter);
        //render_table();
        //$scope.make_filters();
        //filter = $filter('getAllObjectsByProperty')('carrera', searchParams, filter);
        //});
    };

});

//Modal_DescuentoAdeudo
UPapp.controller('Modal_DescuentoAdeudo', function ($scope, adminService) {
    $scope.model = [];
    adminService.getCatalogos().then(function (data) {
        if (data.respuesta.data) {
            $scope.model.subcidios_id = 1;
            $scope.catalogos = data.respuesta.data;
            $scope.model.tipo_importe_id = $scope.catalogos.tipo_importe[1].id;
        }
    });

    $scope.add_descuento = function () {
//        console.log($scope.model.tipo_importe_id);
//        console.log($scope.$parent.data_modal.id);
//        console.log($scope.model.importe);
        adminService.addDescuento($scope.model.tipo_importe_id, $scope.$parent.data_modal.id, $scope.model.importe).then(function (data) {
            if (data.respuesta.data) {
                $scope.model.subcidios_id = 1;
                $scope.catalogos = data.respuesta.data;
                $scope.model.tipo_importe_id = $scope.catalogos.tipo_importe[1].id;
            }
        });
    };
});

UPapp.controller('Modal_Administrar_becas', function ($scope, adminService, $modal) {
    var BTemp = false;
    $scope.isBusy = true;
    adminService.getBecas().then(function (data) {
        $scope.isBusy = false;
        if (data.respuesta.data) {
            $scope.becas = data.respuesta.data;
        }
    }, function (err) {
    });

    $scope.Modificar = function (html, data, idx) {
        BTemp = idx;
        $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'md',
            resolve: {
                custom_data: function () {
                    return data;
                }
            }
        });
    };
    $scope.Eliminar = function (bid) {
        adminService.DeleteBeca(bid).then(function (data) {
            $scope.becas = data.respuesta.data;
        });
    };
    $scope.AlumnosBeca = function (html, dbeca) {
        $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                custom_data: function () {
                    return dbeca;
                }
            }
        });
    };
    $scope.$on('modal_response', function (event, args) {
        if (args.modificado) {
            $scope.becas[BTemp] = args.data;
        } else {
            $scope.becas.push(args);
        }
    });
});


UPapp.controller('Modal_NewBeca', function ($scope, adminService, $rootScope) {
    $scope.model = [];
    adminService.getCatalogos().then(function (data) {
        if (data.respuesta.data) {
            $scope.model.subcidios_id = 1;
            $scope.catalogos = data.respuesta.data;
            $scope.model.tipo_importe_id = $scope.catalogos.tipo_importe[1].id;
        }
    });
    $scope.addNewBeca = function () {
        $scope.$parent.isBusy = true;
        adminService.addNuevaBeca($scope.model).then(function (data) {
            $scope.$parent.isBusy = false;
            if (data.respuesta.data) {
                $rootScope.$broadcast('custom_response', data.respuesta.data);
            }
        });
    };
});


function contains(src, value, except) {
    var key;
    switch (typeof src) {
        case 'string':
        case 'number':
        case 'boolean':
            return String(src).indexOf(value) > -1;
        case 'object':
            except = except || [];
            for (key in src) {
                if (src.hasOwnProperty(key) &&
                        except.indexOf(key) < 0 &&
                        contains(src[key], value, except)
                        ) {
                    return true;
                }
            }
    }
    return false;
}