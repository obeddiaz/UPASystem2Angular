UPapp.controller('Administracion_Generales_becas', function ($scope, adminService, $modal) {
    $scope.Posteriores = function (html) {
        $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
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
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
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
//    $scope.columns = [
//        {m_select: true, field: "apellido_paterno", title: "Apellido Paterno", width: 200, groupable: false},
//        {m_select: true, field: "apellido_materno", title: "Apellido Materno", width: 200, groupable: false},
//        {m_select: true, field: "beca", title: "Beca", width: 200, groupable: false},
//        {m_select: true, field: "carrera", title: "Carrera", width: 200},
//        {m_select: false, field: "clave", title: "Clave", width: 200, groupable: false},
//        {m_select: false, field: "descuento", title: "Descuento", width: 200, groupable: false},
//        {m_select: false, field: "fecha_limite", title: "Fecha Limite", width: 200},
//        {m_select: false, field: "importe", title: "Importe", width: 200},
//        {m_select: false, field: "matricula", title: "Matricula", width: 200},
//        {m_select: false, field: "nombre", title: "Nombre", width: 200, groupable: false},
//        {m_select: false, field: "recargo", title: "Recargo", width: 200, groupable: false},
//        {m_select: false, field: "total", title: "Total", width: 100},
//        {m_select: false, field: "sub_concepto", title: "Sub Concepto", width: 200, aggregates: ["count", "sum"], groupHeaderTemplate: "#= value # | Adeudos: #= count# | Total Importe: #=test_function(value,\"importe\")# | Total: #=test_function(value,\"rtotal\")# | Total Descuentos: #=test_function(value,\"descuento\")# | | Total Beca: #=test_function(value,\"beca\")#"},
//        {m_select: false, field: "sub_concepto_id", title: "ID SubConcetpo", width: 100},
//        {m_select: false, field: "periodo", title: "Periodo"}
//    ];

    $scope.columns = [
        {m_select: true, field: "abreviatura", title: "Abreviatura", width: 200},
        {m_select: true, field: "descripcion", title: "Descripcion", width: 200},
        {m_select: true, field: "matricula", title: "Matricula", width: 150, groupable: false},
        {m_select: true, field: "nom", title: "Nombre", width: 200, groupable: false},
        {m_select: true, field: "appat", title: "Apellido Paterno", width: 200, groupable: false},
        {m_select: true, field: "apmat", title: "Apellido Materno", width: 200, groupable: false},
        {m_select: true, field: "apmat", title: "Apellido Materno", width: 200, groupable: false},
        {m_select: true, field: "carrera", title: "Carrera", width: 100},
        {m_select: true, field: "grado", title: "Grado", width: 50, groupable: false},
        {m_select: true, field: "grupo", title: "Grupo", width: 50, groupable: false},
        {m_select: true, field: "periodo", title: "Periodo", width: 150},
        {m_select: true, field: "tipo_cobro", title: "Tipo Cobro", width: 150}
    ];

    /*abreviatura: "BECA100"
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
        }

    };

    $scope.obtener_becas_periodo = function () {
        console.log($scope.model.periodo.idperiodo);
        $scope.isBusy = true;
        adminService.getAlumnosBecaPeriodo($scope.model.periodo.idperiodo)
                .then(function (data) {
                    $scope.isBusy = false;
                    $scope.data_alumnos = {
                        data: [],
                        pageSize: 20
                    };
                    $scope.data_alumnos.data = data.respuesta.data;
                    console.log(data);
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
                pageSize: 20
            };

        });
    };

});


