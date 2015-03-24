UPapp.controller('EstadoCuentaCtrl', function ($scope, $window, $routeParams, $location, studentService, authService) {
    var curr_user = authService.authentication.persona;
    var ref_count = 0;
    var anp = {};
    var total_referencias = {};
    $scope.isBusy = false;
    var _Periodos = function () {
        $scope.isBusy = true;
        studentService.getPeriodos().then(function (data) {
            $scope.isBusy = false;
            $scope.periodos = data;
            data.forEach(function (val, key) {
                if (val.actual == 1) {
                    $scope.Modelo_Periodo = $scope.periodos[key];
                    $scope.Mostrar_Referencia();
                }
            });
        }, function (err) {
            $scope.alerts = [
                {type: 'danger', msg: 'Usuario o contraseña incorrectos'}
            ];
            $scope.message = err.error_description;
        });
    };

    $scope.Mostrar_Referencia = function () {
        $scope.isBusy = true;
        ref_count = 0;
        studentService.getAdeudos(curr_user.idpersonas, $scope.Modelo_Periodo.idperiodo).then(function (data) {
            $scope.isBusy = false;
            console.log(data);
            $scope.adeudos = data;
            data.forEach(function (val, key) {
                var banco_allow = false;
                val.tipos_pago.forEach(function (tpval) {
                    if (tpval.tipo_pago_id == 1) {
                        banco_allow = true;
                    }
                });
                if ((val.status_adeudo == null || val.status_adeudo == 0) && (banco_allow)) {
                    anp[ref_count] = val;
                    ref_count++;
                    $scope.adeudos[key]['ref_counter'] = ref_count;
                }
            });
        }, function (err) {
            $scope.alerts = [
                {type: 'danger', msg: 'Usuario o contraseña incorrectos'}
            ];
            $scope.message = err.error_description;
        });
    };
    $scope.Generareferencia = function (a) {
        $scope.isBusy = true;
        for (var c = 0; c < a; c++) {
            total_referencias[c] = anp[c];
        }
        studentService.setReferencias(total_referencias).then(function (data) {
            $scope.isBusy = false;
            $window.sessionStorage.setItem('recibo', JSON.stringify(data));
            $location.path('/home/alumno/recibo');
        }, function (err) {
        });
    };
    _Periodos();
});

UPapp.controller('ReciboCtrl', function ($scope, $window, studentService) {
    var recibo = $window.sessionStorage.getItem('recibo');
    recibo = JSON.parse(recibo);
    $scope.convenio = recibo.data.convenio;
    $scope.fecha_limite = recibo.data.fecha_limite;
    $scope.importe_total = recibo.data.importe_total;
    $scope.apmat = recibo.data.persona[0].apmat;
    $scope.appat = recibo.data.persona[0].appat;
    $scope.nom = recibo.data.persona[0].nom;
    $scope.matricula = recibo.data.persona[0].matricula;
    $scope.carrera = recibo.data.persona[0].carrera;
    $scope.periodo = recibo.data.periodo;
    $scope.referencias = recibo.data.referencias;
});