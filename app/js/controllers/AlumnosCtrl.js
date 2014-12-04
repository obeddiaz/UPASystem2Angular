UPapp.controller('EstadoCuentaCtrl', function ($scope, $routeParams, studentService, authService) {
    var curr_user = authService.authentication.persona;
    //console.log(studentService.getPeriodos());
    var ref_count = 0;
    var anp = {};
    var total_referencias = {};
    studentService.getPeriodos().then(function (data) {
        //console.log(data);
        $scope.periodos = data;
        data.forEach(function (val, key) {
            if (val.actual == 1) {
                $scope.Modelo_Periodo = $scope.periodos[key];
                $scope.Mostrar_Referencia();
                //console.log(val);
                //console.log(key);
                // $scope.periodos[]
            }
            //console.log(val);

        });
        //$scope.Mostrar_Referencia();
//        if (authService.authentication.isAuth) {
//            $location.path('/home');
//        } else {
//            $scope.alerts = [
//                {type: 'danger', msg: response}
//            ];
//        }
    }, function (err) {
        $scope.alerts = [
            {type: 'danger', msg: 'Usuario o contraseña incorrectos'}
        ];
        $scope.message = err.error_description;
    });
    //console.log(curr_user);
    //console.log(curr_user.idpersonas);
    $scope.Mostrar_Referencia = function () {
        console.log($scope.Modelo_Periodo);
        studentService.getAdeudos(curr_user.idpersonas, $scope.Modelo_Periodo.idperiodo).then(function (data) {
            console.log(data);
            $scope.adeudos = data;
            data.forEach(function (val, key) {
                if (val.status_adeudo == 0) {
                    anp[ref_count] = val;
                    ref_count++;
                    $scope.adeudos[key]['ref_counter'] = ref_count;
                }
            });
//        if (authService.authentication.isAuth) {
//            $location.path('/home');
//        } else {
//            $scope.alerts = [
//                {type: 'danger', msg: response}
//            ];
//        }
        }, function (err) {
            $scope.alerts = [
                {type: 'danger', msg: 'Usuario o contraseña incorrectos'}
            ];
            $scope.message = err.error_description;
        });
    };
    $scope.Generareferencia = function (a) {
        for (var c = 0; c < a; c++) {
            total_referencias[c] = anp[c];
        }
        //studentService.setReferencias

        studentService.setReferencias(total_referencias).then(function (data) {
            console.log(data);
        }, function (err) {
            
            //$scope.message = err.error_description;
        });
        //console.log(a);
        //console.log(total_referencias);
    };
});