(function() {
    'use strict';

    angular
        .module('app')
        .controller('ChannelsController', ChannelsController);

    function ChannelsController($scope, $ionicModal) {
        $scope.buttonLabel = "Channel 1";

        $ionicModal.fromTemplateUrl('src/channels/channels-list.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openList = function(event) {
            $scope.modal.show();
        };

        $scope.closeList = function() {
            $scope.modal.hide();
        };

        $scope.$on('modal.shown', function(event, modal) {
        });

        $scope.$on('modal.hidden', function(event, modal) {
        });

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
    }
})();
