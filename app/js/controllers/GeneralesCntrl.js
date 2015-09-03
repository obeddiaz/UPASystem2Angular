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
