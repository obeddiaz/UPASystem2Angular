UPapp.controller('Administracion_Generales', function ($scope) {
    $scope.tabs = [
        {title: 'Planes de Pago', click: 'planes_de_pago'},
        {title: 'Registro de Pago', click: 'registro_de_pago'},
        {title: 'Conceptos', click: 'conceptos'},
        {title: 'Bancos', click: 'bancos'},
        //{title: 'Recursamiento', click: 'single_adeudo'},
        {title: 'Archivo Referencias', click: 'subir_referencias'},
        {title: 'Becas', click: 'becas'},
        {title: 'Reporte Becas', click: 'reporte_becas'},
        {title: 'Reporte Adeudos', click: 'reporte_adeudos'},
        {title: 'Reporte Pagos', click: 'reporte_pagos'},
        {title: 'Traducir Referencia', click: 'referencias'},
        {title: 'Descuentos', click: 'descuentos'}
    ];
    $scope.active = 'planes_de_pago';
    $scope.subPageTemplate = 'partials/administrador/administracion/generales/planes_de_pago.html';
    $scope.subPageContent = function (page) {
        $scope.active = page;
        $scope.subPageTemplate = 'partials/administrador/administracion/generales/' + page + '.html';
    };
});

UPapp.controller('Administracion_Generales_planes_pago', function ($scope, $routeParams, adminService, $modal) {
    var BTemp = false;
    waitingDialog.show();
    adminService.getPlanesPago().then(function (data) {
        waitingDialog.hide();
        $scope.planes = data;
    }, function (err) {
        waitingDialog.hide();
    });
    $scope.Eliminar = function (id) {
        adminService.deletePlanePago(id).then(function (data) {
            if (data.respuesta.data) {
                $scope.planes = data.respuesta.data;
            }
        });
    };
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
    $scope.$on('modal_response', function (event, args) {
        if (args.modificado) {
            $scope.planes[BTemp] = args.data;
        } else {
            $scope.planes.push(args);
        }
    });
    $scope.open = function (data, html) {
        $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                custom_data: function () {
                    return data;
                }
            }
        });
    };
    $scope.Nuevo_Plan = function (html) {
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
});

