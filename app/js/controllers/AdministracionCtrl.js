UPapp.controller('Administracion_Generales', function ($scope) {
    $scope.tabs = [
        {title: 'Planes de Pago', click: 'planes_de_pago'},
        {title: 'Conceptos', click: 'conceptos'},
        {title: 'Bancos', click: 'bancos'},
        {title: 'Adeudo Simple', click: 'single_adeudo'},
        {title: 'Archivo Referencias', click: 'subir_referencias'},
        {title: 'Becas', click: 'becas'},
        {title: 'Reportes', click: 'reportes'},
        {title: 'Traducir Referencia', click: 'referencias'}
        //{title: 'Ingresos', click: 'ingresos'}
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


UPapp.controller('Administracion_Generales_reportes', function ($scope, $routeParams, adminService, $modal) {
    $scope.model = [];
    $scope.sort_reporte = [];
    $scope.sort_title = [];
    $scope.format = 'dd-MMMM-yyyy';
    $scope.isBusy = true;
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
//    $scope.toggleMin = function () {
//        $scope.minDate = $scope.minDate ? null : new Date();
//    };
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
    $scope.obtener_adeudos = function () {
        console.log($scope.model);
        $scope.isBusy = true;
        adminService.getAdeudosReporte($scope.model).then(function (data) {
            $scope.isBusy = false;
            //console.log(data);
            console.log(data.respuesta.data.length);
            $scope.bigTotalItems = data.respuesta.data.length;
            $scope.bigCurrentPage = 1;
            $scope.maxSize = 10;
            $scope.items_per_page=30;
            $scope.Adeudos = data.respuesta.data;
        });
    };

    $scope.$watchCollection('bigCurrentPage', function () {
        if ($scope.bigCurrentPage) {
            var begin = (($scope.bigCurrentPage - 1) * $scope.items_per_page)
                    , end = begin + $scope.items_per_page;

            $scope.filteredTodos = $scope.Adeudos.slice(begin, end);
            //console.log($scope.filteredTodos);
        }
    });

    $scope.add_new = function (data, title) {
        var index = $scope.sort_reporte.indexOf(data);
        var index_title = $scope.sort_title.indexOf(title);
        if (index > -1) {
            $scope.sort_reporte.splice(index, 1);
        } else {
            $scope.sort_reporte.push(data);
        }
        if (index_title > -1) {
            $scope.sort_title.splice(index_title, 1);
        } else {
            $scope.sort_title.push(title);
        }
        console.log($scope.sort_reporte);
    };

//    adminService.getAlladeudos().then(function (data) {
//        console.log(data);
//        $scope.Adeudos = data.respuesta;
//    });


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

UPapp.controller('Administracion_Generales_becas', function ($scope, adminService, $modal) {
    var BTemp = false;
    adminService.getBecas().then(function (data) {
        if (data.respuesta.data) {
            $scope.becas = data.respuesta.data;
        }
    }, function (err) {
    });
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

UPapp.controller('Administracion_Generales_fileReferencias', function ($scope, adminService, $modal) {
    $scope.model = [];
    $scope.upload_file = function () {
        $scope.isBusy = true;
        adminService.SubirReferencias($scope.model.file).then(function (data) {
            $scope.isBusy = false;
            console.log(data);
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

UPapp.controller('Administracion_Agrupaciones_showalumnos', function ($scope, $routeParams, adminService, $q, $timeout) {
    var promises = [];
    var alumnos = [];
    var carreras = [];
    var grados = [];
    var grupos = [];
    $scope.paquete_periodo = false;
    $scope.alumnos_show = true;
    $scope.alumnos_todos = false;
    $scope.alumnos_inscritos = true;
    $scope.model = [];
    $scope.isBusy = true;
    waitingDialog.show();
    promises.push(adminService.getalumnos().then(function (data) {
        alumnos.NoInscritos = data;
        carreras.NoInscritos = [];
        grupos.NoInscritos = [];
        grados.NoInscritos = [];
        angular.forEach(data, function (value, genre) {
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
        return true;
    }, function (err) {

    }));
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
    $q.all(promises).then(function (data) {
        waitingDialog.hide();
        $scope.isBusy = false;
        $scope.aif();
    });
    $scope.Insc_NoInsc = function () {
        $scope.model.filter = {
            carrera: false,
            grupo: false,
            grado: false
        };
        $scope.alumno_assign.add = [];
        if ($scope.alumnos_show) {
            $scope.alumnos_show = false;
            $scope.alumnos = alumnos.Inscritos;
            $scope.carreras = carreras.Inscritos;
            $scope.grupos = grupos.Inscritos;
            $scope.grados = grados.Inscritos;
            if ($scope.carreras) {
                $scope.model.filter.carrera = $scope.carreras[0];
            }

        } else {
            $scope.alumnos_show = true;
            $scope.alumnos = alumnos.NoInscritos;
            $scope.carreras = carreras.NoInscritos;
            $scope.grupos = grupos.NoInscritos;
            $scope.grados = grados.NoInscritos;
            if ($scope.carreras) {
                $scope.model.filter.carrera = $scope.carreras[0];
            }
        }
    };
    $scope.aif = function () {
        $scope.isBusy = true;
        adminService.getAlumnosPaquete($scope.model.periodo.idperiodo, $scope.data_plan.id).then(function (data) {
            $scope.isBusy = false;
            if (!data.error) {
                console.log(data);
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
                $scope.alerts = false;
                $scope.Insc_NoInsc();
            } else {
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
    $scope.checkAll = function () {
        $scope.alumno_assign.add = $scope.filteredAlumnos.map(function (item) {
            return item.idpersonas;
        });
    };
    $scope.uncheckAll = function () {
        $scope.alumno_assign.add = [];
    };
    $scope.asignar_alumnos = function () {
        $scope.isBusy = true;
        if ($scope.paquete_periodo) {
            adminService.setAdeudosalumno($scope.paquete_periodo.id, $scope.alumno_assign.add).then(function (data) {
                console.log(data);
                $scope.isBusy = false;
                $scope.aif();
                $scope.alertsAdded = [
                    {type: 'success', msg: 'Los alumnos seleccionados han sido añadidos Correctamente'}
                ];
            }, function (err) {

            });
        }
    };
});

UPapp.controller('ModalInstanceCtrl', function ($scope, $modalInstance, custom_data, $rootScope) {
    $scope.data_modal = custom_data;
    $scope.isBusy = false;
    $scope.return_data = [];
    $scope.$on('custom_response', function (event, args) {
        $rootScope.$broadcast('modal_response', args);
    });
    $scope.ok = function () {
        $modalInstance.close($scope.return_data);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

UPapp.controller('Modal_conceptosCtrl', function ($scope, adminService) {
    $scope.isBusy = true;
    $scope.new_sc = [];
    $scope.subconceptos = [];
    $scope.model = [];
    $scope.tipo_adeudo = [{
            name: 'Monetario', value: 1
        }, {
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
        adminService.addSubConcepto($scope.new_sc).then(function (data) {
            $scope.$parent.isBusy = false;
            if (!data.error) {
                $scope.subconceptos.push(data.respuesta);
                $scope.alerts = [];
            }
        });
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
        formatYear: 'yy',
        startingDay: 1
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
        $scope.get_scp();
        _PeriodosReady();
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
    $scope.getSubconceptos = function () {
        var t_sc = $scope.model;
        adminService.getAllSubConceptos(t_sc.concepto.id).then(function (data) {
            console.log(data);
            if (data.respuesta.data) {
                $scope.subconceptos = data.respuesta.data;
                $scope.model.subconcepto = $scope.subconceptos[0];
            }
        });
    };
    adminService.getNiveles().then(function (data) {
        $scope.niveles = data.respuesta.data;
        $scope.model.nivel = Object.keys(data.respuesta.data)[0];
    });
    $scope.AddSCPaquete = function () {
        $scope.scp.push(angular.fromJson(angular.toJson($scope.model.subconcepto)));
        $scope.filldataSC();
        $scope.scp_show = true;
    };
    $scope.SaveSCPaquete = function () {
        if ($scope.scp.length == 0) {
            return;
        }
        $scope.$parent.isBusy = true;
        var dataSCPaquete = [];
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
            if (parseInt(val.recargo_acumulado)==1){
                dataSCPaquete['sub_concepto'][temp_count]['recargo_acumulado'] = parseInt(val.recargo_acumulado);
            }else{
                dataSCPaquete['sub_concepto'][temp_count]['recargo_acumulado'] = 0;
            }
            
            //console.log(val);
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
            console.log(data);
        });
    };
    $scope.tipo_adeudo = [
        {name: 'Porcentaje', value: 1},
        {name: 'Importe', value: 2}
    ];
    $scope.filldataSC = function () {
        $scope.data_subconcepto = {};
        $scope.scp.forEach(function (val, key) {
            $scope.scp[key].opened = false;
            $scope.scp[key].digito_referencia = parseInt($scope.scp[key].digito_referencia);
            $scope.scp[key].recargo_acumulado = parseInt($scope.scp[key].recargo_acumulado);
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
        $scope.model.tipos_pago = false;
        adminService.getSubConceptosPlan($scope.data_modal.id, $scope.model.periodo.idperiodo).then(function (data) {
            console.log(data);
            if (!data.error) {
                datos_paquete = data.respuesta.paquete;
                $scope.pqt_exists = true;
                $scope.scp_show = true;
                $scope.scp = data.respuesta.data;
                console.log(data.respuesta.data);
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
            $scope.model['subcidios_id'] = $scope.data_modal['subcidios_id'];
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

UPapp.controller('Administracion_Generales_descuentos', function ($scope, adminService, $rootScope, $modal) {
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
                }
            }
        });
    };
});

UPapp.controller('Administracion_Generales_single_adeudo', function ($scope, adminService, $rootScope, $modal) {
    adminService.getalumnos().then(function (data) {

        $scope.model = {
            filter: {
                carrera: false,
                grupo: false,
                grado: false
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
                }
            }
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
    $scope.tipodePago = [
        {text: 'Banco', value: 1},
        {text: 'Caja', value: 2}
    ];
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    $scope.format = 'dd-MMMM-yyyy';
});

UPapp.controller('Modal_NewBeca', function ($scope, adminService, $rootScope) {
    $scope.model = [];
    adminService.getCatalogos().then(function (data) {
        if (data.respuesta.data) {
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


UPapp.controller('Modal_AlumnosBeca', function ($scope, adminService, $rootScope) {
    $scope.model = [];
    $scope.model['idbeca'] = $scope.data_modal['id'];
    var alm_insc = false;
    var alm_insc_car = [];
    var alm_noinsc = false;
    var alm_noinsc_car = [];
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
        $scope.insc_noinsc();
    };
    $scope.insc_noinsc = function () {
        $scope.alumno_filter = [];
        $scope.carreras = false;
        if ($scope.show_alumnos) {
            $scope.show_alumnos = false;
            $scope.alumnos = alm_insc;
            $scope.carreras = alm_insc_car;
            $scope.alumno_filter.carrera = alm_insc_car[0];
        } else {
            $scope.show_alumnos = true;
            $scope.alumnos = alm_noinsc;
            $scope.carreras = alm_noinsc_car;
            $scope.alumno_filter.carrera = alm_noinsc_car[0];
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
                $scope.alumnos = alm_noinsc;
                $scope.alumno_filter.carrera = alm_noinsc_car[0];
            }
        });
    };
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

UPapp.controller('Alumnos_consultas', function ($scope, adminService, $rootScope, $modal) {
    adminService.getalumnos().then(function (data) {
        $scope.model = {
            filter: {
                carrera: false,
                grupo: false,
                grado: false
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
        adminService.getAdeudosAlumno($scope.model).then(function (data) {
            if (data.respuesta) {
                $scope.adeudos = data.respuesta;
            }
        }, function (err) {
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
//        });
//    };
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
    promises.push(adminService.getAllalumnos().then(function (data) {
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