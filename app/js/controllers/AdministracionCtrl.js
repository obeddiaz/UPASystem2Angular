UPapp.controller('Administracion_Generales', function ($scope, $routeParams) {
    //console.log($routeParams);
    $scope.tabs = [
        {title: 'Planes de Pago', click: 'planes_de_pago'},
        {title: 'Conceptos', click: 'conceptos'},
        {title: 'Bancos', click: 'bancos'},
        {title: 'Adeudo Simple', click: 'single_adeudo'},
        {title: 'Archivo Referencias', click: 'subir_referencias'},
        {title: 'Becas', click: 'becas'},
        {title: 'Descuentos', click: 'descuentos'}
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

    $scope.$on('modal_response', function (event, args) {
        $scope.planes.push(args);
    });
});


UPapp.controller('Administracion_Generales_adeudos', function ($scope, $routeParams, adminService, $modal) {
    //adminService
});

UPapp.controller('Administracion_Generales_bancos', function ($scope, $routeParams, adminService, $modal) {
    var BTemp = false;
    var Cuentas;
    var CPB = function (id) {
        console.log(id);
        var CuentaData = [];
        Cuentas.forEach(function (val, key) {
            if (val.bancos_id === id) {
                CuentaData.push(val);
            }
        });
        console.log(CuentaData);
        return CuentaData;
    };
    adminService.getBancos().then(function (response) {
        console.log(response);
        $scope.bancos = response.respuesta.data;
    });
    adminService.getCuentasBanco().then(function (response) {
        console.log(response);
        Cuentas = response.respuesta.data;
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
        console.log(bid);
        adminService.DeleteBanco(bid).then(function (data) {
            $scope.bancos = data.respuesta.data;
        });
    };
    $scope.CuentasBanco = function (html, data) {
        $modal.open({
            templateUrl: 'partials/administrador/administracion/generales/modal/' + html + '.html',
            controller: 'ModalInstanceCtrl',
            size: 'sm',
            resolve: {
                custom_data: function () {
                    return {banco: data, cuentas: CPB(data.id)};
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
    adminService.getconceptos().then(function (data) {
        //console.log(data);
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
    $scope.Nuevo_Concepto = function (html) {
//        var modalInstance = 
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
//        modalInstance.result.then(function (data) {
//            $scope.conceptos.push(data);
//        }, function () {
//            console.log('Modal dismissed at: ' + new Date());
//        });
    };
    $scope.$on('modal_response', function (event, args) {
        // $scope.return_data = args;
        $scope.conceptos.push(args);
        //$rootScope.$broadcast('modal_response', args);
    });
});

UPapp.controller('Administracion_Generales_becas', function ($scope, adminService, $modal) {
    var BTemp = false;
    adminService.getBecas().then(function (data) {
        if (data.respuesta.data) {
            $scope.becas = data.respuesta.data;
        }

        console.log(data);
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
        console.log($scope.model.file);
        adminService.SubirReferencias($scope.model.file).then(function (data) {
            console.log(data);
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
            //console.log(custom_data);
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
        //console.log(data);
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
                //console.log(data);
            }, function (err) {

            });
        }
    };
    //
});

UPapp.controller('ModalInstanceCtrl', function ($scope, $modalInstance, custom_data, $rootScope) {
    //console.log(custom_data);
    $scope.data_modal = custom_data;
    $scope.isBusy = false;
    $scope.return_data = [];
    $scope.$on('custom_response', function (event, args) {
        // $scope.return_data = args;
        $rootScope.$broadcast('modal_response', args);
    });
    $scope.ok = function () {
        //console.log($scope.isBusy);
        //console.log($scope.return_data);

        $modalInstance.close($scope.return_data);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

UPapp.controller('Modal_conceptosCtrl', function ($scope, adminService) {
    //console.log($scope.data_modal);
    //console.log($scope.$parent.isBusy);
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
            if (val.actual === 1) {
                $scope.model.periodo = $scope.periodos[key];
            }
        });
        adminService.getNiveles().then(function (data) {
            //console.log(data);
            $scope.niveles = data.respuesta.data;
            $scope.model.nivel = Object.keys(data.respuesta.data)[0];
            $scope.getSubConceptos();
        });

    }, function (err) {
    });
    //console.log($scope.data_modal);
    $scope.getSubConceptos = function () {
        $scope.$parent.isBusy = true;
        //console.log($scope.data_modal.id);
        //console.log($scope.model.periodo);
        //console.log($scope.model.nivel);
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
        //console.log($scope.new_sc);
        adminService.addSubConcepto($scope.new_sc).then(function (data) {
            $scope.$parent.isBusy = false;
            //console.log(data.respuesta);
            if (!data.error) {
                $scope.subconceptos.push(data.respuesta);
            }
        });
    };
});

UPapp.controller('Modal_planCtrl', function ($scope, adminService) {
    var datos_paquete = [];
    $scope.model = [];
    $scope.scp = [];
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
        //console.log(err);
    });
    var _PeriodosReady = function () {
        adminService.getconceptos().then(function (data) {
            if (data.respuesta.data) {
                $scope.conceptos = data.respuesta.data;
                $scope.model.concepto = $scope.conceptos[0];
                $scope.getSubconceptos();
            }
            //console.log(data);
        });
    };
    $scope.getSubconceptos = function () {
        console.log($scope.model);
        var t_sc = $scope.model;
        adminService.getSubConceptos(t_sc.concepto.id, t_sc.periodo.idperiodo, t_sc.nivel).then(function (data) {
            if (data.respuesta.data) {
                $scope.subconceptos = data.respuesta.data;
                $scope.model.subconcepto = $scope.subconceptos[0];
            }
            console.log(data);
        });
    };
    adminService.getNiveles().then(function (data) {
        $scope.niveles = data.respuesta.data;
        $scope.model.nivel = Object.keys(data.respuesta.data)[0];
    });
    $scope.AddSCPaquete = function () {
        console.log($scope.scp);
        $scope.scp.push(angular.fromJson(angular.toJson($scope.model.subconcepto)));
        $scope.filldataSC();
        $scope.scp_show = true;
    };
    $scope.SaveSCPaquete = function () {
        $scope.$parent.isBusy = true;
        var dataSCPaquete = [];
        console.log(datos_paquete);
        dataSCPaquete['paquete_id'] = datos_paquete.id;
        dataSCPaquete['sub_concepto'] = {};
        var temp_count = 0;
        $scope.scp.forEach(function (val) {
            dataSCPaquete['sub_concepto'][temp_count] = {};
            dataSCPaquete['sub_concepto'][temp_count]['fecha'] = val.fecha_de_vencimiento;
            dataSCPaquete['sub_concepto'][temp_count]['id'] = val.id;
            temp_count++;
        });
        dataSCPaquete['recargo'] = {};
        dataSCPaquete['tipo_recargo'] = {};
        for (x in $scope.data_subconcepto) {
            dataSCPaquete['recargo'][x] = $scope.data_subconcepto[x].recargo;
            dataSCPaquete['tipo_recargo'][x] = $scope.data_subconcepto[x].tipo_recargo;
        }
        adminService.addSCPaquete(dataSCPaquete).then(function (data) {
            $scope.$parent.isBusy = false;
            console.log(data);
        });
    };
    $scope.tipo_adeudo = [
        {name: 'Porcentaje', value: 1},
        {name: 'Importe', value: 2}
    ];
    $scope.filldataSC = function () {
        $scope.data_subconcepto = {};
        $scope.scp.forEach(function (val) {
            if (!$scope.data_subconcepto[val.id])
            {
                $scope.data_subconcepto[val.id] = [];
                $scope.data_subconcepto[val.id]['nombre'] = val.sub_concepto;
                $scope.data_subconcepto[val.id]['tipo_recargo'] = val.tipo_recargo;
                $scope.data_subconcepto[val.id]['recargo'] = val.recargo;
            }
        });
    };

    $scope.get_scp = function () {
        adminService.getSubConceptosPlan($scope.data_modal.id, $scope.model.periodo.idperiodo).then(function (data) {
            if (!data.error) {
                console.log(data);
                datos_paquete = data.respuesta.paquete;
                $scope.scp_show = true;
                $scope.scp = data.respuesta.data;
                $scope.filldataSC();
            }
        });
    };
    $scope.Nuevo_Paquete = function () {
        $scope.model['id_plandepago'] = $scope.data_modal.id;
        //console.log($scope.model);
        adminService.addPaquetePlan($scope.model).then(function (data) {
            //console.log(data);
        });
    };
    $scope.tipodePago = [
        {text: 'Banco', value: 1},
        {text: 'Caja', value: 2}
    ];
});

UPapp.controller('Modal_NewConcepto', function ($scope, adminService, $rootScope) {
    $scope.$parent.isBusy = false;
    //console.log($scope.$parent.return_data);
    $scope.$parent.return_data = [{'test': 'test'}];

    $scope.add_new = function () {
        $scope.$parent.isBusy = true;
        adminService.addConcepto($scope.concepto).then(function (data) {
            $scope.$parent.isBusy = false;
            $rootScope.$broadcast('custom_response', data.respuesta.data);
            $scope.$parent.isBusy = false;
            //console.log(data);
        });
    };
});

UPapp.controller('Modal_NewPlan', function ($scope, adminService, $rootScope) {
    $scope.model = [];
    adminService.getAgrupaciones().then(function (data) {
        //console.log(data);
        $scope.agrupaciones = data;
        $scope.model.agrupacion = $scope.agrupaciones[0];
    });
    $scope.add_newPlan = function () {
        $scope.$parent.isBusy = true;
        adminService.addPlandePago($scope.model).then(function (data) {
            //console.log(data);
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
            console.log(data);
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
        });
    };
});

UPapp.controller('Modal_ModifyBeca', function ($scope, adminService, $rootScope) {
    $scope.model = [];
    console.log($scope.data_modal);
    $scope.model['id'] = $scope.data_modal['id'];
    $scope.model['importe'] = $scope.data_modal['importe'];
    $scope.model['abreviatura'] = $scope.data_modal['abreviatura'];
    $scope.model['descripcion'] = $scope.data_modal['descripcion'];
    adminService.getCatalogos().then(function (data) {
        console.log(data);
        if (data.respuesta.data) {
            $scope.model['periodicidades_id'] = $scope.data_modal['periodicidades_id'];
            $scope.model['tipo_importe_id'] = $scope.data_modal['tipo_importe_id'];
            $scope.model['subcidios_id'] = $scope.data_modal['subcidios_id'];
            $scope.catalogos = data.respuesta.data;
            $scope.model.tipo_importe_id = $scope.catalogos.tipo_importe[1].id;
            console.log($scope.catalogos.tipo_importe);
        }
    });
    $scope.Modify = function () {
        $scope.$parent.isBusy = true;
        adminService.ModifyBeca($scope.model).then(function (data) {
            console.log(data);
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


UPapp.controller('Modal_cuentasBanco', function ($scope, adminService, $rootScope) {
    $scope.model = [];
    console.log($scope.data_modal);
    $scope.cuentas = $scope.data_modal.cuentas;
    $scope.model['bancos_id'] = $scope.data_modal.banco.id;
    $scope.AddCuenta = function () {
        $scope.$parent.isBusy = true;
        adminService.addCuentaBanco($scope.model).then(function (data) {
            $scope.$parent.isBusy = false;
            $scope.cuentas.push(data.respuesta.data);
        });
    };
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
        //console.log(data);
        $scope.alumnos = data;
        $scope.carreras = [];
        $scope.grupos = [];
        $scope.grados = [];
        angular.forEach(data, function (value, genre) {
            if ($scope.carreras.indexOf(value.carrera) === -1)
            {
                $scope.carreras.push(value.carrera);
            }
            if ($scope.grupos.indexOf(value.grupo) === -1)
            {
                if (value.grupo !== null) {
                    $scope.grupos.push(value.grupo);
                }
            }
            if ($scope.grados.indexOf(value.grado) === -1)
            {
                if (value.grado !== null) {
                    $scope.grados.push(value.grado);
                }

            }
        });
        console.log($scope.grados);
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
        //console.log(data);
        $scope.alumnos = data;
        $scope.carreras = [];
        $scope.grupos = [];
        $scope.grados = [];
        angular.forEach(data, function (value, genre) {
            if ($scope.carreras.indexOf(value.carrera) === -1)
            {
                $scope.carreras.push(value.carrera);
            }
            if ($scope.grupos.indexOf(value.grupo) === -1)
            {
                if (value.grupo !== null) {
                    $scope.grupos.push(value.grupo);
                }
            }
            if ($scope.grados.indexOf(value.grado) === -1)
            {
                if (value.grado !== null) {
                    $scope.grados.push(value.grado);
                }

            }
        });
        console.log($scope.grados);
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

UPapp.controller('Modal_generarAdeudos', function ($scope, adminService, $rootScope) {
    $scope.model = [];
    $scope.model.id_persona = $scope.data_modal.idpersonas;
    $scope.getSubconceptos = function () {
        console.log($scope.model);
        var t_sc = $scope.model;
        adminService.getSubConceptos(t_sc.concepto.id, t_sc.periodo.idperiodo, t_sc.nivel).then(function (data) {
            $scope.subconceptos = data.respuesta.data;
            $scope.model.subconcepto = $scope.subconceptos[0];
            console.log(data);
        });
    };
    $scope.getAdeudos = function () {
        console.log($scope.model);
        adminService.getAdeudosAlumno($scope.model).then(function (data) {
            console.log(data);
            $scope.adeudos = data.respuesta;
            console.log($scope.adeudos);
        }, function (err) {
        });
    };
    adminService.getPeriodos().then(function (data) {
        $scope.periodos = data;
        data.forEach(function (val, key) {
            if (val.actual === 1) {
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
        console.log($scope.model);
        adminService.addAdeudosimple($scope.model).then(function (data) {
            //console.log(data);
            $scope.adeudos.push(data.respuesta);
        });
    };
    $scope.tipodePago = [
        {text: 'Banco', value: 1},
        {text: 'Caja', value: 2}
    ];
    console.log($scope.data_modal);
});

UPapp.controller('Modal_NewBeca', function ($scope, adminService, $rootScope) {
    $scope.model = [];
    adminService.getCatalogos().then(function (data) {
        console.log(data);
        if (data.respuesta.data) {
            $scope.catalogos = data.respuesta.data;
            $scope.model.tipo_importe_id = $scope.catalogos.tipo_importe[1].id;
            console.log($scope.catalogos.tipo_importe);
        }
    });
    $scope.addNewBeca = function () {
        console.log($scope.model);
        $scope.$parent.isBusy = true;
        adminService.addNuevaBeca($scope.model).then(function (data) {
            console.log(data);
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
    console.log($scope.data_modal);
    var alm_insc = false;
    var alm_insc_car = [];
    var alm_noinsc = false;
    var alm_noinsc_car = [];
    $scope.show_alumnos = true;
    //$scope.carreras = [];
    $scope.$parent.isBusy = true;
    adminService.getPeriodos().then(function (data) {
        $scope.$parent.periodos = data;
        data.forEach(function (val, key) {
            if (val.actual === 1) {
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
        console.log($scope.model);
        adminService.getAlumnosBecas($scope.model).then(function (data) {
            $scope.$parent.isBusy = false;
            if (data.respuesta.data) {
                //$scope.alumnos = data.respuesta.data;
                console.log(data);
                alm_insc = data.respuesta.data;
                //$scope.alumnos = data.respuesta.data;
                //$scope.carreras = [];
                angular.forEach(data.respuesta.data, function (value, genre) {
                    //console.log($scope.carreras.indexOf(value.carrera));
                    if (alm_insc_car.indexOf(value.carrera) === -1)
                    {
                        alm_insc_car.push(value.carrera);
                    }
                });
                //console.log(alm_insc_car);
                $scope.insc_noinsc();
            }
        });
        adminService.getAlumnosNoBecas($scope.model).then(function (data) {
            if (data.respuesta.data) {
                console.log(data);
                alm_noinsc = data.respuesta.data;
                angular.forEach(data.respuesta.data, function (value, genre) {
                    if (alm_noinsc_car.indexOf(value.carrera) === -1)
                    {
                        alm_noinsc_car.push(value.carrera);
                    }
                });
            }
        });
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
        console.log($scope.carreras);
    };
    $scope.add = function () {
        console.log($scope.model);
        $scope.$parent.isBusy = true;
        adminService.addNIAlumnosBeca($scope.model).then(function (data) {
            $scope.$parent.isBusy = false;
            if (data.respuesta.data) {
                alm_insc = data.respuesta.data;
                angular.forEach(data.respuesta.data, function (value, genre) {
                    if (alm_insc_car.indexOf(value.carrera) === -1)
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
        console.log($scope.model);
        adminService.reactivarBecaAlumno($scope.model).then(function (data) {
            $scope.$parent.isBusy = false;
            if (data.respuesta.data) {
                alm_insc = data.respuesta.data;
                angular.forEach(data.respuesta.data, function (value, genre) {
                    if (alm_insc_car.indexOf(value.carrera) === -1)
                    {
                        alm_insc_car.push(value.carrera);
                    }
                });
                $scope.model.idpersona = [];
                $scope.alumnos = alm_insc;
                $scope.alumno_filter.carrera = alm_insc_car[0];
            }
            console.log(data);
        });
    };
    $scope.deactivate = function () {
        $scope.$parent.isBusy = true;
        adminService.desactivarBecaAlumno($scope.model).then(function (data) {
            $scope.$parent.isBusy = false;
            if (data.respuesta.data) {
                alm_insc = data.respuesta.data;
                angular.forEach(data.respuesta.data, function (value, genre) {
                    if (alm_noinsc_car.indexOf(value.carrera) === -1)
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
