UPapp.controller('Administracion_Generales', function ($scope, $routeParams) {
    console.log($routeParams);
    //$scope.message = "TEST";
    $scope.tabs = [
        {title: 'Planes de Pago', click: 'planes_de_pago'},
        {title: 'Becas', click: 'becas'}
    ];
    //$scope.content = "contenido-1";
    $scope.subPageContent = function (page) {
        $scope.subPageTemplate = 'partials/administrador/agrupaciones/generales/' + page + '.html';
    };
});