UPapp.controller('Administracion_Generales_reporte_pagos', function ($scope, $routeParams, adminService, $filter, $window) {
    $scope.model = [];
    $scope.carreras = [];
    $scope.carreras_data = [];
    $scope.ap_pat_data = [];
    $scope.ap_mat_data = [];
    $scope.sc_data = [];
    $scope.filters_dd = {
        "apellido_paterno": [],
        "apellido_materno": [],
        "beca": [],
        "carrera": [],
        "clave": [],
        "descuento": [],
        "descuento_recargo": [],
        "fecha_limite": [],
        "fecha_pago": [],
        "importe": [],
        "matricula": [],
        "nombre": [],
        "recargo": [],
        "total": [],
        "sub_concepto": [],
        "concepto": [],
        "sub_concepto_id": [],
        "ciclo": [],
        "periodo": []
    };
    $scope.filters_data = {
        "concepto": [],
        "sub_concepto": [],
        "importe": [],
        "recargo": [],
        "beca": [],
        "descuento": [],
        "descuento_recargo": [],
        "total": [],
        "matricula": [],
        "carrera": [],
        "clave": [],
        "fecha_limite": [],
        "fecha_pago": [],
        "sub_concepto_id": [],
        "periodo": []
    };
    $scope.sub_conceptos = [];
    $scope.descripcion_sc = [];
    $scope.sort_reporte = [];
    $scope.sort_title = [];
    $scope.format = 'dd-MMMM-yyyy';
    var adeudos = [];
    var key_service;
    $scope.p_byid = {};
    $scope.isBusy = true;
    var found = [];
    adminService.getPeriodos().then(function (data) {
        $scope.isBusy = false;
        $scope.periodos = data;
        data.forEach(function (val, key) {
            $scope.p_byid[val.idperiodo] = val.periodo;
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
    var _readycols = function () {
        $scope.columns = [
            {field: "concepto", title: "Concepto", width: 100,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.concepto,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "concepto", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "sub_concepto", title: "Sub Concepto", width: 200,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.sub_concepto,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "sub_concepto", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "importe", title: "Importe", width: 200, aggregates: ["sum"], footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#",
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.importe,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "importe", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "recargo", title: "Recargo", width: 200, aggregates: ["sum"], footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#",
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.recargo,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "recargo", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "beca", title: "Beca", width: 200, aggregates: ["sum"], footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#",
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.beca,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "beca", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "descuento", title: "Descuento", width: 200, footerTemplate: "#=sum#", aggregates: ["sum"], groupFooterTemplate: "#=sum#",
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.descuento,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "descuento", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "descuento_recargo", title: "Descuento Recargos", width: 200, aggregates: ["sum"], footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#",
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.descuento_recargo,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "descuento_recargo", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "total", title: "Total", width: 100, aggregates: ["sum"], footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#",
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.total,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "total", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "matricula", title: "Matricula", width: 200, hidden: true,
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
            {field: "nombre", title: "Nombre", width: 200, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.nombre,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "nombre", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "apellido_paterno", title: "Apellido Paterno", width: 200, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.apellido_paterno,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "apellido_paterno", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "apellido_materno", title: "Apellido Materno", width: 200, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.apellido_materno,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "apellido_materno", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "carrera", title: "Carrera", width: 200, hidden: true,
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
            {field: "clave", title: "Clave", width: 200, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.clave,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "clave", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "fecha_limite", title: "Fecha Limite", width: 200, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.fecha_limite,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "fecha_limite", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "fecha_pago", title: "Fecha Pago", width: 200, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.fecha_pago,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "fecha_pago", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "sub_concepto_id", title: "ID SubConcetpo", width: 100, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.sub_concepto_id,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "sub_concepto_id", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "ciclo", title: "Ciclo", width: 100, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.ciclo,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "ciclo", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "periodo", title: "Periodo", width: 150, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.periodo,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "periodo", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }}
        ];
    };
    $scope.to_hide = [];
    $scope.data_alumnos = [];

    $scope.mainGridOptions = {
        dataSource: $scope.data_alumnos,
        toolbar: ["excel"],
        excel: {
            fileName: "Reporte Pagos.xlsx",
            allPages: true,
            filterable: true
        },
        columnMenu: true,
        selectable: "multiple cell",
        allowCopy: true,
        sortable: true,
        reorderable: true,
//        dataBinding: function (e) {
//            console.log("dataBinding");
//            angular.forEach(e.sender.options.dataSource._group, function (v, k) {
//                angular.forEach($scope.columns, function (v1, k1) {
//                    if (v.field == v1.field) {
//                        $scope.columns[k1].hidden = true;
//                    }
//                });
//            });
//        },
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
        height: 800,
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
    $scope.obtener_adeudos = function () {
        //console.log($scope.model);
        $scope.isBusy = true;
        $scope.model.status = 1;
        adminService.getAdeudosReporteOrdenado($scope.model).then(function (data) {
            $scope.isBusy = false;
            $scope.datos_filtros = [];
            key_service = data.respuesta.data.key;
            console.log($scope.data_alumnos);
            data_alumnos = [];
            angular.forEach(data.respuesta.data.periodos, function (v, k) {
                if (!isNaN(k)) {
                    angular.forEach(v.subconceptos, function (v1, k1) {
                        if (!isNaN(k1)) {
                            angular.forEach(v1.adeudo_info, function (v2, k2) {
                                if (!isNaN(k2)) {
                                    if ($scope.filters_dd.apellido_paterno.indexOf(v2["apellido paterno"]) == -1) {
                                        if (v2["apellido paterno"] !== null) {
                                            $scope.filters_dd.apellido_paterno.push(v2["apellido paterno"]);
                                        }
                                    }
                                    if ($scope.filters_dd.apellido_materno.indexOf(v2["apellido materno"]) == -1) {
                                        if (v2["apellido materno"] !== null) {
                                            $scope.filters_dd.apellido_materno.push(v2["apellido materno"]);
                                        }
                                    }
                                    if ($scope.filters_dd.beca.indexOf(v2.beca) == -1) {
                                        if (v2.beca !== null) {
                                            $scope.filters_dd.beca.push(v2.beca);
                                        }
                                    }
                                    if ($scope.filters_dd.carrera.indexOf(v2.carrera) == -1) {
                                        if (v2.carrera !== null) {
                                            $scope.filters_dd.carrera.push(v2.carrera);
                                        }
                                    }
                                    if ($scope.filters_dd.clave.indexOf(v2.clave) == -1) {
                                        if (v2.clave !== null) {
                                            $scope.filters_dd.clave.push(v2.clave);
                                        }
                                    }
                                    if ($scope.filters_dd.descuento.indexOf(v2.descuento) == -1) {
                                        if (v2.descuento !== null) {
                                            $scope.filters_dd.descuento.push(v2.descuento);
                                        }
                                    }
                                    if ($scope.filters_dd.descuento_recargo.indexOf(v2.descuento_recargo) == -1) {
                                        if (v2.descuento_recargo !== null) {
                                            $scope.filters_dd.descuento_recargo.push(v2.descuento_recargo);
                                        }
                                    }
                                    if ($scope.filters_dd.fecha_limite.indexOf(v2.fecha_limite) == -1) {
                                        if (v2.fecha_limite !== null) {
                                            $scope.filters_dd.fecha_limite.push(v2.fecha_limite);
                                        }
                                    }
                                    if ($scope.filters_dd.fecha_pago.indexOf(v2.fecha_pago) == -1) {
                                        if (v2.fecha_pago !== null) {
                                            $scope.filters_dd.fecha_pago.push(v2.fecha_pago);
                                        }
                                    }
                                    if ($scope.filters_dd.importe.indexOf(v2.importe) == -1) {
                                        if (v2.importe !== null) {
                                            $scope.filters_dd.importe.push(v2.importe);
                                        }
                                    }
                                    if ($scope.filters_dd.matricula.indexOf(v2.matricula) == -1) {
                                        if (v2.matricula !== null) {
                                            $scope.filters_dd.matricula.push(v2.matricula);
                                        }
                                    }
                                    if ($scope.filters_dd.nombre.indexOf(v2.nombre) == -1) {
                                        if (v2.nombre !== null) {
                                            $scope.filters_dd.nombre.push(v2.nombre);
                                        }
                                    }
                                    if ($scope.filters_dd.recargo.indexOf(v2.recargo) == -1) {
                                        if (v2.recargo !== null) {
                                            $scope.filters_dd.recargo.push(v2.recargo);
                                        }
                                    }
                                    if ($scope.filters_dd.total.indexOf(v2.total) == -1) {
                                        if (v2.total !== null) {
                                            $scope.filters_dd.total.push(v2.total);
                                        }
                                    }
                                    if ($scope.filters_dd.sub_concepto.indexOf(v1.sub_concepto) == -1) {
                                        if (v1.sub_concepto !== null) {
                                            $scope.filters_dd.sub_concepto.push(v1.sub_concepto);
                                        }
                                    }
                                    if ($scope.filters_dd.concepto.indexOf(v2.concepto) == -1) {
                                        if (v2.concepto !== null) {
                                            $scope.filters_dd.concepto.push(v2.concepto);
                                        }
                                    }

                                    if ($scope.filters_dd.sub_concepto_id.indexOf(v1.sub_concepto_id) == -1) {
                                        if (v1.sub_concepto_id !== null) {
                                            $scope.filters_dd.sub_concepto_id.push(v1.sub_concepto_id);
                                        }
                                    }
                                    if ($scope.filters_dd.ciclo.indexOf(v.periodo) == -1) {
                                        if (v.periodo !== null) {
                                            $scope.filters_dd.ciclo.push(v.periodo);
                                        }
                                    }
                                    if ($scope.filters_dd.periodo.indexOf($scope.p_byid[v.periodo]) == -1) {
                                        if ($scope.p_byid[v.periodo] !== null) {
                                            $scope.filters_dd.periodo.push($scope.p_byid[v.periodo]);
                                        }
                                    }

                                    data_alumnos.push({
                                        "apellido_paterno": v2["apellido paterno"],
                                        "apellido_materno": v2["apellido materno"],
                                        "beca": v2.beca,
                                        "carrera": v2.carrera,
                                        "clave": v2.clave,
                                        "descuento": v2.descuento,
                                        "descuento_recargo": v2.descuento_recargo,
                                        "fecha_limite": v2.fecha_limite,
                                        "fecha_pago": v2.fecha_pago,
                                        "importe": v2.importe,
                                        "matricula": v2.matricula,
                                        "nombre": v2.nombre,
                                        "recargo": v2.recargo,
                                        "total": v2.total,
                                        "sub_concepto": v1.sub_concepto,
                                        "concepto": v2.concepto,
                                        "sub_concepto_id": v1.sub_concepto_id,
                                        "ciclo": v.periodo,
                                        "periodo": $scope.p_byid[v.periodo]
                                    });
                                }
                            });
                        }
                    });
                }
            });
            $scope.data_alumnos = new kendo.data.DataSource({
                data: data_alumnos,
                pageSize: 30,
                schema: {
                    model: {
                        periodo: function () {
                            console.log(this.get("ciclo"));
                            return this.get("ciclo");
                        },
                        fields: {
                            total: {type: "number"},
                            beca: {type: "number"},
                            descuento: {type: "number"},
                            descuento_recargo: {type: "number"},
                            recargo: {type: "number"},
                            importe: {type: "number"}
                        }
                    }
                },
                aggregate: [
                    {field: "beca", aggregate: "sum"},
                    {field: "descuento", aggregate: "sum"},
                    {field: "descuento_recargo", aggregate: "sum"},
                    {field: "recargo", aggregate: "sum"},
                    {field: "total", aggregate: "sum"},
                    {field: "importe", aggregate: "sum"}
                ]
            });
            _readycols();
        });
    };

    var data_alumnos = [];
    $scope.obtener_adeudos_periodo = function () {
        $scope.isBusy = true;
        $scope.model.status = 1;
        adminService.getAdeudosReporteOrdenadoPeriodo($scope.model).then(function (data) {
            $scope.isBusy = false;
            $scope.datos_filtros = [];
            key_service = data.respuesta.data.key;
            data_alumnos = [];
            angular.forEach(data.respuesta.data.periodos, function (v, k) {
                if (!isNaN(k)) {
                    angular.forEach(v.subconceptos, function (v1, k1) {
                        if (!isNaN(k1)) {
                            angular.forEach(v1.adeudo_info, function (v2, k2) {
                                if (!isNaN(k2)) {
                                    if ($scope.filters_dd.apellido_paterno.indexOf(v2["apellido paterno"]) == -1) {
                                        if (v2["apellido paterno"] !== null) {
                                            $scope.filters_dd.apellido_paterno.push(v2["apellido paterno"]);
                                        }
                                    }
                                    if ($scope.filters_dd.apellido_materno.indexOf(v2["apellido materno"]) == -1) {
                                        if (v2["apellido materno"] !== null) {
                                            $scope.filters_dd.apellido_materno.push(v2["apellido materno"]);
                                        }
                                    }
                                    if ($scope.filters_dd.beca.indexOf(v2.beca) == -1) {
                                        if (v2.beca !== null) {
                                            $scope.filters_dd.beca.push(v2.beca);
                                        }
                                    }
                                    if ($scope.filters_dd.carrera.indexOf(v2.carrera) == -1) {
                                        if (v2.carrera !== null) {
                                            $scope.filters_dd.carrera.push(v2.carrera);
                                        }
                                    }
                                    if ($scope.filters_dd.clave.indexOf(v2.clave) == -1) {
                                        if (v2.clave !== null) {
                                            $scope.filters_dd.clave.push(v2.clave);
                                        }
                                    }
                                    if ($scope.filters_dd.descuento.indexOf(v2.descuento) == -1) {
                                        if (v2.descuento !== null) {
                                            $scope.filters_dd.descuento.push(v2.descuento);
                                        }
                                    }
                                    if ($scope.filters_dd.descuento_recargo.indexOf(v2.descuento_recargo) == -1) {
                                        if (v2.descuento_recargo !== null) {
                                            $scope.filters_dd.descuento_recargo.push(v2.descuento_recargo);
                                        }
                                    }
                                    if ($scope.filters_dd.fecha_limite.indexOf(v2.fecha_limite) == -1) {
                                        if (v2.fecha_limite !== null) {
                                            $scope.filters_dd.fecha_limite.push(v2.fecha_limite);
                                        }
                                    }
                                    if ($scope.filters_dd.fecha_pago.indexOf(v2.fecha_pago) == -1) {
                                        if (v2.fecha_pago !== null) {
                                            $scope.filters_dd.fecha_pago.push(v2.fecha_pago);
                                        }
                                    }
                                    if ($scope.filters_dd.importe.indexOf(v2.importe) == -1) {
                                        if (v2.importe !== null) {
                                            $scope.filters_dd.importe.push(v2.importe);
                                        }
                                    }
                                    if ($scope.filters_dd.matricula.indexOf(v2.matricula) == -1) {
                                        if (v2.matricula !== null) {
                                            $scope.filters_dd.matricula.push(v2.matricula);
                                        }
                                    }
                                    if ($scope.filters_dd.nombre.indexOf(v2.nombre) == -1) {
                                        if (v2.nombre !== null) {
                                            $scope.filters_dd.nombre.push(v2.nombre);
                                        }
                                    }
                                    if ($scope.filters_dd.recargo.indexOf(v2.recargo) == -1) {
                                        if (v2.recargo !== null) {
                                            $scope.filters_dd.recargo.push(v2.recargo);
                                        }
                                    }
                                    if ($scope.filters_dd.total.indexOf(v2.total) == -1) {
                                        if (v2.total !== null) {
                                            $scope.filters_dd.total.push(v2.total);
                                        }
                                    }
                                    if ($scope.filters_dd.sub_concepto.indexOf(v1.sub_concepto) == -1) {
                                        if (v1.sub_concepto !== null) {
                                            $scope.filters_dd.sub_concepto.push(v1.sub_concepto);
                                        }
                                    }
                                    if ($scope.filters_dd.concepto.indexOf(v2.concepto) == -1) {
                                        if (v2.concepto !== null) {
                                            $scope.filters_dd.concepto.push(v2.concepto);
                                        }
                                    }

                                    if ($scope.filters_dd.sub_concepto_id.indexOf(v1.sub_concepto_id) == -1) {
                                        if (v1.sub_concepto_id !== null) {
                                            $scope.filters_dd.sub_concepto_id.push(v1.sub_concepto_id);
                                        }
                                    }
                                    if ($scope.filters_dd.ciclo.indexOf(v.periodo) == -1) {
                                        if (v.periodo !== null) {
                                            $scope.filters_dd.ciclo.push(v.periodo);
                                        }
                                    }
                                    if ($scope.filters_dd.periodo.indexOf($scope.p_byid[v.periodo]) == -1) {
                                        if ($scope.p_byid[v.periodo] !== null) {
                                            $scope.filters_dd.periodo.push($scope.p_byid[v.periodo]);
                                        }
                                    }

                                    data_alumnos.push({
                                        "apellido_paterno": v2["apellido paterno"],
                                        "apellido_materno": v2["apellido materno"],
                                        "beca": v2.beca,
                                        "carrera": v2.carrera,
                                        "clave": v2.clave,
                                        "descuento": v2.descuento,
                                        "descuento_recargo": v2.descuento_recargo,
                                        "fecha_limite": v2.fecha_limite,
                                        "importe": v2.importe,
                                        "matricula": v2.matricula,
                                        "nombre": v2.nombre,
                                        "recargo": v2.recargo,
                                        "total": v2.total,
                                        "fecha_pago": v2.fecha_pago,
                                        "sub_concepto": v1.sub_concepto,
                                        "concepto": v2.concepto,
                                        "sub_concepto_id": v1.sub_concepto_id,
                                        "ciclo": v.periodo,
                                        "periodo": $scope.p_byid[v.periodo]
                                    });
                                }
                            });
                        }
                    });
                }
            });
            $scope.data_alumnos = new kendo.data.DataSource({
                data: data_alumnos,
                pageSize: 30,
                schema: {
                    model: {
                        periodo: function () {
                            console.log(this.get("ciclo"));
                            return this.get("ciclo");
                        },
                        fields: {
                            total: {type: "number"},
                            beca: {type: "number"},
                            descuento: {type: "number"},
                            descuento_recargo: {type: "number"},
                            recargo: {type: "number"},
                            importe: {type: "number"}
                        }
                    }
                },
                aggregate: [
                    {field: "beca", aggregate: "sum"},
                    {field: "descuento", aggregate: "sum"},
                    {field: "descuento_recargo", aggregate: "sum"},
                    {field: "recargo", aggregate: "sum"},
                    {field: "total", aggregate: "sum"},
                    {field: "importe", aggregate: "sum"}
                ]
            });
            _readycols();
        });
    };



});

UPapp.controller('Administracion_Generales_reporte_adeudos', function ($scope, $routeParams, adminService, $filter, $window) {
    $scope.model = [];
    $scope.carreras = [];
    $scope.carreras_data = [];
    $scope.ap_pat_data = [];
    $scope.ap_mat_data = [];
    $scope.sc_data = [];
    $scope.filters_dd = {
        "apellido_paterno": [],
        "apellido_materno": [],
        "beca": [],
        "carrera": [],
        "clave": [],
        "descuento": [],
        "descuento_recargo": [],
        "fecha_limite": [],
        "importe": [],
        "matricula": [],
        "nombre": [],
        "recargo": [],
        "total": [],
        "sub_concepto": [],
        "concepto": [],
        "sub_concepto_id": [],
        "ciclo": [],
        "periodo": []
    };
    $scope.filters_data = {
        "concepto": [],
        "sub_concepto": [],
        "importe": [],
        "recargo": [],
        "beca": [],
        "descuento": [],
        "descuento_recargo": [],
        "total": [],
        "matricula": [],
        "carrera": [],
        "clave": [],
        "fecha_limite": [],
        "fecha_pago": [],
        "sub_concepto_id": [],
        "periodo": [],
        "ap_pat": [],
        "ap_mat": [],
        "nombre": []
    };
    $scope.sub_conceptos = [];
    $scope.descripcion_sc = [];
    $scope.sort_reporte = [];
    $scope.sort_title = [];
    $scope.format = 'dd-MMMM-yyyy';
    var adeudos = [];
    var key_service;
    $scope.p_byid = {};
    $scope.isBusy = true;
    var found = [];
    adminService.getPeriodos().then(function (data) {
        $scope.isBusy = false;
        $scope.periodos = data;
        data.forEach(function (val, key) {
            $scope.p_byid[val.idperiodo] = val.periodo;
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
    var _define_columns = function () {
        $scope.columns = [
            {field: "concepto", title: "Concepto", width: 100,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.concepto,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "concepto", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "sub_concepto", title: "Sub Concepto", width: 200,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.sub_concepto,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "sub_concepto", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "importe", title: "Importe", width: 200, aggregates: ["sum"], footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#",
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.importe,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "importe", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "recargo", title: "Recargo", width: 200, aggregates: ["sum"], footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#",
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.recargo,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "recargo", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "beca", title: "Beca", width: 200, aggregates: ["sum"], footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#",
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.beca,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "beca", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "descuento", title: "Descuento", width: 200, footerTemplate: "#=sum#", aggregates: ["sum"], groupFooterTemplate: "#=sum#",
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.descuento,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "descuento", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "descuento_recargo", title: "Descuento Recargos", width: 200, aggregates: ["sum"], footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#",
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.descuento_recargo,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "descuento_recargo", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "total", title: "Total", width: 100, aggregates: ["sum"], footerTemplate: "#=sum#", groupFooterTemplate: "#=sum#",
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.total,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "total", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "matricula", title: "Matricula", width: 200, hidden: true,
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
            {field: "nombre", title: "Nombre", width: 200, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.nombre,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "nombre", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "apellido_paterno", title: "Apellido Paterno", width: 200, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.apellido_paterno,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "apellido_paterno", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "apellido_materno", title: "Apellido Materno", width: 200, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.apellido_materno,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "apellido_materno", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "carrera", title: "Carrera", width: 200, hidden: true,
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
            {field: "clave", title: "Clave", width: 200, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.clave,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "clave", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "fecha_limite", title: "Fecha Limite", width: 200, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.fecha_limite,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "fecha_limite", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "sub_concepto_id", title: "ID SubConcetpo", width: 100, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.sub_concepto_id,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "sub_concepto_id", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "ciclo", title: "Ciclo", width: 100, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.ciclo,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "ciclo", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }},
            {field: "periodo", title: "Periodo", width: 150, hidden: true,
                filterable: {
                    ui: function (element) {
                        element.removeAttr("data-bind");
                        element.kendoMultiSelect({
                            dataSource: $scope.filters_dd.periodo,
                            change: function (e) {
                                var filter = {logic: "or", filters: []};
                                var values = this.value();
                                angular.forEach(values, function (v) {
                                    filter.filters.push({field: "periodo", operator: "eq", value: v});
                                });
                                $scope.data_alumnos.filter(filter);
                            }
                        });
                    },
                    extra: false
                }}
        ];
    };
    $scope.to_hide = [];
    $scope.data_alumnos = [];

    $scope.mainGridOptions = {
        dataSource: $scope.data_alumnos,
        toolbar: ["excel"],
        excel: {
            fileName: "Reporte Adeudos.xlsx",
            allPages: true,
            filterable: true
        },
        columnMenu: true,
        selectable: "multiple cell",
        allowCopy: true,
        sortable: true,
        reorderable: true,
//        dataBinding: function (e) {
//            console.log("dataBinding");
//            angular.forEach(e.sender.options.dataSource._group, function (v, k) {
//                angular.forEach($scope.columns, function (v1, k1) {
//                    if (v.field == v1.field) {
//                        $scope.columns[k1].hidden = true;
//                    }
//                });
//            });
//        },
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
        height: 800,
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
    $scope.obtener_adeudos = function () {
        //console.log($scope.model);
        $scope.isBusy = true;
        $scope.model.status = 0;
        adminService.getAdeudosReporteOrdenado($scope.model).then(function (data) {
            $scope.isBusy = false;
            $scope.datos_filtros = [];
            key_service = data.respuesta.data.key;

            //console.log($scope.data_alumnos);
            data_alumnos = [];
            angular.forEach(data.respuesta.data.periodos, function (v, k) {
                if (!isNaN(k)) {
                    angular.forEach(v.subconceptos, function (v1, k1) {
                        if (!isNaN(k1)) {
                            angular.forEach(v1.adeudo_info, function (v2, k2) {
                                if (!isNaN(k2)) {
                                    if ($scope.filters_dd.apellido_paterno.indexOf(v2["apellido paterno"]) == -1) {
                                        if (v2["apellido paterno"] !== null) {
                                            $scope.filters_dd.apellido_paterno.push(v2["apellido paterno"]);
                                        }
                                    }
                                    if ($scope.filters_dd.apellido_materno.indexOf(v2["apellido materno"]) == -1) {
                                        if (v2["apellido materno"] !== null) {
                                            $scope.filters_dd.apellido_materno.push(v2["apellido materno"]);
                                        }
                                    }
                                    if ($scope.filters_dd.beca.indexOf(v2.beca) == -1) {
                                        if (v2.beca !== null) {
                                            $scope.filters_dd.beca.push(v2.beca);
                                        }
                                    }
                                    if ($scope.filters_dd.carrera.indexOf(v2.carrera) == -1) {
                                        if (v2.carrera !== null) {
                                            $scope.filters_dd.carrera.push(v2.carrera);
                                        }
                                    }
                                    if ($scope.filters_dd.clave.indexOf(v2.clave) == -1) {
                                        if (v2.clave !== null) {
                                            $scope.filters_dd.clave.push(v2.clave);
                                        }
                                    }
                                    if ($scope.filters_dd.descuento.indexOf(v2.descuento) == -1) {
                                        if (v2.descuento !== null) {
                                            $scope.filters_dd.descuento.push(v2.descuento);
                                        }
                                    }
                                    if ($scope.filters_dd.descuento_recargo.indexOf(v2.descuento_recargo) == -1) {
                                        if (v2.descuento_recargo !== null) {
                                            $scope.filters_dd.descuento_recargo.push(v2.descuento_recargo);
                                        }
                                    }
                                    if ($scope.filters_dd.fecha_limite.indexOf(v2.fecha_limite) == -1) {
                                        if (v2.fecha_limite !== null) {
                                            $scope.filters_dd.fecha_limite.push(v2.fecha_limite);
                                        }
                                    }
                                    if ($scope.filters_dd.importe.indexOf(v2.importe) == -1) {
                                        if (v2.importe !== null) {
                                            $scope.filters_dd.importe.push(v2.importe);
                                        }
                                    }
                                    if ($scope.filters_dd.matricula.indexOf(v2.matricula) == -1) {
                                        if (v2.matricula !== null) {
                                            $scope.filters_dd.matricula.push(v2.matricula);
                                        }
                                    }
                                    if ($scope.filters_dd.nombre.indexOf(v2.nombre) == -1) {
                                        if (v2.nombre !== null) {
                                            $scope.filters_dd.nombre.push(v2.nombre);
                                        }
                                    }
                                    if ($scope.filters_dd.recargo.indexOf(v2.recargo) == -1) {
                                        if (v2.recargo !== null) {
                                            $scope.filters_dd.recargo.push(v2.recargo);
                                        }
                                    }
                                    if ($scope.filters_dd.total.indexOf(v2.total) == -1) {
                                        if (v2.total !== null) {
                                            $scope.filters_dd.total.push(v2.total);
                                        }
                                    }
                                    if ($scope.filters_dd.sub_concepto.indexOf(v1.sub_concepto) == -1) {
                                        if (v1.sub_concepto !== null) {
                                            $scope.filters_dd.sub_concepto.push(v1.sub_concepto);
                                        }
                                    }
                                    if ($scope.filters_dd.concepto.indexOf(v2.concepto) == -1) {
                                        if (v2.concepto !== null) {
                                            $scope.filters_dd.concepto.push(v2.concepto);
                                        }
                                    }

                                    if ($scope.filters_dd.sub_concepto_id.indexOf(v1.sub_concepto_id) == -1) {
                                        if (v1.sub_concepto_id !== null) {
                                            $scope.filters_dd.sub_concepto_id.push(v1.sub_concepto_id);
                                        }
                                    }
                                    if ($scope.filters_dd.ciclo.indexOf(v.periodo) == -1) {
                                        if (v.periodo !== null) {
                                            $scope.filters_dd.ciclo.push(v.periodo);
                                        }
                                    }
                                    if ($scope.filters_dd.periodo.indexOf($scope.p_byid[v.periodo]) == -1) {
                                        if ($scope.p_byid[v.periodo] !== null) {
                                            $scope.filters_dd.periodo.push($scope.p_byid[v.periodo]);
                                        }
                                    }
                                    data_alumnos.push({
                                        "apellido_paterno": v2["apellido paterno"],
                                        "apellido_materno": v2["apellido materno"],
                                        "beca": v2.beca,
                                        "carrera": v2.carrera,
                                        "clave": v2.clave,
                                        "descuento": v2.descuento,
                                        "descuento_recargo": v2.descuento_recargo,
                                        "fecha_limite": v2.fecha_limite,
                                        "importe": v2.importe,
                                        "matricula": v2.matricula,
                                        "nombre": v2.nombre,
                                        "recargo": v2.recargo,
                                        "total": v2.total,
                                        "sub_concepto": v1.sub_concepto,
                                        "concepto": v2.concepto,
                                        "sub_concepto_id": v1.sub_concepto_id,
                                        "ciclo": v.periodo,
                                        "periodo": $scope.p_byid[v.periodo]
                                    });
                                }
                            });
                        }
                    });
                }
            });
            $scope.data_alumnos = new kendo.data.DataSource({
                data: data_alumnos,
                pageSize: 30,
                schema: {
                    model: {
                        periodo: function () {
                            console.log(this.get("ciclo"));
                            return this.get("ciclo");
                        },
                        fields: {
                            total: {type: "number"},
                            beca: {type: "number"},
                            descuento: {type: "number"},
                            descuento_recargo: {type: "number"},
                            recargo: {type: "number"},
                            importe: {type: "number"}
                        }
                    }
                },
                aggregate: [
                    {field: "beca", aggregate: "sum"},
                    {field: "descuento", aggregate: "sum"},
                    {field: "descuento_recargo", aggregate: "sum"},
                    {field: "recargo", aggregate: "sum"},
                    {field: "total", aggregate: "sum"},
                    {field: "importe", aggregate: "sum"}
                ]
            });
            _define_columns();

        });
    };
    var data_alumnos = [];
    $scope.obtener_adeudos_periodo = function () {
        $scope.isBusy = true;
        $scope.model.status = 0;
        adminService.getAdeudosReporteOrdenadoPeriodo($scope.model).then(function (data) {
            $scope.isBusy = false;
            $scope.datos_filtros = [];
            key_service = data.respuesta.data.key;
            data_alumnos = [];
            angular.forEach(data.respuesta.data.periodos, function (v, k) {
                if (!isNaN(k)) {
                    angular.forEach(v.subconceptos, function (v1, k1) {
                        if (!isNaN(k1)) {
                            angular.forEach(v1.adeudo_info, function (v2, k2) {
                                if (!isNaN(k2)) {
                                    if ($scope.filters_dd.apellido_paterno.indexOf(v2["apellido paterno"]) == -1) {
                                        if (v2["apellido paterno"] !== null) {
                                            $scope.filters_dd.apellido_paterno.push(v2["apellido paterno"]);
                                        }
                                    }
                                    if ($scope.filters_dd.apellido_materno.indexOf(v2["apellido materno"]) == -1) {
                                        if (v2["apellido materno"] !== null) {
                                            $scope.filters_dd.apellido_materno.push(v2["apellido materno"]);
                                        }
                                    }
                                    if ($scope.filters_dd.beca.indexOf(v2.beca) == -1) {
                                        if (v2.beca !== null) {
                                            $scope.filters_dd.beca.push(v2.beca);
                                        }
                                    }
                                    if ($scope.filters_dd.carrera.indexOf(v2.carrera) == -1) {
                                        if (v2.carrera !== null) {
                                            $scope.filters_dd.carrera.push(v2.carrera);
                                        }
                                    }
                                    if ($scope.filters_dd.clave.indexOf(v2.clave) == -1) {
                                        if (v2.clave !== null) {
                                            $scope.filters_dd.clave.push(v2.clave);
                                        }
                                    }
                                    if ($scope.filters_dd.descuento.indexOf(v2.descuento) == -1) {
                                        if (v2.descuento !== null) {
                                            $scope.filters_dd.descuento.push(v2.descuento);
                                        }
                                    }
                                    if ($scope.filters_dd.descuento_recargo.indexOf(v2.descuento_recargo) == -1) {
                                        if (v2.descuento_recargo !== null) {
                                            $scope.filters_dd.descuento_recargo.push(v2.descuento_recargo);
                                        }
                                    }
                                    if ($scope.filters_dd.fecha_limite.indexOf(v2.fecha_limite) == -1) {
                                        if (v2.fecha_limite !== null) {
                                            $scope.filters_dd.fecha_limite.push(v2.fecha_limite);
                                        }
                                    }
                                    if ($scope.filters_dd.importe.indexOf(v2.importe) == -1) {
                                        if (v2.importe !== null) {
                                            $scope.filters_dd.importe.push(v2.importe);
                                        }
                                    }
                                    if ($scope.filters_dd.matricula.indexOf(v2.matricula) == -1) {
                                        if (v2.matricula !== null) {
                                            $scope.filters_dd.matricula.push(v2.matricula);
                                        }
                                    }
                                    if ($scope.filters_dd.nombre.indexOf(v2.nombre) == -1) {
                                        if (v2.nombre !== null) {
                                            $scope.filters_dd.nombre.push(v2.nombre);
                                        }
                                    }
                                    if ($scope.filters_dd.recargo.indexOf(v2.recargo) == -1) {
                                        if (v2.recargo !== null) {
                                            $scope.filters_dd.recargo.push(v2.recargo);
                                        }
                                    }
                                    if ($scope.filters_dd.total.indexOf(v2.total) == -1) {
                                        if (v2.total !== null) {
                                            $scope.filters_dd.total.push(v2.total);
                                        }
                                    }
                                    if ($scope.filters_dd.sub_concepto.indexOf(v1.sub_concepto) == -1) {
                                        if (v1.sub_concepto !== null) {
                                            $scope.filters_dd.sub_concepto.push(v1.sub_concepto);
                                        }
                                    }
                                    if ($scope.filters_dd.concepto.indexOf(v2.concepto) == -1) {
                                        if (v2.concepto !== null) {
                                            $scope.filters_dd.concepto.push(v2.concepto);
                                        }
                                    }

                                    if ($scope.filters_dd.sub_concepto_id.indexOf(v1.sub_concepto_id) == -1) {
                                        if (v1.sub_concepto_id !== null) {
                                            $scope.filters_dd.sub_concepto_id.push(v1.sub_concepto_id);
                                        }
                                    }
                                    if ($scope.filters_dd.ciclo.indexOf(v.periodo) == -1) {
                                        if (v.periodo !== null) {
                                            $scope.filters_dd.ciclo.push(v.periodo);
                                        }
                                    }
                                    if ($scope.filters_dd.periodo.indexOf($scope.p_byid[v.periodo]) == -1) {
                                        if ($scope.p_byid[v.periodo] !== null) {
                                            $scope.filters_dd.periodo.push($scope.p_byid[v.periodo]);
                                        }
                                    }
                                    data_alumnos.push({
                                        "apellido_paterno": v2["apellido paterno"],
                                        "apellido_materno": v2["apellido materno"],
                                        "beca": v2.beca,
                                        "carrera": v2.carrera,
                                        "clave": v2.clave,
                                        "descuento": v2.descuento,
                                        "descuento_recargo": v2.descuento_recargo,
                                        "fecha_limite": v2.fecha_limite,
                                        "importe": v2.importe,
                                        "matricula": v2.matricula,
                                        "nombre": v2.nombre,
                                        "recargo": v2.recargo,
                                        "total": v2.total,
                                        "sub_concepto": v1.sub_concepto,
                                        "concepto": v2.concepto,
                                        "sub_concepto_id": v1.sub_concepto_id,
                                        "ciclo": v.periodo,
                                        "periodo": $scope.p_byid[v.periodo]
                                    });
                                }
                            });
                        }
                    });
                }
            });
            $scope.data_alumnos = new kendo.data.DataSource({
                data: data_alumnos,
                pageSize: 30,
                schema: {
                    model: {
                        fields: {
                            total: {type: "number"},
                            beca: {type: "number"},
                            descuento: {type: "number"},
                            descuento_recargo: {type: "number"},
                            recargo: {type: "number"},
                            importe: {type: "number"}
                        }
                    }
                },
                aggregate: [
                    {field: "beca", aggregate: "sum"},
                    {field: "descuento", aggregate: "sum"},
                    {field: "descuento_recargo", aggregate: "sum"},
                    {field: "recargo", aggregate: "sum"},
                    {field: "total", aggregate: "sum"},
                    {field: "importe", aggregate: "sum"}
                ]
            });
            _define_columns();
        });
    };


});
UPapp.controller('Administracion_Generales_bancos', function ($scope, $routeParams, adminService, $modal) {
    var BTemp = false;
    waitingDialog.show();
    adminService.getBancos().then(function (response) {
        $scope.bancos = response.respuesta.data;
        waitingDialog.hide();
    });
    $scope.NuevoBanco = function (html) {
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
    $scope.ModificarBanco = function (html, data, idx) {
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
    $scope.EliminarBanco = function (bid) {
        adminService.DeleteBanco(bid).then(function (data) {
            $scope.bancos = data.respuesta.data;
        });
    };
    $scope.CuentasBanco = function (html, data) {
        $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'md',
            resolve: {
                custom_data: function () {
                    return {banco: data};
                }
            }
        });
    };
    $scope.$on('modal_response', function (event, args) {
        if (args.modificado) {
            $scope.bancos[BTemp] = args.data;
        } else {
            $scope.bancos.push(args);
        }

    });
});


UPapp.controller('Administracion_Generales_conceptos', function ($scope, adminService, $modal) {
    $scope.conceptos = [];
    var BTemp = false;
    waitingDialog.show();
    adminService.getconceptos().then(function (data) {
        waitingDialog.hide();
        if (!data.error) {
            $scope.conceptos = data.respuesta.data;
        }
    }, function (err) {
    });
    $scope.open = function (data, html) {
        $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                custom_data: function () {
                    return data;
                }
            }
        });
    };
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
    $scope.Nuevo_Concepto = function (html) {
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
    $scope.$on('modal_response', function (event, args) {
        if (args.modificado) {
            $scope.conceptos[BTemp] = args.data;
        } else {
            $scope.conceptos.push(args);
        }
    });
});
UPapp.controller('Administracion_Generales_fileReferencias', function ($scope, adminService, $modal) {
    $scope.model = [];
    $scope.upload_file = function () {
        $scope.isBusy = true;
        $scope.encontradas = [];
        $scope.no_encontradas = [];
        adminService.SubirReferencias($scope.model.file).then(function (data) {
            $scope.isBusy = false;
            //console.log(data);
            if (!data.error) {

                if (data.respuesta.data.existe_referencia) {
                    $scope.encontradas = data.respuesta.data.existe_referencia;
                }
                if (data.respuesta.data.no_existe_referencia) {
                    $scope.no_encontradas = data.respuesta.data.no_existe_referencia;
                }
            }
            $scope.alerts = [
                {type: 'success', msg: 'Los Adeudos del archivo fueron validados correctamente.'}
            ];
        });
    };

});

UPapp.controller('Administracion_Agrupaciones', function ($scope, $routeParams, adminService) {
    $scope.tabs = [
        {title: 'Alumno', click: 'agrupaciones'}
    ];
    $scope.active = 'agrupaciones';
    $scope.title = "Agrupaciones";
    $scope.subPageTemplate = 'partials/administrador/administracion/agrupaciones/agrupaciones.html';
    $scope.subPageContent = function (page) {
        $scope.subPageTemplate = 'partials/administrador/administracion/agrupaciones/' + page + '.html';
    };
    $scope.subPageRigth = function (page, custom_data, type) {
        waitingDialog.show();
        $scope.subPageTemplate = 'partials/administrador/administracion/agrupaciones/' + page + '.html';
        if (type == 'planes') {
            $scope.title = "Agrupacion: " + custom_data.nombre;
            adminService.getPlanesPagoAgrupacion(custom_data.id).then(function (data) {
                waitingDialog.hide();
                $scope.planes = data;
            }, function (err) {

            });
        }
        if (type == 'alumnos') {
            $scope.title = "Alumnos";
            $scope.data_plan = custom_data;
        }
    };
});


UPapp.controller('Administracion_Agrupaciones_agrupaciones', function ($scope, $routeParams, adminService) {
    waitingDialog.show();
    adminService.getAgrupaciones().then(function (data) {
        waitingDialog.hide();
        $scope.agrupaciones = data;
    }, function (err) {
    });
    $scope.subPageLoad = function (html, data, type) {
        $scope.subPageRigth(html, data, type);
    };
});

UPapp.controller('Administracion_Agrupaciones_showalumnos', function ($scope, $modal, adminService, $q, $filter) {
    var promises = [];
    var alumnos = [];
    var carreras = [];
    var grados = [];
    var grupos = [];
    var filter = [];
    $scope.paquete_periodo = false;
    $scope.alumnos_show = true;
    $scope.alumnos_todos = false;
    $scope.alumnos_inscritos = true;
    $scope.paquete_exists = false;
    $scope.model = [];
    $scope.isBusy = true;
    $scope.maxSize = 10;
    $scope.items_per_page = 50;
    waitingDialog.show();
    promises.push(adminService.getPeriodos().then(function (data) {
        $scope.periodos = data;
        data.forEach(function (val, key) {
            if (val.actual == 1) {
                $scope.model.periodo = $scope.periodos[key];
            }
        });
        return true;
    }, function (err) {
    }));

    promises.push(adminService.getNiveles().then(function (data) {
        $scope.niveles = data.respuesta.data;
        $scope.model.nivel = Object.keys(data.respuesta.data)[0];
        //$scope.getSubConceptos();
    }));
    $q.all(promises).then(function (data) {
        waitingDialog.hide();
        $scope.isBusy = false;
        $scope.aif();
    });


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
            filter = $filter('getAllObjectsByProperty')('carrera', $scope.model.filter.carrera, $scope.alumnos);
            filter = $filter('getAllObjectsByProperty')('grado', $scope.model.filter.grado, filter);
            filter = $filter('getAllObjectsByProperty')('grupo', $scope.model.filter.grupo, filter);

            filter = $filter('filter')(filter, {appat: searchParams.appat});
            filter = $filter('filter')(filter, {apmat: searchParams.apmat});
            filter = $filter('filter')(filter, {nom: searchParams.nom});
            filter = $filter('filter')(filter, {matricula: searchParams.matricula});

            $scope.bigTotalItems = filter.length;
            $scope.bigCurrentPage = 1;
//            console.log(filter);
//            $scope.bigTotalItems = filter.length;
//            $scope.bigCurrentPage = 1;
            render_table();
        });
    };


    $scope.Insc_NoInsc = function () {
        $scope.model.filter = {
            carrera: null,
            grupo: null,
            grado: null
        };
        $scope.alumno_assign.add = [];
        if ($scope.alumnos_show) {
            $scope.alumnos_show = false;
            $scope.alumnos = alumnos.Inscritos;
            filter = $scope.alumnos;
            $scope.carreras = carreras.Inscritos;
            $scope.grupos = grupos.Inscritos;
            $scope.grados = grados.Inscritos;
            $scope.bigTotalItems = filter.length;
            $scope.bigCurrentPage = 1;
            render_table();
            //if ($scope.carreras) {
            //$scope.model.filter.carrera = $scope.carreras[0];
            //}
        } else {
            $scope.alumnos_show = true;
            $scope.alumnos = alumnos.NoInscritos;
            filter = $scope.alumnos;
            $scope.carreras = carreras.NoInscritos;
            $scope.grupos = grupos.NoInscritos;
            $scope.grados = grados.NoInscritos;
            $scope.bigTotalItems = filter.length;
            $scope.bigCurrentPage = 1;
            render_table();
            //if ($scope.carreras) {
            //$scope.model.filter.carrera = $scope.carreras[0];
            //}
        }
    };
    $scope.$watchCollection('bigCurrentPage', function () {
        if ($scope.bigCurrentPage) {
            render_table();
        }
    });

    var render_table = function () {
        var begin = (($scope.bigCurrentPage - 1) * $scope.items_per_page)
                , end = begin + $scope.items_per_page;
        //console.log(filter.slice(begin, end));
        if (filter) {
            $scope.filteredAlumnos = filter.slice(begin, end);
        }
    };


    $scope.search_filters = function () {
        filter = $filter('getAllObjectsByProperty')('carrera', $scope.model.filter.carrera, $scope.alumnos);
        filter = $filter('getAllObjectsByProperty')('grado', $scope.model.filter.grado, filter);
        filter = $filter('getAllObjectsByProperty')('grupo', $scope.model.filter.grupo, filter);
        $scope.bigTotalItems = filter.length;
        $scope.bigCurrentPage = 1;
        //console.log($scope.alumnos);
        render_table();
    };

    $scope.aif = function () {
        $scope.isBusy = true;
        adminService.getAlumnosPaquete($scope.model.periodo.idperiodo, $scope.data_plan.id, $scope.model.nivel).then(function (data) {
            $scope.isBusy = false;
            alumnos.Inscritos = [];
            alumnos.NoInscritos = [];
            $scope.paquete_periodo = [];
            if (!data.error) {
                alumnos.Inscritos = data.respuesta.data;
                $scope.paquete_periodo = data.respuesta.paquete;
                carreras.Inscritos = [];
                grupos.Inscritos = [];
                grados.Inscritos = [];
                angular.forEach(data.respuesta.data, function (value, genre) {
                    if (carreras.Inscritos.indexOf(value.carrera) == -1)
                    {
                        carreras.Inscritos.push(value.carrera);
                    }
                    if (grupos.Inscritos.indexOf(value.grupo) == -1)
                    {
                        if (value.grupo !== null) {
                            grupos.Inscritos.push(value.grupo);
                        }
                    }
                    if (grados.Inscritos.indexOf(value.grado) == -1)
                    {
                        if (value.grado !== null) {
                            grados.Inscritos.push(value.grado);
                        }
                    }
                });
                alumnos.NoInscritos = data.respuesta.no_asignados;
                carreras.NoInscritos = [];
                grupos.NoInscritos = [];
                grados.NoInscritos = [];
                angular.forEach(data.respuesta.no_asignados, function (value) {
                    if (carreras.NoInscritos.indexOf(value.carrera) == -1)
                    {
                        carreras.NoInscritos.push(value.carrera);
                    }
                    if (grupos.NoInscritos.indexOf(value.grupo) == -1)
                    {
                        if (value.grupo !== null) {
                            grupos.NoInscritos.push(value.grupo);
                        }
                    }
                    if (grados.NoInscritos.indexOf(value.grado) == -1)
                    {
                        if (value.grado !== null) {
                            grados.NoInscritos.push(value.grado);
                        }
                    }
                });
                $scope.alerts = false;
                $scope.Insc_NoInsc();
                $scope.paquete_exists = true;
            } else {
                $scope.paquete_exists = false;
                $scope.paquete_periodo = false;
                $scope.alumnos_insc = false;
                $scope.alumnos_inscritos = true;
                $scope.alumnos = [];
                $scope.alerts = [
                    {type: 'danger', msg: 'No existe Ningun Paquete para el periodo ' + $scope.model.periodo.periodo}
                ];
            }
        }, function (err) {

        });
    };
    $scope.alumno_assign = [];
    $scope.checkAllPagina = function () {
        $scope.alumno_assign.add = $scope.filteredAlumnos.map(function (item) {
            return item.idpersonas;
        });
    };
    $scope.checkAllBusqueda = function () {
        $scope.alumno_assign.add = filter.map(function (item) {
            return item.idpersonas;
        });
    };

    $scope.uncheckAll = function () {
        $scope.alumno_assign.add = [];
    };

    $scope.upload_file = function () {
        $scope.isBusy = true;
        $scope.encontradas = [];
        $scope.no_encontradas = [];
        adminService.SubirAdeudosExcel($scope.model.file, $scope.paquete_periodo.id).then(function (data) {
            $scope.isBusy = false;
            console.log(data);
            $scope.isBusy = false;
            $scope.aif();
            $modal.open({
                templateUrl: 'partials/administrador/administracion/agrupaciones/modal/m_asignados.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    custom_data: function () {
                        return data.respuesta;
                    }
                }
            });
        });
    };

    $scope.asignar_alumnos = function () {
        $scope.isBusy = true;
        if ($scope.paquete_periodo) {
            adminService.setAdeudosalumno($scope.paquete_periodo.id, $scope.alumno_assign.add).then(function (data) {
                console.log(data);
                $scope.isBusy = false;
                $scope.aif();
                $modal.open({
                    templateUrl: 'partials/administrador/administracion/agrupaciones/modal/m_asignados.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    resolve: {
                        custom_data: function () {
                            return data.respuesta;
                        }
                    }
                });
//                $scope.alertsAdded = [
//                    {type: 'success', msg: 'Los alumnos seleccionados han sido añadidos Correctamente'}
//                ];
            }, function (err) {

            });
        }
    };
});

UPapp.controller('Modal_AlumnosAsignados', function ($scope) {
    var columnas = {
        Asignados: [
            {field: "matricula", title: "Matricula", width: 200},
            {field: "nom", title: "Nombre", width: 200},
            {field: "appat", title: "Apellido Paterno", width: 200},
            {field: "apmat", title: "Apellido Materno", width: 200},
            {field: "carrera", title: "Carrera", width: 200},
            {field: "estatus_admin", title: "Estatus", width: 200},
            {field: "grado", title: "Grado", width: 200},
            {field: "grupo", title: "Grupo", width: 200},
            {field: "nombre_nivel", title: "Nivel", width: 200}
        ],
        NoAsignados: [
            {field: "matricula", title: "Matricula", width: 200},
            {field: "nom", title: "Nombre", width: 200},
            {field: "appat", title: "Apellido Paterno", width: 200},
            {field: "apmat", title: "Apellido Materno", width: 200},
            {field: "motivo_no_asignacion", title: "Motivo No Asignado", width: 200},
            {field: "carrera", title: "Carrera", width: 200},
            {field: "estatus_admin", title: "Estatus", width: 200},
            {field: "grado", title: "Grado", width: 200},
            {field: "grupo", title: "Grupo", width: 200},
            {field: "nombre_nivel", title: "Nivel", width: 200}
        ]
    };
    $scope.mainGridOptions = {
        selectable: "multiple cell",
        allowCopy: true,
        sortable: true,
        reorderable: true,
        messages: {
            commands: {
                excel: "Exportar Excel"
            }
        },
        scrollable: {
            virtual: true
        },
        height: 500,
        pageable: {
            info: true,
            numeric: false,
            previousNext: false
        }
    };
    $scope.columns = columnas.Asignados;
    $scope.data_alumnos = new kendo.data.DataSource({
        data: $scope.$parent.data_modal.asignados,
        pageSize: 30
    });
    $scope.grid_change = function () {
        if (!$scope.asignados_no_asignados) {
            $scope.asignados_no_asignados = !$scope.asignados_no_asignados;
            $scope.columns = columnas.NoAsignados;
            $scope.data_alumnos = new kendo.data.DataSource({
                data: $scope.$parent.data_modal.no_asignados,
                pageSize: 30
            });
        } else {
            $scope.asignados_no_asignados = !$scope.asignados_no_asignados;
            $scope.columns = columnas.Asignados;
            $scope.data_alumnos = new kendo.data.DataSource({
                data: $scope.$parent.data_modal.asignados,
                pageSize: 30
            });
        }
    };
});

UPapp.directive('myformat', function (dateFilter) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (viewValue) {
                return dateFilter(viewValue, 'yyyy-MM-dd');
            });
        }
    };
});

