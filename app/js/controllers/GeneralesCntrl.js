UPapp.controller('Administracion_Generales_becas', function ($scope, adminService, $modal) {
    $scope.Posteriores = function (html) {
        $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html?ver='+app_version,
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                custom_data: function () {
                    return false;
                }
            }
        });
    };
    $scope.NuevaBeca = function (html) {
        $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html?ver='+app_version,
            controller: 'ModalInstanceCtrl',
            size: 'md',
            resolve: {
                custom_data: function () {
                    return false;
                }
            }
        });
    };
    $scope.model_file = [];
    $scope.upload_xls_file = function () {
        $scope.isBusy = true;
        adminService.addBecasByFile($scope.model_file.file).then(function (data) {
            $scope.isBusy = false;
            //console.log(data);
            $scope.alerts = [
                {type: 'success', msg: 'Los Becas del archivo fueron validados correctamente.'}
            ];
        });
    };
});

UPapp.controller('Administracion_Generales_reporte_becas', function ($scope, adminService, $modal) {
    $scope.model = [];
    $scope.carreras = [];
    $scope.sub_conceptos = [];
    $scope.descripcion_sc = [];
    $scope.sort_reporte = [];
    $scope.sort_title = [];
    $scope.format = 'dd-MMMM-yyyy';
    var adeudos = [];
    var key_service;

    $scope.isBusy = true;
    var found = [];
    adminService.getPeriodos().then(function (data) {
        $scope.isBusy = false;
        $scope.periodos = data;
        data.forEach(function (val, key) {
            if (val.actual == 1) {
                $scope.model.periodo = $scope.periodos[key];
            }
        });
    }, function (err) {
    });
    $scope.$watchCollection('model.fecha_desde', function (newNames, oldNames) {
        $scope.minDate = $scope.minDate ? null : newNames;
    });
    $scope.openfrom = function ($event) {
        $scope.model.datefrom = [];
        $event.preventDefault();
        $event.stopPropagation();
        $scope.model.datefrom.opened = true;
    };
    $scope.opento = function ($event) {
        $scope.model.dateto = [];
        $event.preventDefault();
        $event.stopPropagation();
        $scope.model.dateto.opened = true;
    };


    $scope.make_filters = function () {
        $scope.found = $filter('getAllObjectsBySubProperty')('adeudos', 'descripcion_sc', $scope.model.filter.descripcion_sc, angular.copy($scope.adeudos));
        $scope.found = $filter('getAllObjectsBySubProperty')('adeudos', 'sub_concepto', $scope.model.filter.sub_concepto, $scope.found);
        $scope.found = $filter('getAllObjectsByProperty')('carrera', $scope.model.filter.carrera, $scope.found);

        render_excel_table();
    };

    $scope.columns = [
        {m_select: true, field: "asignada_por", title: "Asignada Por", width: 200},
        {m_select: true, field: "importe", title: "Monto", width: 200},
        {m_select: true, field: "tipo_cobro", title: "Tipo Monto", width: 150},
        {m_select: true, field: "abreviatura", aggregates: ["count"],groupHeaderTemplate: "Beca: #= value # (Cantidad: #= count#)", title: "Beca", width: 150,
            filterable: {
                ui: function (element) {
                    element.removeAttr("data-bind");
                    element.kendoMultiSelect({
                        dataSource: $scope.filters_dd.abreviatura,
                        change: function (e) {
                            var filter = {logic: "or", filters: []};
                            var values = this.value();
                            angular.forEach(values, function (v) {
                                filter.filters.push({field: "abreviatura", operator: "eq", value: v});
                            });
                            $scope.data_alumnos.filter(filter);
                        }
                    });
                },
                extra: false
            }},
        {m_select: true, field: "descripcion", aggregates: ["count"],groupHeaderTemplate: "Descripcion Beca: #= value # (Cantidad: #= count#)", title: "Descripcion Beca", width: 200,
            filterable: {
                ui: function (element) {
                    element.removeAttr("data-bind");
                    element.kendoMultiSelect({
                        dataSource: $scope.filters_dd.descripcion,
                        change: function (e) {
                            var filter = {logic: "or", filters: []};
                            var values = this.value();
                            angular.forEach(values, function (v) {
                                filter.filters.push({field: "descripcion", operator: "eq", value: v});
                            });
                            $scope.data_alumnos.filter(filter);
                        }
                    });
                },
                extra: false
            }},
        {m_select: true, field: "matricula", title: "Matricula", width: 150,
            filterable: {
                ui: function (element) {
                    element.removeAttr("data-bind");
                    element.kendoMultiSelect({
                        dataSource: $scope.filters_dd.matricula,
                        change: function (e) {
                            var filter = {logic: "or", filters: []};
                            var values = this.value();
                            angular.forEach(values, function (v) {
                                filter.filters.push({field: "matricula", operator: "eq", value: v});
                            });
                            $scope.data_alumnos.filter(filter);
                        }
                    });
                },
                extra: false
            }},
        {m_select: true, field: "nom", title: "Nombre", width: 200},
        {m_select: true, field: "appat", title: "Apellido Paterno", width: 200},
        {m_select: true, field: "apmat", title: "Apellido Materno", width: 200},
        {m_select: true, field: "carrera", title: "Carrera", width: 100,
            filterable: {
                ui: function (element) {
                    element.removeAttr("data-bind");
                    element.kendoMultiSelect({
                        dataSource: $scope.filters_dd.carrera,
                        change: function (e) {
                            var filter = {logic: "or", filters: []};
                            var values = this.value();
                            angular.forEach(values, function (v) {
                                filter.filters.push({field: "carrera", operator: "eq", value: v});
                            });
                            $scope.data_alumnos.filter(filter);
                        }
                    });
                },
                extra: false
            }},
        {m_select: true, field: "grado", title: "Grado", width: 50},
        {m_select: true, field: "grupo", title: "Grupo", width: 50},
        {m_select: true, field: "periodo", title: "Periodo", width: 150},
        {m_select: true, field: "cancelada_por", title: "Cancelada Por", width: 200},
        {m_select: true, field: "cancelada_fecha", title: "Fecha Cancelacion", width: 200},
        {m_select: true, field: "cancelada_motivo", title: "Motivo Cancelacion", width: 200}
    ];

    /*
     *  $scope.filters_dd = {
     "carrera": [],
     "descripcion": [],
     "abreviatura": [],
     "matricula": []
     };
     * 
     * 
     * abreviatura: "BECA100"
     apmat: "MAGDALENO"
     appat: "MARTÍNEZ"
     carrera: "INGENIERÍA INDUSTRIAL"
     clave: "IND06B"
     created_at: "2014-11-27 21:10:23"
     curp: "MAML950324MASRGR09"
     descripcion: "BECA DEPORTIVA 100%"
     estatus_admin: "ACTIVO"
     fecha_nac: "1995-03-24"
     grado: "6"
     grupo: "B"
     id: 4
     idperiodo: "153"
     idpersonas: "5915"
     importe: 100
     matricula: "UP130549"
     nc: "IND"
     nom: "LAURA IMELDA"
     pe: "2010"
     periodo: 153
     subcidios_id: 1
     tipo_cobro: "PORCENTAJE"
     tipo_importe_id: 1
     tipobeca: null
     updated_at: "2014-11-27 21:10:23"
     */


    $scope.test_function = function (test) {
        console.log(test);
    };
    $scope.mainGridOptions = {
        toolbar: ["excel"],
        excel: {
            allPages: true
        },
        columnMenu: true,
        selectable: "multiple cell",
        allowCopy: true,
        sortable: true,
        reorderable: true,
        filterable: {
            messages: {
                info: "Elementos con valor que: ",
                and: "Y",
                or: "O",
                filter: "Aplicar Filtros",
                clear: "Limpiar Filtros"
            },
            operators: {
                string: {
                    eq: "Igual a",
                    startswith: "Empieza Con",
                    contains: "Contiene",
                    neq: "No Igaul a",
                    doesnotcontain: "No Contiene",
                    endswith: "Termina Con"
                },
                number: {
                    eq: "Igual a",
                    startswith: "Empieza Con",
                    contains: "Contiene",
                    neq: "No Igaul a",
                    doesnotcontain: "No Contiene",
                    endswith: "Termina Con"
                }
            }
        },
        messages: {
            commands: {
                excel: "Exportar Excel"
            }
        },
        groupable: {
            messages: {
                empty: "Arrastra columnas para Agrupar"
            },
            showFooter: true
        },
        scrollable: {
            virtual: true
        },
        height: 543,
        pageable: {
            info: true,
            numeric: false,
            previousNext: false
        },
        columnMenu: {
            messages: {
                sortAscending: "Ascendente",
                sortDescending: "Descendente",
                filter: "Filtrar",
                columns: "Columnas"
            }
        }

    };
    $scope.filters_dd = {
        "carrera": [],
        "descripcion": [],
        "abreviatura": [],
        "matricula": []
    };

    $scope.obtener_becas_periodo = function () {
        console.log($scope.model.periodo.idperiodo);
        $scope.isBusy = true;
        adminService.getAlumnosBecaPeriodo($scope.model.periodo.idperiodo)
                .then(function (data) {
                    $scope.isBusy = false;

                    angular.forEach(data.respuesta.data, function (v, k) {
                        if ($scope.filters_dd.carrera.indexOf(v.carrera) == -1) {
                            if (v.carrera !== null) {
                                $scope.filters_dd.carrera.push(v.carrera);
                            }
                        }
                        if ($scope.filters_dd.descripcion.indexOf(v.descripcion) == -1) {
                            if (v.carrera !== null) {
                                $scope.filters_dd.descripcion.push(v.descripcion);
                            }
                        }
                        if ($scope.filters_dd.abreviatura.indexOf(v.abreviatura) == -1) {
                            if (v.abreviatura !== null) {
                                $scope.filters_dd.abreviatura.push(v.abreviatura);
                            }
                        }
                        if ($scope.filters_dd.matricula.indexOf(v.matricula) == -1) {
                            if (v.matricula !== null) {
                                $scope.filters_dd.matricula.push(v.matricula);
                            }
                        }
                    });
                    $scope.data_alumnos = new kendo.data.DataSource({
                        data: data.respuesta.data,
                        pageSize: 20,
                        aggregate: [
                            {field: "abreviatura", aggregate: "count"},
                            {field: "descripcion", aggregate: "count"}
                        ]
                    });
                });
    };

    $scope.obtener_adeudos_periodo = function () {
        $scope.isBusy = true;
        $scope.model.status = 0;
        adminService.getAdeudosReporteOrdenadoPeriodo($scope.model).then(function (data) {
            $scope.isBusy = false;
            $scope.datos_filtros = [];
            key_service = data.respuesta.data.key;
            console.log(data);
            $scope.data_alumnos = {
                data: [],
                pageSize: 20, aggregate: [
                    {field: "beca", aggregate: "sum"},
                    {field: "descuento", aggregate: "sum"},
                    {field: "recargo", aggregate: "sum"},
                    {field: "total", aggregate: "sum"},
                    {field: "importe", aggregate: "sum"}
                ]
            };

            /*
             * 
             *  {m_select: true, field: "abreviatura", title: "Abreviatura", width: 200},
             {m_select: true, field: "descripcion", title: "Descripcion", width: 200},
             {m_select: true, field: "matricula", title: "Matricula", width: 150, groupable: false},
             {m_select: true, field: "nom", title: "Nombre", width: 200, groupable: false},
             {m_select: true, field: "appat", title: "Apellido Paterno", width: 200, groupable: false},
             {m_select: true, field: "apmat", title: "Apellido Materno", width: 200, groupable: false},
             {m_select: true, field: "carrera", title: "Carrera", width: 100},
             {m_select: true, field: "grado", title: "Grado", width: 50, groupable: false},
             {m_select: true, field: "grupo", title: "Grupo", width: 50, groupable: false},
             {m_select: true, field: "periodo", title: "Periodo", width: 150},
             {m_select: true, field: "tipo_cobro", title: "Tipo Cobro", width: 150}
             */

        });
    };

});


