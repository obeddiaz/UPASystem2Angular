UPapp.factory('adminService', ['$http', '$q', '$window', 'cacheService', function ($http, $q, $window, cacheService) {
        //var deferred = $q.defer();
        var adminServiceFactory = {};
        var _getPlanesPago = function (Matricula) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/administracion/generales/planes_de_pago/todos')
                    .success(function (data) {
                        if (!data.error) {
                            deferred.resolve(data.respuesta.data);
                        }
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };

        var _getAgrupaciones = function () {
            var deferred = $q.defer();
            $http.get(serviceBase + '/administracion/agrupaciones')
                    .success(function (data) {
                        //console.log(data);
                        if (!data.error) {
                            deferred.resolve(data.respuesta.data);
                        }
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };

        var _getPlanesPagoAgrupacion = function (id) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/administracion/generales/planes_de_pago/todos_agrupaciones', {params: {id_agrupaciones: id}})
                    .success(function (data) {
                        //console.log(data);
                        if (!data.error) {
                            deferred.resolve(data.respuesta.data);
                        }
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };
        var _getalumnos = function () {
            var deferred = $q.defer();
            var cache = cacheService.get('alumnos');
            if (cache) {
                deferred.resolve(cache);
            }
            else {
                $http.get(serviceBase + '/alumnos')
                        .success(function (data) {
                            if (!data.error) {
                                cacheService.put('alumnos', data.respuesta.data);
                                deferred.resolve(data.respuesta.data);
                            }
                        }).
                        error(function (err, status) {
                            deferred.reject(err);
                        });
            }

            return deferred.promise;

        };

        var _setAdeudosalumno = function (paquete_id, id_personas) {
            var deferred = $q.defer();
            console.log(paquete_id);
            console.log(id_personas);
            $http.post(serviceBase + '/administracion/agrupaciones/alumnos_paquete/agregar', {"paquete_id": paquete_id, "id_personas": id_personas})
                    .success(function (data) {
                        console.log(data);
                    }).
                    error(function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };

        var _setAdeudosalumno = function (paquete_id, id_personas) {
            var deferred = $q.defer();
            console.log(paquete_id);
            console.log(id_personas);
            $http.post(serviceBase + '/administracion/agrupaciones/alumnos_paquete/agregar', {"paquete_id": paquete_id, "id_personas": id_personas})
                    .success(function (data) {
                        console.log(data);
                    }).
                    error(function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _getPeriodos = function () {
            var deferred = $q.defer();
            var cache = cacheService.get('periodos');
            if (cache) {
                deferred.resolve(cache);
            }
            else {
                $http.get(serviceBase + '/periodos')
                        .success(function (data) {
                            cacheService.put('periodos', data.respuesta.data);
                            deferred.resolve(data.respuesta.data);
                        }).
                        error(function (err, status) {
                            deferred.reject(err);
                        });
            }
            return deferred.promise;

        };

        var _getAlumnosPaquete = function (id_periodo, plan_pago) {
            var deferred = $q.defer();
            console.log(id_periodo);
            console.log(plan_pago);
            $http.get(serviceBase + '/administracion/generales/planes_de_pago/alumnos_paquete_alumno', {params: {id: plan_pago, periodo: id_periodo}})
                    .success(function (data) {
                        console.log(data);
                        deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _getconceptos = function () {
            var deferred = $q.defer();
            $http.get(serviceBase + '/caja/conceptos/conceptos')
                    .success(function (data) {
                        console.log(data);
                        deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _getSubConceptos = function (conceptos_id, periodo, nivel_id) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/caja/subconceptos/subconceptos', {params: {conceptos_id: conceptos_id, periodo: periodo, nivel_id: nivel_id}})
                    .success(function (data) {
                        console.log(data);
                        deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };
        var _addSubConcepto = function (sc_data) {
            var deferred = $q.defer();
            $http.post(serviceBase + '/caja/subconceptos/subconceptos/agregar', {
                descripcion: sc_data.descripcion,
                sub_concepto: sc_data.sub_concepto,
                conceptos_id: sc_data.conceptos_id,
                importe: sc_data.importe,
                periodo: sc_data.periodo,
                nivel_id: sc_data.nivel_id,
                tipo_adeudo: sc_data.tipo_adeudo_id
            })
                    .success(function (data) {
                        console.log(data);
                        deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _getNiveles = function () {
            var deferred = $q.defer();
            var cache = cacheService.get('niveles');
            if (cache) {
                deferred.resolve(cache);
            }
            else {
                $http.get(serviceBase + '/niveles')
                        .success(function (data) {
                            cacheService.put('niveles', data);
                            deferred.resolve(data);

                        }).
                        error(function (err, status) {
                            deferred.reject(err);
                        });
            }
            return deferred.promise;
        };


        var _getSubConceptosPlan = function (plan, periodo) {
            console.log(plan);
            console.log(periodo);
            var deferred = $q.defer();
            $http.get(serviceBase + '/administracion/generales/planes_de_pago/subconceptos', {params: {id: plan, periodo: periodo}})
                    .success(function (data) {
                        console.log(data);
                        deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _addConcepto = function (concepto) {
            console.log(concepto);
            var deferred = $q.defer();
            $http.post(serviceBase + '/caja/conceptos/conceptos/agregar', {concepto: concepto.nombre, descripcion: concepto.descripcion})
                    .success(function (data) {
                        console.log(data);
                        deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _addPlandePago = function (data_plan) {
            var deferred = $q.defer();
            $http.post(serviceBase + '/administracion/generales/planes_de_pago/agregar', {
                descripcion: data_plan.descripcion,
                clave_plan: data_plan.clave_plan,
                id_agrupaciones: data_plan.agrupacion.id
            }).success(function (data) {
                console.log(data);
                deferred.resolve(data.respuesta.data);
            }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _addPaquetePlan = function (data_paquete) {
            var deferred = $q.defer();
            $http.post(serviceBase + '/administracion/generales/planes_de_pago/paquete_plandepago/agregar', {
                id_plandepago: data_paquete.id_plandepago,
                idnivel: data_paquete.nivel,
                nivel: 'LICENCIATURA',
                periodo: data_paquete.periodo.idperiodo,
                recargo: 0,
                recargo_inscripcion: 0
            }).success(function (data) {
                console.log(data);
                deferred.resolve(data.respuesta.data);
            }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        //administracion/generales/planes_de_pago/paquete_plandepago/agregar_subconceptos

        var _addSCPaquete = function (dataSCPaquete) {
            var deferred = $q.defer();
            $http.post(serviceBase + '/administracion/generales/planes_de_pago/paquete_plandepago/agregar_subconceptos', {
                paquete_id: dataSCPaquete.paquete_id,
                sub_concepto: dataSCPaquete.sub_concepto,
                recargo: dataSCPaquete.recargo,
                tipo_recargo: dataSCPaquete.tipo_recargo
            }).success(function (data) {
                console.log(data);
                deferred.resolve(data.respuesta.data);
            }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _getBancos = function (dataSCPaquete) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/bancos')
                    .success(function (data) {
                        console.log(data);
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _addBanco = function (databanco) {
            var deferred = $q.defer();
            $http.post(serviceBase + '/bancos/agregar', {
                banco: databanco.banco,
                descripcion: databanco.descripcion
            }).success(function (data) {
                console.log(data);
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _Modifybanco = function (databanco) {
            var deferred = $q.defer();
            $http.put(serviceBase + '/bancos/guardar', {
                id: databanco.id,
                banco: databanco.banco,
                descripcion: databanco.descripcion
            }).success(function (data) {
                console.log(data);
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _DeleteBanco = function (databanco) {
            var deferred = $q.defer();
            $http.delete(serviceBase + '/bancos/eliminar', {params: {id: databanco}
            }).success(function (data) {
                console.log(data);
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _getCuentasBanco = function (databanco) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/cuentas')
                    .success(function (data) {
                        console.log(data);
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _addCuentaBanco = function (dataCuenta) {
            var deferred = $q.defer();
            $http.post(serviceBase + '/cuentas/agregar', {
                bancos_id: dataCuenta.bancos_id,
                cuenta: dataCuenta.cuenta
            }).success(function (data) {
                console.log(data);
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _getAdeudosAlumno = function (dataalumno) {
            var deferred = $q.defer();
            console.log({
                id_persona: dataalumno.id_persona,
                periodo: dataalumno.periodo.idperiodo
            });
            $http.get(serviceBase + '/adeudos/alumno',
                    {params: {
                            id_persona: dataalumno.id_persona,
                            periodo: dataalumno.periodo.idperiodo
                        }
                    })
                    .success(function (data) {
                        console.log(data);
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            //console.log(deferred.promise);
            return deferred.promise;

        };

        adminServiceFactory.getPlanesPago = _getPlanesPago;
        adminServiceFactory.getAgrupaciones = _getAgrupaciones;
        adminServiceFactory.getPlanesPagoAgrupacion = _getPlanesPagoAgrupacion;
        adminServiceFactory.getalumnos = _getalumnos;
        adminServiceFactory.getPeriodos = _getPeriodos;
        adminServiceFactory.getAlumnosPaquete = _getAlumnosPaquete;
        adminServiceFactory.getconceptos = _getconceptos;
        adminServiceFactory.getNiveles = _getNiveles;
        adminServiceFactory.getSubConceptos = _getSubConceptos;
        adminServiceFactory.getSubConceptosPlan = _getSubConceptosPlan;
        adminServiceFactory.getBancos = _getBancos;
        adminServiceFactory.getCuentasBanco = _getCuentasBanco;
        adminServiceFactory.getAdeudosAlumno = _getAdeudosAlumno;

        adminServiceFactory.setAdeudosalumno = _setAdeudosalumno;
        adminServiceFactory.addSubConcepto = _addSubConcepto;
        adminServiceFactory.addConcepto = _addConcepto;
        adminServiceFactory.addPlandePago = _addPlandePago;
        adminServiceFactory.addPaquetePlan = _addPaquetePlan;
        adminServiceFactory.addSCPaquete = _addSCPaquete;
        adminServiceFactory.addBanco = _addBanco;
        adminServiceFactory.addCuentaBanco = _addCuentaBanco;

        adminServiceFactory.Modifybanco = _Modifybanco;

        adminServiceFactory.DeleteBanco = _DeleteBanco;

        return adminServiceFactory;
    }]);