UPapp.controller('Modal_planCtrl', function ($scope, adminService) {
    $scope.format = 'dd-MMMM-yyyy';
    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };
    $scope.open = function (idx, $event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.scp[idx].opened = true;
    };
    $scope.dateOptions = {
        formatYear: 'yy', startingDay: 1
    };
    var datos_paquete = [];
    $scope.model = [];
    $scope.scp = [];
    $scope.dropSC = function (index) {
        $scope.scp.splice(index, 1);
        $scope.filldataSC();
    };
    adminService.getPeriodos().then(function (data) {
        $scope.periodos = data;
        data.forEach(function (val, key) {
            if (val.actual == 1) {
                $scope.model.periodo = $scope.periodos[key];
            }
        });
        _nivelesReady();
    }, function (err) {
    });
    var _PeriodosReady = function () {
        adminService.getconceptos().then(function (data) {
            if (data.respuesta.data) {
                $scope.conceptos = data.respuesta.data;
                $scope.model.concepto = $scope.conceptos[0];
                $scope.getSubconceptos();
            }
        });
    };
    var _nivelesReady = function () {
        adminService.getNiveles().then(function (data) {
            $scope.niveles = data.respuesta.data;
            $scope.model.nivel = Object.keys(data.respuesta.data)[0];
            $scope.get_scp();
            _PeriodosReady();
        });
    };
    $scope.getSubconceptos = function () {
        adminService.getSubConceptos($scope.model.concepto.id, $scope.model.periodo.idperiodo, $scope.model.nivel).then(function (data) {
            $scope.$parent.isBusy = false;
            if (!data.error) {
                var arr_length = data.respuesta.data.length;
                if (arr_length >= 1) {
                    $scope.subconceptos = data.respuesta.data;
                    $scope.model.subconcepto = $scope.subconceptos[0];
                } else {
                    $scope.subconceptos = [];
                    $scope.model.subconcepto = [];
                }
            }

        });
    };

    $scope.AddSCPaquete = function () {
        $scope.model.subconcepto['recargo_acumulado'] = 0;
        $scope.scp.push(angular.copy($scope.model.subconcepto));
        //$scope.scp.push(angular.fromJson(angular.toJson($scope.model.subconcepto)));
        $scope.filldataSC();
        $scope.scp_show = true;
    };
    $scope.SaveSCPaquete = function () {
        if ($scope.scp.length == 0) {
            return;
        }
        $scope.$parent.isBusy = true;
        var dataSCPaquete = {};
        dataSCPaquete['paquete_id'] = datos_paquete.id;
        dataSCPaquete['sub_concepto'] = {};
        var temp_count = 0;
        $scope.scp.forEach(function (val) {
            dataSCPaquete['sub_concepto'][temp_count] = {};
            dataSCPaquete['sub_concepto'][temp_count]['fecha'] = val.fecha_de_vencimiento;
            dataSCPaquete['sub_concepto'][temp_count]['id'] = val.id;
            dataSCPaquete['sub_concepto'][temp_count]['idsub_paqueteplan'] = val.scpp_id;
            dataSCPaquete['sub_concepto'][temp_count]['digito_referencia'] = val.digito_referencia;
            dataSCPaquete['sub_concepto'][temp_count]['descripcion_sc'] = val.descripcion_sc;
            dataSCPaquete['sub_concepto'][temp_count]['recargo_acumulado'] = val.recargo_acumulado;
            temp_count++;
        });

        dataSCPaquete['recargo'] = {};
        dataSCPaquete['tipo_recargo'] = {};
        for (x in $scope.data_subconcepto) {
            dataSCPaquete['recargo'][x] = $scope.data_subconcepto[x].recargo;
            dataSCPaquete['tipo_recargo'][x] = $scope.data_subconcepto[x].tipo_recargo;
        }
        dataSCPaquete['tipos_pago'] = $scope.model.tipos_pago;
        //console.log(dataSCPaquete);
        adminService.addSCPaquete(dataSCPaquete).then(function (data) {
            $scope.$parent.isBusy = false;
            $scope.get_scp();
        });
    };
    $scope.tipo_adeudo = [
        {name: 'Porcentaje', value: 1},
        {name: 'Importe', value: 2}
    ];
    $scope.filldataSC = function () {
        $scope.data_subconcepto = {};
        $scope.scp.forEach(function (val, key) {
            val.opened = false;
            val.digito_referencia = parseInt(val.digito_referencia);
            val.recargo_acumulado = parseInt(val.recargo_acumulado);
            if (!$scope.data_subconcepto[val.id])
            {
                $scope.data_subconcepto[val.id] = [];
                $scope.data_subconcepto[val.id]['nombre'] = val.sub_concepto;
                $scope.data_subconcepto[val.id]['tipo_recargo'] = parseInt(val.tipo_recargo);
                $scope.data_subconcepto[val.id]['recargo'] = parseInt(val.recargo);
            }
        });
    };
    $scope.pqt_exists = false;
    $scope.get_scp = function () {
        $scope.scp = [];
        $scope.model.tipos_pago = false;
        adminService.getSubConceptosPlan($scope.data_modal.id, $scope.model.periodo.idperiodo, $scope.model.nivel).then(function (data) {
            if (!data.error) {
                datos_paquete = data.respuesta.paquete;
                $scope.pqt_exists = true;
                $scope.scp_show = true;
                $scope.scp = angular.copy(data.respuesta.data);
                $scope.filldataSC();
                $scope.alerts = [];
                if (data.respuesta.data) {
                    data.respuesta.data.forEach(function (val) {
                        if (val.tipos_pago)
                        {
                            $scope.model.tipos_pago = JSON.parse(val.tipos_pago);
                        }
                    });
                    if (!$scope.model.tipos_pago) {
                        $scope.model.tipos_pago = [1];
                    }
                }
            } else {
                $scope.pqt_exists = false;
                $scope.alerts = [
                    {type: 'danger', msg: data.mensaje}
                ];
            }
        });
    };
    $scope.Nuevo_Paquete = function () {
        $scope.model['id_plandepago'] = $scope.data_modal.id;
        adminService.addPaquetePlan($scope.model).then(function (data) {
            $scope.get_scp();
        });
    };
    $scope.tipodePago = [
        {text: 'Banco', value: 1},
        {text: 'Caja', value: 2}
    ];
});
UPapp.controller('Modal_NewConcepto', function ($scope, adminService, $rootScope) {
    $scope.$parent.isBusy = false;
    $scope.$parent.return_data = [{'test': 'test'}];

    $scope.add_new = function () {
        $scope.$parent.isBusy = true;
        adminService.addConcepto($scope.concepto).then(function (data) {
            $scope.$parent.isBusy = false;
            $rootScope.$broadcast('custom_response', data.respuesta.data);
            $scope.$parent.isBusy = false;
        });
    };
});
UPapp.controller('Modal_NewPlan', function ($scope, adminService, $rootScope) {
    $scope.model = [];
    adminService.getAgrupaciones().then(function (data) {
        $scope.agrupaciones = data;
        $scope.model.agrupacion = $scope.agrupaciones[0];
    });
    $scope.add_newPlan = function () {
        $scope.$parent.isBusy = true;
        adminService.addPlandePago($scope.model).then(function (data) {
            $scope.$parent.isBusy = false;
            $rootScope.$broadcast('custom_response', data);
        });
    };
});
UPapp.controller('Modal_NewBanco', function ($scope, adminService, $rootScope) {
    $scope.model = [];
    $scope.addNewBanco = function () {
        $scope.$parent.isBusy = true;
        adminService.addBanco($scope.model).then(function (data) {
            $scope.$parent.isBusy = false;
            $rootScope.$broadcast('custom_response', data.respuesta.data);
        });
    };
});

