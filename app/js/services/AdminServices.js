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


        var _deletePlanePago = function (id) {
            var deferred = $q.defer();
            $http.delete(serviceBase + '/administracion/generales/planes_de_pago/eliminar', {params: {id: id}
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _ModifyPlanePago = function (dataplan) {
            var deferred = $q.defer();
            $http.put(serviceBase + '/administracion/generales/planes_de_pago/guardar', {
                id: dataplan.id,
                clave_plan: dataplan.clave_plan,
                id_agrupaciones: dataplan.agrupacion,
                descripcion: dataplan.descripcion
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _getAgrupaciones = function () {
            var deferred = $q.defer();
            $http.get(serviceBase + '/administracion/agrupaciones')
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

        var _getPlanesPagoAgrupacion = function (id) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/administracion/generales/planes_de_pago/todos_agrupaciones', {params: {id_agrupaciones: id}})
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
        var _getalumnos = function () {
            var deferred = $q.defer();
            var cache = cacheService.get('alumnos');
            if (cache) {
                deferred.resolve(cache);
            }
            else {
                $http.get(serviceBase + '/alumnos_todos')
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

        var _getAllalumnos = function () {
            var deferred = $q.defer();
            var cache = cacheService.get('alumnos');
            if (cache) {
                deferred.resolve(cache);
            }
            else {
                $http.get(serviceBase + '/alumnostodos')
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
            $http.post(serviceBase + '/administracion/agrupaciones/alumnos_paquete/agregar', {"paquete_id": paquete_id, "id_personas": id_personas})
                    .success(function (data) {
                        deferred.resolve(data);
                    }).
                    error(function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };

        var _setAdeudosalumno = function (paquete_id, id_personas) {
            var deferred = $q.defer();
            $http.post(serviceBase + '/administracion/agrupaciones/alumnos_paquete/agregar', {"paquete_id": paquete_id, "id_personas": id_personas})
                    .success(function (data) {
                        deferred.resolve(data);
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
                            console.log(data);
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
            $http.get(serviceBase + '/administracion/generales/planes_de_pago/alumnos_paquete_alumno', {params: {id: plan_pago, periodo: id_periodo}})
                    .success(function (data) {
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
                        deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _DeleteSubConcepto = function (id) {
            var deferred = $q.defer();
            $http.delete(serviceBase + '/caja/subconceptos/subconceptos/eliminar', {params: {id: id}
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (err, status) {
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
                tipo_adeudo: sc_data.tipo_adeudo_id,
                locker_manager: sc_data.locker_manager,
                aplica_beca: sc_data.aplica_beca
            })
                    .success(function (data) {
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
            var deferred = $q.defer();
            $http.get(serviceBase + '/administracion/generales/planes_de_pago/subconceptos', {params: {id: plan, periodo: periodo}})
                    .success(function (data) {
                        deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _addConcepto = function (concepto) {
            var deferred = $q.defer();
            $http.post(serviceBase + '/caja/conceptos/conceptos/agregar', {concepto: concepto.nombre, descripcion: concepto.descripcion})
                    .success(function (data) {
                        deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _ModifyConcepto = function (dataconcepto) {
            var deferred = $q.defer();
            $http.put(serviceBase + '/caja/conceptos/conceptos/guardar', {
                id: dataconcepto.id,
                concepto: dataconcepto.nombre,
                descripcion: dataconcepto.descripcion
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (err, status) {
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
                tipo_recargo: dataSCPaquete.tipo_recargo,
                tipos_pago: dataSCPaquete.tipos_pago
            }).success(function (data) {
                deferred.resolve(data);
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
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _getAdeudosAlumno = function (dataalumno) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/adeudos/alumno',
                    {params: {
                            id_persona: dataalumno.id_persona,
                            periodo: dataalumno.periodo.idperiodo
                        }
                    })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };

        var _getAdeudosAlumnoNew = function (id_persona, id_periodo) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/adeudos/alumno',
                    {params: {
                            id_persona: id_persona,
                            periodo: id_periodo
                        }
                    })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };

        var _addAdeudosimple = function (dataadeudo) {
            var deferred = $q.defer();
            $http.post(serviceBase + '/adeudos/agregar_subconcepto',
                    {
                        subconcepto_id: dataadeudo.subconcepto.id,
                        periodo: dataadeudo.periodo.idperiodo,
                        id_personas: dataadeudo.id_persona,
                        fecha_limite: dataadeudo.fecha,
                        tipos_pago: dataadeudo.tipos_pago
                    })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };

        var _getBecas = function () {
            var deferred = $q.defer();
            $http.get(serviceBase + '/administracion/generales/becas')
                    .success(function (data) {
                        deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };
        
        var _getAlumnosBecaPeriodo = function (id_periodo) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/administracion/generales/becas/catalogos/reporte',
                    {params: {
                            periodo: id_periodo
                        }
                    })
                    .success(function (data) {
                        deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _getAlumnosBecas = function (dataBeca) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/administracion/generales/becas/alumnos/beca',
                    {
                        params: {
                            idbeca: dataBeca.idbeca,
                            idnivel: dataBeca.nivel,
                            periodo: dataBeca.periodo.idperiodo
                        }
                    })
                    .success(function (data) {
                        deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _addBecasByFile = function (archivo) {
            var deferred = $q.defer();
            var fd = new FormData();
            angular.forEach(archivo, function (file) {
                fd.append('becas_file', file);
            });
            $http.post(serviceBase + '/administracion/generales/becas/subir', fd,
                    {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _getAlumnosNoBecas = function (dataBeca) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/administracion/generales/becas/alumnos/nobeca',
                    {
                        params: {
                            idbeca: dataBeca.idbeca,
                            idnivel: dataBeca.nivel,
                            periodo: dataBeca.periodo.idperiodo
                        }
                    })
                    .success(function (data) {
                        deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _addNuevaBeca = function (dataBeca) {
            var deferred = $q.defer();
            $http.post(serviceBase + '/administracion/generales/becas/agregar',
                    {
                        abreviatura: dataBeca.abreviatura,
                        importe: dataBeca.importe,
                        periodicidades_id: dataBeca.periodicidades_id,
                        subcidios_id: dataBeca.subcidios_id,
                        tipo_importe_id: dataBeca.tipo_importe_id,
                        descripcion: dataBeca.descripcion
                    })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        //Asignar a los no inscritos
        var _addNIAlumnosBeca = function (dataBeca) {
            var deferred = $q.defer();
            $http.post(serviceBase + '/administracion/generales/becas/alumnos/agregar',
                    {
                        idbeca: dataBeca.idbeca,
                        idnivel: dataBeca.nivel,
                        periodo: dataBeca.periodo.idperiodo,
                        id_persona: dataBeca.idpersona
                    })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };
        //Reactiva beca a Alumno Inscrito
        var _reactivarBecaAlumno = function (dataBeca) {
            var deferred = $q.defer();
            $http.put(serviceBase + '/administracion/generales/becas/alumnos/asignar',
                    {
                        id_persona: dataBeca.idpersona,
                        idbeca: dataBeca.idbeca,
                        idnivel: dataBeca.nivel,
                        periodo: dataBeca.periodo.idperiodo
                    })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };
        //Desactiva beca a Alumno Inscrito
        var _desactivarBecaAlumno = function (dataBeca) {
            var deferred = $q.defer();
            $http.put(serviceBase + '/administracion/generales/becas/alumnos/cancelar',
                    {
                        id_persona: dataBeca.idpersona,
                        idbeca: dataBeca.idbeca,
                        idnivel: dataBeca.nivel,
                        periodo: dataBeca.periodo.idperiodo
                    })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _ModifyBeca = function (dataBeca) {
            var deferred = $q.defer();
            $http.put(serviceBase + '/administracion/generales/becas/guardar', {
                id: dataBeca.id,
                abreviatura: dataBeca.abreviatura,
                importe: dataBeca.importe,
                periodicidades_id: dataBeca.periodicidades_id,
                subcidios_id: dataBeca.subcidios_id,
                tipo_importe_id: dataBeca.tipo_importe_id,
                descripcion: dataBeca.descripcion,
                tipobeca: dataBeca.tipobeca
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _DeleteBeca = function (databeca) {
            var deferred = $q.defer();
            $http.delete(serviceBase + '/administracion/generales/becas/eliminar', {params: {id: databeca}
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _getCatalogos = function () {
            var deferred = $q.defer();
            var cache = cacheService.get('CatalogosBeca');
            if (cache) {
                deferred.resolve(cache);
            }
            else {
                $http.get(serviceBase + '/administracion/generales/becas/catalogos')
                        .success(function (data) {
                            cacheService.put('CatalogosBeca', data);
                            deferred.resolve(data);
                        }).
                        error(function (err, status) {
                            deferred.reject(err);
                        });
            }
            return deferred.promise;
        };

        var _SubirReferencias = function (archivo) {
            var deferred = $q.defer();
            var fd = new FormData();
            angular.forEach(archivo, function (file) {
                fd.append('referencia_archivo', file);
            });
            $http.post(serviceBase + '/caja/caja/banco/subir', fd,
                    {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _getAdeudos = function (persona, periodo) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/estado_de_cuenta/adeudos', {params: {id_persona: persona, periodo: periodo}})
                    .success(function (data) {
                        deferred.resolve(data.respuesta);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });

            return deferred.promise;

        };

        var _getDatosReferencia = function (datosReferencia) {
            var deferred = $q.defer();
            //var datos=[datosReferencia];
            $http.post(serviceBase + '/referencias/traducir',
                    {
                        referencias: datosReferencia
                    })
                    .success(function (data) {
                        console.log(data);
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };

        var _updateAdeudostatus = function (adeudoID) {
            var deferred = $q.defer();
            $http.put(serviceBase + '/adeudos/status', {
                id: adeudoID,
                status_adeudo: 1
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
            return deferred.promise;
        };



        var _activarCuentaBanco = function (cuentaID) {
            var deferred = $q.defer();
            $http.put(serviceBase + '/cuentas/activar', {
                id: cuentaID
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _getAllSubConceptos = function (conceptos_id) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/caja/subconceptos/subconceptos_by_id', {params: {conceptos_id: conceptos_id}})
                    .success(function (data) {
                        deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _getAdeudosReporte = function (dataAdeudos) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/adeudos/adeudos_reporte', {
                params: {
                    fecha_desde: dataAdeudos.fecha_desde,
                    fecha_hasta: dataAdeudos.fecha_hasta,
                    status: dataAdeudos.status
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
            return deferred.promise;

        };

        var _getAdeudosReporte_periodo = function (dataAdeudos) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/adeudos/adeudos_reporte', {
                params: {
                    periodo: dataAdeudos.periodo.idperiodo,
                    status: dataAdeudos.status
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
            return deferred.promise;

        };

        var _getAdeudosReporteOrdenado = function (dataAdeudos) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/adeudos/adeudos_reporte_ordenado', {
                params: {
                    fecha_desde: dataAdeudos.fecha_desde,
                    fecha_hasta: dataAdeudos.fecha_hasta,
                    status: dataAdeudos.status
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
            return deferred.promise;

        };


        var _getAdeudosReporteOrdenado_periodo = function (dataAdeudos) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/adeudos/adeudos_reporte_ordenado', {
                params: {
                    periodo: dataAdeudos.periodo.idperiodo,
                    status: dataAdeudos.status
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (err, status) {
                deferred.reject(err);
            });
            return deferred.promise;

        };

        var _createAdeudosReporte = function (dataAdeudos) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/adeudos/crear_reporte?adeudos_ids=[376,381,382]&adeudos_campos=["importe","recargo"]')
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };
        //Get Sub Conceptos Paquete
//        var _getSC_Paquete = function (data_paquete) {
//            var deferred = $q.defer();
//            $http.post(serviceBase + '/administracion/generales/planes_de_pago/paquete_plandepago/agregar', {
//                id_plandepago: data_paquete.id_plandepago,
//                idnivel: data_paquete.nivel,
//                nivel: 'LICENCIATURA',
//                periodo: data_paquete.periodo.idperiodo,
//                recargo: 0,
//                recargo_inscripcion: 0
//            }).success(function (data) {
//                deferred.resolve(data.respuesta.data);
//            }).
//                    error(function (err, status) {
//                        deferred.reject(err);
//                    });
//            return deferred.promise;
//            var deferred = $q.defer();
//            $http.get(serviceBase + '/administracion/generales/planes_de_pago/paquete_plandepago/sc_plan', {params: {id: persona, periodo: periodo}})
//                    .success(function (data) {
//                        deferred.resolve(data.respuesta);
//                    }).
//                    error(function (err, status) {
//                        deferred.reject(err);
//                    });
//
//            return deferred.promise;
//        };
//        var _getSubConceptosPlan = function (plan, periodo) {
//            var deferred = $q.defer();
//            $http.get(serviceBase + '/administracion/generales/planes_de_pago/subconceptos', {params: {id: plan, periodo: periodo}})
//                    .success(function (data) {
//                        deferred.resolve(data);
//                    }).
//                    error(function (err, status) {
//                        deferred.reject(err);
//                    });
//            return deferred.promise;
//        };



        var _getDevoluciones = function (data) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/devoluciones')
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _getExpediente = function (data) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/devoluciones')
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _getDevolucionesAlumno = function (data) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/devoluciones')
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _getDevolucionesPersona = function (data) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/devoluciones')
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _getDevolucionesPersona = function (data) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/devoluciones')
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _agregarDevolucion = function (datosReferencia) {
            var deferred = $q.defer();
            //var datos=[datosReferencia];
            $http.post(serviceBase + '/referencias/traducir',
                    {
                        referencias: datosReferencia
                    })
                    .success(function (data) {
                        console.log(data);
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };

        var _eliminarDevolucion = function (datosReferencia) {
            var deferred = $q.defer();
            //var datos=[datosReferencia];
            $http.post(serviceBase + '/referencias/traducir',
                    {
                        referencias: datosReferencia
                    })
                    .success(function (data) {
                        console.log(data);
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;

        };


        var _suspenderBeca = function (id_adeudo, id_persona, periodo, aplica_beca) {
            var deferred = $q.defer();
            $http.get(serviceBase + '/administracion/generales/becas/suspender_mes',
                    {params: {
                            id_adeudo: id_adeudo,
                            id_persona: id_persona,
                            periodo: periodo,
                            aplica_beca: aplica_beca  // 0 bloquear 1 desbloquear
                        }})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        var _addDescuento = function (p1, p2, p3) {
            var deferred = $q.defer();
            //p1 tipo importe id
            //p2 adeudo id
            //p3 importe
            $http.post(serviceBase + '/caja/descuentos/agregar', {
                tipo_importe_id: p1,
                adeudos_id: p2,
                importe: p3
            })
                    .success(function (data) {
                        deferred.resolve(data);
                    }).
                    error(function (err, status) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        //http://localhost/UPASystem2/public/indexapi.php/administracion/generales/becas/suspender_mes es

        adminServiceFactory.getPlanesPago = _getPlanesPago;
        adminServiceFactory.getAgrupaciones = _getAgrupaciones;
        adminServiceFactory.getPlanesPagoAgrupacion = _getPlanesPagoAgrupacion;
        adminServiceFactory.getalumnos = _getalumnos;
        adminServiceFactory.getAllalumnos = _getAllalumnos;
        adminServiceFactory.getPeriodos = _getPeriodos;
        adminServiceFactory.getAlumnosPaquete = _getAlumnosPaquete;
        adminServiceFactory.getconceptos = _getconceptos;
        adminServiceFactory.getNiveles = _getNiveles;
        adminServiceFactory.getSubConceptos = _getSubConceptos;
        adminServiceFactory.getSubConceptosPlan = _getSubConceptosPlan;
        adminServiceFactory.getAllSubConceptos = _getAllSubConceptos;
        adminServiceFactory.getBancos = _getBancos;
        adminServiceFactory.getCuentasBanco = _getCuentasBanco;
        adminServiceFactory.getAdeudosAlumno = _getAdeudosAlumno;
        adminServiceFactory.getAdeudosAlumnoNew = _getAdeudosAlumnoNew;
        adminServiceFactory.getBecas = _getBecas;
        adminServiceFactory.getCatalogos = _getCatalogos;
        adminServiceFactory.getAlumnosBecas = _getAlumnosBecas;
        adminServiceFactory.getAlumnosNoBecas = _getAlumnosNoBecas;
        adminServiceFactory.getAdeudos = _getAdeudos;
        adminServiceFactory.getAdeudosReporte = _getAdeudosReporte;
        adminServiceFactory.getAdeudosReportePeriodo = _getAdeudosReporte_periodo;
        adminServiceFactory.getAdeudosReporteOrdenado = _getAdeudosReporteOrdenado;
        adminServiceFactory.getAdeudosReporteOrdenadoPeriodo = _getAdeudosReporteOrdenado_periodo;
        adminServiceFactory.getDatosReferencia = _getDatosReferencia;
        adminServiceFactory.getAlumnosBecaPeriodo =_getAlumnosBecaPeriodo;


        adminServiceFactory.suspenderBeca = _suspenderBeca;

        adminServiceFactory.setAdeudosalumno = _setAdeudosalumno;
        adminServiceFactory.addSubConcepto = _addSubConcepto;
        adminServiceFactory.addConcepto = _addConcepto;
        adminServiceFactory.addPlandePago = _addPlandePago;
        adminServiceFactory.addPaquetePlan = _addPaquetePlan;
        adminServiceFactory.addSCPaquete = _addSCPaquete;
        adminServiceFactory.addBanco = _addBanco;
        adminServiceFactory.addCuentaBanco = _addCuentaBanco;
        adminServiceFactory.addAdeudosimple = _addAdeudosimple;
        adminServiceFactory.addNuevaBeca = _addNuevaBeca;
        adminServiceFactory.SubirReferencias = _SubirReferencias;
        adminServiceFactory.addNIAlumnosBeca = _addNIAlumnosBeca;
       adminServiceFactory.addBecasByFile =  _addBecasByFile;

        adminServiceFactory.addDescuento = _addDescuento;

        adminServiceFactory.Modifybanco = _Modifybanco;
        adminServiceFactory.ModifyBeca = _ModifyBeca;
        adminServiceFactory.ModifyPlanePago = _ModifyPlanePago;
        adminServiceFactory.ModifyConcepto = _ModifyConcepto;
        adminServiceFactory.activarCuentaBanco = _activarCuentaBanco;

        adminServiceFactory.DeleteBanco = _DeleteBanco;
        adminServiceFactory.DeleteBeca = _DeleteBeca;
        adminServiceFactory.deletePlanePago = _deletePlanePago;
        adminServiceFactory.DeleteSubConcepto = _DeleteSubConcepto;

        adminServiceFactory.reactivarBecaAlumno = _reactivarBecaAlumno;
        adminServiceFactory.desactivarBecaAlumno = _desactivarBecaAlumno;

        adminServiceFactory.createAdeudosReporte = _createAdeudosReporte;

        adminServiceFactory.updateAdeudostatus = _updateAdeudostatus;

        return adminServiceFactory;
    }]);