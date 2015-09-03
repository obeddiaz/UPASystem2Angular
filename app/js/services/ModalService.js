//UPapp.factory('ModalService', ['$modal', '$modalStack', function ($modal, $modalStack) {
//        return {
//            trigger: function (template) {
//                $modal.open({
//                    templateUrl: template,
//                    size: 'lg',
//                    controller: function ($scope, $modalInstance) {
//                        $scope.ok = function () {
//                            $modalInstance.close($scope.selected.item);
//                        };
//                        $scope.cancel = function () {
//                            $modalInstance.dismiss('cancel');
//                        };
//                    }
//                });
//            },
//            close: function (reason) {
//                $modalStack.dismissAll(reason);
//            }
//        };
//    }]);