UPapp.controller('Modal_ModifyBanco', function ($scope, adminService, $rootScope) {
    $scope.model = [];
    $scope.model['banco'] = $scope.data_modal['banco'];
    $scope.model['descripcion'] = $scope.data_modal['descripcion'];
    $scope.model['id'] = $scope.data_modal['id'];
    $scope.ModifyBanco = function () {
        $scope.$parent.isBusy = true;
        adminService.Modifybanco($scope.model).then(function (data) {
            var MResponse = [];
            $scope.$parent.isBusy = false;
            MResponse['modificado'] = true;
            MResponse['data'] = data.respuesta.data;
            $rootScope.$broadcast('custom_response', MResponse);
            $scope.alerts = [
                {type: 'success', msg: 'Los datos del banco han sido Modificados.'}
            ];
        });
    };
});

UPapp.controller('Modal_ModifyBeca', function ($scope, adminService, $rootScope) {
    $scope.model = [];
    $scope.model['id'] = $scope.data_modal['id'];
    $scope.model['importe'] = $scope.data_modal['importe'];
    $scope.model['abreviatura'] = $scope.data_modal['abreviatura'];
    $scope.model['descripcion'] = $scope.data_modal['descripcion'];
    adminService.getCatalogos().then(function (data) {
        if (data.respuesta.data) {
            $scope.model['periodicidades_id'] = $scope.data_modal['periodicidades_id'];
            $scope.model['tipo_importe_id'] = $scope.data_modal['tipo_importe_id'];
            $scope.model['subcidios_id'] = 1;
            $scope.catalogos = data.respuesta.data;
            $scope.model.tipo_importe_id = $scope.catalogos.tipo_importe[1].id;
        }
    });
    $scope.Modify = function () {
        $scope.$parent.isBusy = true;
        adminService.ModifyBeca($scope.model).then(function (data) {
            var MResponse = [];
            $scope.$parent.isBusy = false;
            if (data.respuesta.data) {
                MResponse['modificado'] = true;
                MResponse['data'] = data.respuesta.data;
                $rootScope.$broadcast('custom_response', MResponse);
            }
        });
    };
});


