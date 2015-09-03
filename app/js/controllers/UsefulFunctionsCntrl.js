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