(function() {
    'use strict';

    angular
        .module('app')
        .controller('MenuController', MenuController);

    function MenuController($scope, $ionicPopover) {
        $ionicPopover.fromTemplateUrl('src/menu/menu.html', {
            scope: $scope,
        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.showMenu = function($event) {
            $scope.popover.show($event);
        };

        $scope.hideMenu = function() {
            $scope.popover.hide();
        };

        $scope.selectMenu = function() {
            $scope.hideMenu();
        };

        $scope.$on('popover.shown', function(event, modal) {
        });

        $scope.$on('popover.hidden', function(event, modal) {
        });

        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });
    }
})();