UPapp.controller('Modal_cuentasBanco', function ($scope, adminService, $q) {
    $scope.$parent.isBusy = true;
    $scope.model = [];
    $scope.model['bancos_id'] = $scope.data_modal.banco.id;
    $scope.AddCuenta = function () {
        $scope.$parent.isBusy = true;
        adminService.addCuentaBanco($scope.model).then(function (data) {
            $scope.$parent.isBusy = false;
            $scope.cuentas.push(data.respuesta.data);
            $scope.alerts = [
                {type: 'success', msg: 'La cuenta a sido agregada correctamente.'}
            ];
        });
    };
    var CPB = function (id) {
        var CuentaData = [];
        Cuentas.forEach(function (val, key) {
            if (val.bancos_id == id) {
                CuentaData.push(val);
            }
        });
        return CuentaData;
    };
    var get_cuentas = function () {
        var deferred = $q.defer();
        adminService.getCuentasBanco().then(function (response) {
            $scope.$parent.isBusy = false;
            Cuentas = response.respuesta.data;
            $scope.cuentas = CPB($scope.data_modal.banco.id);
            deferred.resolve(true);
        });
        return deferred.promise;
    };
    $scope.ActivarCta = function (Cta) {
        $scope.$parent.isBusy = true;
        adminService.activarCuentaBanco(Cta.id).then(function (data) {
            get_cuentas().then(function () {
                $scope.alerts = [
                    {type: 'success', msg: 'Se a Cambiado la cuenta activa correctamente.'}
                ];
            });
        });
    };
    get_cuentas();
});

