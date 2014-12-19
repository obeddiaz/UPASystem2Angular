UPapp.controller('Administracion_Generales', function ($scope, $routeParams) {
    //console.log($routeParams);
    $scope.tabs = [
        {title: 'Planes de Pago', click: 'planes_de_pago'},
        {title: 'Conceptos', click: 'conceptos'},
        {title: 'Bancos', click: 'bancos'},
        {title: 'Adeudo Simple', click: 'single_adeudo'}
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
    //console.log($scope.data_modal);
    $scope.model = [];
    $scope.scp = [];
    adminService.getPeriodos().then(function (data) {
        $scope.periodos = data;
        //console.log(data);
        data.forEach(function (val, key) {
            if (val.actual == 1) {
                $scope.model.periodo = $scope.periodos[key];
            }
        });
        adminService.getconceptos().then(function (data) {
            $scope.conceptos = data.respuesta.data;
            $scope.model.concepto = $scope.conceptos[0];
            console.log(data);
            $scope.getSubconceptos();
        });
        $scope.get_scp();
        //console.log($scope.model.periodo);

    }, function (err) {
    });
    $scope.getSubconceptos = function () {
        console.log($scope.model);
        var t_sc = $scope.model;
        adminService.getSubConceptos(t_sc.concepto.id, t_sc.periodo.idperiodo, t_sc.nivel).then(function (data) {
            $scope.subconceptos = data.respuesta.data;
            $scope.model.subconcepto = $scope.subconceptos[0];
            console.log(data);
        });
    };
    adminService.getNiveles().then(function (data) {
        //console.log(data);
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
//        $scope.data_subconcepto.forEach(function (key, val) {
//            dataSCPaquete['recargo'][key] = val.recargo;
//            dataSCPaquete['tipo_recargo'][key] = val.tipo_recargo;
//        });
        dataSCPaquete['recargo'] = {};
        dataSCPaquete['tipo_recargo'] = {};
        for (x in $scope.data_subconcepto) {
            dataSCPaquete['recargo'][x] = $scope.data_subconcepto[x].recargo;
            dataSCPaquete['tipo_recargo'][x] = $scope.data_subconcepto[x].tipo_recargo;
        }
        //dataSCPaquete['recargo'] = $scope.data_subconcepto;
        //console.log(dataSCPaquete);
        adminService.addSCPaquete(dataSCPaquete).then(function (data) {
            $scope.$parent.isBusy = false;
            console.log(data);
        });
        //console.log($scope.data_subconcepto);
    };
    $scope.tipo_adeudo = [{
            name: 'Porcentaje', value: 1
        }, {
            name: 'Importe', value: 2
        }];
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
    var datos_paquete = [];
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
        adminService.getconceptos().then(function (data) {
            $scope.conceptos = data.respuesta.data;
            $scope.model.concepto = $scope.conceptos[0];
            adminService.getNiveles().then(function (data) {
                $scope.niveles = data.respuesta.data;
                $scope.model.nivel = Object.keys(data.respuesta.data)[0];
                $scope.getSubconceptos();
            });

        });
        $scope.getAdeudos();
    }, function (err) {
    });
    $scope.AddAdeudoalumno = function () {
        console.log($scope.model);
        adminService.addAdeudosimple($scope.model).then(function (data) {
            console.log(data);
        });
    };
    $scope.tipodePago = [
        {text: 'Banco', value: 1},
        {text: 'Caja', value: 2}
    ];
    console.log($scope.data_modal);
});