UPapp.controller('Administracion_Generales_descuentos', function ($scope, adminService, $modal, $filter) {

    $scope.maxSize = 10;
    $scope.items_per_page = 50;
    adminService.getalumnos().then(function (data) {
        $scope.model = {
            filter: {
                carrera: false,
                grupo: null,
                grado: null
            }
        };
        $scope.alumnos = data;
        $scope.carreras = [];
        $scope.grupos = [];
        $scope.grados = [];
        angular.forEach(data, function (value, genre) {
            if ($scope.carreras.indexOf(value.carrera) == -1)
            {
                $scope.carreras.push(value.carrera);
            }
            if ($scope.grupos.indexOf(value.grupo) == -1)
            {
                if (value.grupo !== null) {
                    $scope.grupos.push(value.grupo);
                }
            }
            if ($scope.grados.indexOf(value.grado) == -1)
            {
                if (value.grado !== null) {
                    $scope.grados.push(value.grado);
                }

            }
        });
        filteredAlumnos = $scope.alumnos;
        $scope.bigTotalItems = $scope.alumnos.length;
        $scope.bigCurrentPage = 1;
        $scope.model.filter.carrera = null;
    }, function (err) {

    });
    var filteredAlumnos = [];

    $scope.$watchCollection('bigCurrentPage', function () {
        //console.log($scope.bigCurrentPage);
        if ($scope.bigCurrentPage) {
            render_table();
        }
    });
    $scope.VerAdeudos = function (html, data) {
        $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                custom_data: function () {
                    return data;
                }
            }
        });
    };
    $scope.model = [];
    $scope.make_filters = function () {
        console.log($scope.model);
        filteredAlumnos = $filter('getAllObjectsByProperty')('carrera', $scope.model.filter.carrera, $scope.alumnos);
        filteredAlumnos = $filter('getAllObjectsByProperty')('grado', $scope.model.filter.grado, filteredAlumnos);
        filteredAlumnos = $filter('getAllObjectsByProperty')('grupo', $scope.model.filter.grupo, filteredAlumnos);
        filteredAlumnos = $filter('filter')(filteredAlumnos, {matricula: $scope.model.filter.matricula});
        $scope.bigTotalItems = filteredAlumnos.length;
        $scope.bigCurrentPage = 1;
        render_table();
        // console.log(filteredAlumnos);
    };


    var render_table = function () {
        var begin = (($scope.bigCurrentPage - 1) * $scope.items_per_page)
                , end = begin + $scope.items_per_page;
        //console.log(filter.slice(begin, end));
        if (filteredAlumnos) {
            $scope.filteredAlumnos = filteredAlumnos.slice(begin, end);
        }
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
            //console.log(searchParams);
            filteredAlumnos = $filter('getAllObjectsByProperty')('carrera', $scope.model.filter.carrera, $scope.alumnos);
            filteredAlumnos = $filter('getAllObjectsByProperty')('grado', $scope.model.filter.grado, filteredAlumnos);
            filteredAlumnos = $filter('getAllObjectsByProperty')('grupo', $scope.model.filter.grupo, filteredAlumnos);
            filteredAlumnos = $filter('filter')(filteredAlumnos, {appat: searchParams.appat});
            filteredAlumnos = $filter('filter')(filteredAlumnos, {apmat: searchParams.apmat});
            filteredAlumnos = $filter('filter')(filteredAlumnos, {nom: searchParams.nom});
            console.log(filteredAlumnos);
            $scope.bigTotalItems = filteredAlumnos.length;
            $scope.bigCurrentPage = 1;
            render_table();
        });
    };
});
UPapp.controller('Administracion_Generales_prorrogas', function ($scope, adminService, $modal, $filter) {

    $scope.maxSize = 10;
    $scope.items_per_page = 50;
    adminService.getalumnos().then(function (data) {
        $scope.model = {
            filter: {
                carrera: false,
                grupo: null,
                grado: null
            }
        };
        $scope.alumnos = data;
        $scope.carreras = [];
        $scope.grupos = [];
        $scope.grados = [];
        angular.forEach(data, function (value, genre) {
            if ($scope.carreras.indexOf(value.carrera) == -1)
            {
                $scope.carreras.push(value.carrera);
            }
            if ($scope.grupos.indexOf(value.grupo) == -1)
            {
                if (value.grupo !== null) {
                    $scope.grupos.push(value.grupo);
                }
            }
            if ($scope.grados.indexOf(value.grado) == -1)
            {
                if (value.grado !== null) {
                    $scope.grados.push(value.grado);
                }

            }
        });
        filteredAlumnos = $scope.alumnos;
        $scope.bigTotalItems = $scope.alumnos.length;
        $scope.bigCurrentPage = 1;
        $scope.model.filter.carrera = null;
    }, function (err) {

    });
    var filteredAlumnos = [];

    $scope.$watchCollection('bigCurrentPage', function () {
        //console.log($scope.bigCurrentPage);
        if ($scope.bigCurrentPage) {
            render_table();
        }
    });
    $scope.VerAdeudos = function (html, data) {
        $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                custom_data: function () {
                    return data;
                }
            }
        });
    };
    $scope.model = [];
    $scope.make_filters = function () {
        console.log($scope.model);
        filteredAlumnos = $filter('getAllObjectsByProperty')('carrera', $scope.model.filter.carrera, $scope.alumnos);
        filteredAlumnos = $filter('getAllObjectsByProperty')('grado', $scope.model.filter.grado, filteredAlumnos);
        filteredAlumnos = $filter('getAllObjectsByProperty')('grupo', $scope.model.filter.grupo, filteredAlumnos);
        filteredAlumnos = $filter('filter')(filteredAlumnos, {matricula: $scope.model.filter.matricula});
        $scope.bigTotalItems = filteredAlumnos.length;
        $scope.bigCurrentPage = 1;
        render_table();
        // console.log(filteredAlumnos);
    };


    var render_table = function () {
        var begin = (($scope.bigCurrentPage - 1) * $scope.items_per_page)
                , end = begin + $scope.items_per_page;
        //console.log(filter.slice(begin, end));
        if (filteredAlumnos) {
            $scope.filteredAlumnos = filteredAlumnos.slice(begin, end);
        }
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
            //console.log(searchParams);
            filteredAlumnos = $filter('getAllObjectsByProperty')('carrera', $scope.model.filter.carrera, $scope.alumnos);
            filteredAlumnos = $filter('getAllObjectsByProperty')('grado', $scope.model.filter.grado, filteredAlumnos);
            filteredAlumnos = $filter('getAllObjectsByProperty')('grupo', $scope.model.filter.grupo, filteredAlumnos);
            filteredAlumnos = $filter('filter')(filteredAlumnos, {appat: searchParams.appat});
            filteredAlumnos = $filter('filter')(filteredAlumnos, {apmat: searchParams.apmat});
            filteredAlumnos = $filter('filter')(filteredAlumnos, {nom: searchParams.nom});
            console.log(filteredAlumnos);
            $scope.bigTotalItems = filteredAlumnos.length;
            $scope.bigCurrentPage = 1;
            render_table();
        });
    };
});
UPapp.controller('Administracion_Generales_single_adeudo', function ($scope, adminService, $rootScope, $modal) {
    adminService.getalumnos().then(function (data) {

        $scope.model = {
            filter: {
                carrera: false,
                grupo: false, grado: false
            }
        };
        $scope.alumnos = data;
        $scope.carreras = [];
        $scope.grupos = [];
        $scope.grados = [];
        angular.forEach(data, function (value, genre) {
            if ($scope.carreras.indexOf(value.carrera) == -1)
            {
                $scope.carreras.push(value.carrera);
            }
            if ($scope.grupos.indexOf(value.grupo) == -1)
            {
                if (value.grupo !== null) {
                    $scope.grupos.push(value.grupo);
                }
            }
            if ($scope.grados.indexOf(value.grado) == -1)
            {
                if (value.grado !== null) {
                    $scope.grados.push(value.grado);
                }

            }
        });
        $scope.model.filter.carrera = $scope.carreras[0];
        //$scope.model.filter.grupo = $scope.grupos[0];
        //$scope.model.filter.grado = $scope.grados[0];
    }, function (err) {

    });
    $scope.Agregaradeudo = function (html, data) {
        $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                custom_data: function () {
                    return data;
                }}
        });
    };
});

UPapp.controller('Modal_generarAdeudos', function ($scope, adminService) {
    $scope.model = [];
    $scope.model.id_persona = $scope.data_modal.idpersonas;
    $scope.getSubconceptos = function () {
        var t_sc = $scope.model;
        adminService.getSubConceptos(t_sc.concepto.id, t_sc.periodo.idperiodo, t_sc.nivel).then(function (data) {
            $scope.subconceptos = data.respuesta.data;
            $scope.model.subconcepto = $scope.subconceptos[0];
        });
    };
    $scope.getAdeudos = function () {
        adminService.getAdeudosAlumno($scope.model).then(function (data) {
            $scope.adeudos = data.respuesta;
        }, function (err) {
        });
    };
    adminService.getPeriodos().then(function (data) {
        $scope.periodos = data;
        data.forEach(function (val, key) {
            if (val.actual == 1) {
                $scope.model.periodo = $scope.periodos[key];
            }
        });
        $scope.getAdeudos();
        _PeriodosReady();
    }, function (err) {
    });
    var _PeriodosReady = function () {
        adminService.getconceptos().then(function (data) {
            if (data.respuesta.data) {
                $scope.conceptos = data.respuesta.data;
                $scope.model.concepto = $scope.conceptos[0];
                _ConceptosReady();
            }
        });
    };
    var _ConceptosReady = function () {
        adminService.getNiveles().then(function (data) {
            if (data.respuesta.data) {
                $scope.niveles = data.respuesta.data;
                $scope.model.nivel = Object.keys(data.respuesta.data)[0];
                $scope.getSubconceptos();
            }
        });
    };
    $scope.AddAdeudoalumno = function () {
        adminService.addAdeudosimple($scope.model).then(function (data) {
            $scope.adeudos.push(data.respuesta);
        });
    };
    $scope.tipodePago = [{text: 'Banco', value: 1},
        {text: 'Caja', value: 2}
    ];
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    $scope.format = 'dd-MMMM-yyyy';
});
UPapp.controller('Modal_ModifyPlan', function ($scope, adminService, $rootScope) {
    $scope.model = [];
    $scope.model['id'] = $scope.data_modal['id'];
    $scope.model['clave_plan'] = $scope.data_modal['clave_plan'];
    $scope.model['descripcion'] = $scope.data_modal['descripcion'];
    $scope.$parent.isBusy = true;
    adminService.getAgrupaciones().then(function (data) {
        $scope.$parent.isBusy = false;
        $scope.agrupaciones = data;
        $scope.model['agrupacion'] = $scope.data_modal['id_agrupaciones'];
    });
    $scope.Modify = function () {
        $scope.$parent.isBusy = true;
        adminService.ModifyPlanePago($scope.model).then(function (data) {
            var MResponse = [];
            $scope.$parent.isBusy = false;
            if (data.respuesta.data) {
                MResponse['modificado'] = true;
                MResponse['data'] = data.respuesta.data;
                $rootScope.$broadcast('custom_response', MResponse);
            }
        });
    };

});

UPapp.controller('Modal_ModifyConcepto', function ($scope, adminService, $rootScope) {
    $scope.concepto = [];
    $scope.concepto['id'] = $scope.data_modal['id'];
    $scope.concepto['nombre'] = $scope.data_modal['concepto'];
    $scope.concepto['descripcion'] = $scope.data_modal['descripcion'];
    $scope.Modify = function () {
        $scope.$parent.isBusy = true;
        adminService.ModifyConcepto($scope.concepto).then(function (data) {
            var MResponse = [];
            $scope.$parent.isBusy = false;
            if (data.respuesta.data) {
                MResponse['modificado'] = true;
                MResponse['data'] = data.respuesta.data;
                $rootScope.$broadcast('custom_response', MResponse);
            }
        });
    };
});
UPapp.controller('Alumnos_consultas', function ($scope, adminService, $filter, $modal) {
    $scope.maxSize = 10;
    $scope.items_per_page = 50;
    var filter = [];
    adminService.getalumnos().then(function (data) {
        $scope.model = {
            filter: {
                carrera: null,
                grupo: null,
                grado: null
            }
        };
        $scope.alumnos = data;
        filter = $scope.alumnos;
        $scope.bigTotalItems = filter.length;
        $scope.bigCurrentPage = 1;
        $scope.carreras = [];
        $scope.grupos = [];
        $scope.grados = [];
        angular.forEach(data, function (value, genre) {
            if ($scope.carreras.indexOf(value.carrera) == -1)
            {
                $scope.carreras.push(value.carrera);
            }
            if ($scope.grupos.indexOf(value.grupo) == -1)
            {
                if (value.grupo !== null) {
                    $scope.grupos.push(value.grupo);
                }
            }
            if ($scope.grados.indexOf(value.grado) == -1)
            {
                if (value.grado !== null) {
                    $scope.grados.push(value.grado);
                }

            }
        });
        render_table();
    }, function (err) {

    });
    $scope.Consultar = function (html, data) {
        $modal.open({
            templateUrl: 'partials/administrador/alumnos/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                custom_data: function () {
                    return data;
                }
            }
        });
    };

    $scope.$watchCollection('bigCurrentPage', function () {
        if ($scope.bigCurrentPage) {
            render_table();
        }
    });

    $scope.search_filters = function () {
        filter = $filter('getAllObjectsByProperty')('carrera', $scope.model.filter.carrera, $scope.alumnos);
        filter = $filter('getAllObjectsByProperty')('grado', $scope.model.filter.grado, filter);
        filter = $filter('getAllObjectsByProperty')('grupo', $scope.model.filter.grupo, filter);
        filter = $filter('filter')(filter, {matricula: $scope.model.filter.matricula});
        $scope.bigTotalItems = filter.length;
        $scope.bigCurrentPage = 1;
        //console.log($scope.alumnos);
        render_table();
    };

    var render_table = function () {
        var begin = (($scope.bigCurrentPage - 1) * $scope.items_per_page)
                , end = begin + $scope.items_per_page;
        //console.log(filter.slice(begin, end));
        if (filter) {
            $scope.filteredAlumnos = filter.slice(begin, end);
        }
    };
    $scope.Buscar_alumno = function (html) {
        var SearchInstance = $modal.open({
            templateUrl: 'partials/administrador/alumnos/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'md',
            resolve: {
                custom_data: function () {
                    return false;
                }
            }
        });

        SearchInstance.result.then(function (searchParams) {
            filter = $filter('getAllObjectsByProperty')('carrera', $scope.model.filter.carrera, $scope.alumnos);
            filter = $filter('getAllObjectsByProperty')('grado', $scope.model.filter.grado, filter);
            filter = $filter('getAllObjectsByProperty')('grupo', $scope.model.filter.grupo, filter);
            filter = $filter('filter')(filter, {appat: searchParams.appat});
            filter = $filter('filter')(filter, {apmat: searchParams.apmat});
            filter = $filter('filter')(filter, {nom: searchParams.nom});
            $scope.bigTotalItems = filter.length;
            $scope.bigCurrentPage = 1;
            render_table();
        });
    };
});


UPapp.controller('Administracion_Generales_traductor_referencia', function ($scope, adminService, $modal) {
    $scope.model = [];
    $scope.obtener_datos = function () {
        console.log($scope.model);
        console.log($scope.model.referencia.split(","));
        adminService.getDatosReferencia($scope.model.referencia.split(",")).then(function (data) {
            console.log(data);
            $scope.datos_referencia = data.respuesta;
        });
    };
    $scope.Consultar = function (html, data) {
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
});


//UPapp.controller('Administracion_Generales_m_traductor_referencia', function ($scope, adminService, $modal) {
//    $scope.model = [];
//    $scope.obtener_datos = function () {
//        console.log($scope.model);
//        console.log($scope.model.referencia.split(","));
//        adminService.getDatosReferencia($scope.model.referencia.split(",")).then(function (data) {
//            console.log(data);
//            $scope.datos_referencia = data.respuesta;
//        });
//    };
//    $scope.Consultar = function (html, data) {
//        $modal.open({
//            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
//            controller: 'ModalInstanceCtrl',
//            size: 'md',
//            resolve: {
//                custom_data: function () {
//                    return data;
//                }
//            }
//        }); //    };
//}); 

UPapp.controller('Caja_Caja', function ($scope, adminService, $filter, $q) {
    var promises = [];
    $scope.model = [];
    var alumnos = false;
    var data_alumno = [];
    $scope.isBusy = true;
    $scope.model = [];
    $scope.formas = [{"id": "Efectivo"}];
    waitingDialog.show();
    promises.push(adminService.getPeriodos().then(function (data) {
        $scope.periodos = data;
        data.forEach(function (val, key) {
            if (val.actual == 1) {
                $scope.model.periodo = $scope.periodos[key];
            }
        });
        return true;
    }, function (err) {
    }));
    promises.push(adminService.getalumnos().then(function (data) {
        alumnos = data;
        return true;
    }, function (err) {
    }));
    $q.all(promises).then(function (data) {
        $scope.isBusy = false;
        waitingDialog.hide();
    });
    $scope.student_found = false;
    $scope.Alumno_Buscar = function () {
        var found = $filter('getByProperty')('matricula', $scope.model.matricula, alumnos);
        if (found) {
            $scope.student_found = true;
            $scope.alerts = [];
            $scope.model.alumno_data = found;
            get_adeudos_alumno();
        } else {
            $scope.student_found = false;
            $scope.model.alumno_data = [];
            $scope.alerts = [
                {type: 'danger', msg: 'La matricula especificada no se pudo encontrar.'}
            ];
        }
    };
    $scope.adeudo_confirm = [];
    $scope.Pagar_Adeudos = function () {
        $scope.isBusy = true;
        angular.forEach($scope.adeudo_confirm.add, function (value) {
            adminService.updateAdeudostatus(value).then(function (data) {
            }, function (err) {
            });
        });
        $scope.adeudo_confirm = [];
        get_adeudos_alumno();
    };
    var get_adeudos_alumno = function () {
        $scope.isBusy = true;
        data_alumno['id_persona'] = $scope.model.alumno_data.idpersonas;
        data_alumno['periodo'] = $scope.model.periodo;
        adminService.getAdeudosAlumno(data_alumno).then(function (data) {
            $scope.isBusy = false;
            $scope.adeudos = data.respuesta;
        }, function (err) {
        });
    };
});
UPapp.controller('Administracion_Generales_registro_pago', function ($scope, adminService, $filter, $q,$modal) {
    $scope.maxSize = 10;
    $scope.items_per_page = 50;
    adminService.getalumnos().then(function (data) {
        $scope.model = {
            filter: {
                carrera: false,
                grupo: null,
                grado: null
            }
        };
        $scope.alumnos = data;
        $scope.carreras = [];
        $scope.grupos = [];
        $scope.grados = [];
        angular.forEach(data, function (value, genre) {
            if ($scope.carreras.indexOf(value.carrera) == -1)
            {
                $scope.carreras.push(value.carrera);
            }
            if ($scope.grupos.indexOf(value.grupo) == -1)
            {
                if (value.grupo !== null) {
                    $scope.grupos.push(value.grupo);
                }
            }
            if ($scope.grados.indexOf(value.grado) == -1)
            {
                if (value.grado !== null) {
                    $scope.grados.push(value.grado);
                }

            }
        });
        filteredAlumnos = $scope.alumnos;
        $scope.bigTotalItems = $scope.alumnos.length;
        $scope.bigCurrentPage = 1;
        $scope.model.filter.carrera = null;
    }, function (err) {

    });
    var filteredAlumnos = [];

    $scope.$watchCollection('bigCurrentPage', function () {
        //console.log($scope.bigCurrentPage);
        if ($scope.bigCurrentPage) {
            render_table();
        }
    });
    $scope.VerAdeudos = function (html, data) {
        $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                custom_data: function () {
                    return data;
                }
            }
        });
    };
    $scope.model = [];
    $scope.make_filters = function () {
        console.log($scope.model);
        filteredAlumnos = $filter('getAllObjectsByProperty')('carrera', $scope.model.filter.carrera, $scope.alumnos);
        filteredAlumnos = $filter('getAllObjectsByProperty')('grado', $scope.model.filter.grado, filteredAlumnos);
        filteredAlumnos = $filter('getAllObjectsByProperty')('grupo', $scope.model.filter.grupo, filteredAlumnos);
        filteredAlumnos = $filter('filter')(filteredAlumnos, {matricula: $scope.model.filter.matricula});
        $scope.bigTotalItems = filteredAlumnos.length;
        $scope.bigCurrentPage = 1;
        render_table();
        // console.log(filteredAlumnos);
    };


    var render_table = function () {
        var begin = (($scope.bigCurrentPage - 1) * $scope.items_per_page)
                , end = begin + $scope.items_per_page;
        //console.log(filter.slice(begin, end));
        if (filteredAlumnos) {
            $scope.filteredAlumnos = filteredAlumnos.slice(begin, end);
        }
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
            //console.log(searchParams);
            filteredAlumnos = $filter('getAllObjectsByProperty')('carrera', $scope.model.filter.carrera, $scope.alumnos);
            filteredAlumnos = $filter('getAllObjectsByProperty')('grado', $scope.model.filter.grado, filteredAlumnos);
            filteredAlumnos = $filter('getAllObjectsByProperty')('grupo', $scope.model.filter.grupo, filteredAlumnos);
            filteredAlumnos = $filter('filter')(filteredAlumnos, {appat: searchParams.appat});
            filteredAlumnos = $filter('filter')(filteredAlumnos, {apmat: searchParams.apmat});
            filteredAlumnos = $filter('filter')(filteredAlumnos, {nom: searchParams.nom});
            console.log(filteredAlumnos);
            $scope.bigTotalItems = filteredAlumnos.length;
            $scope.bigCurrentPage = 1;
            render_table();
        });
    };
});

