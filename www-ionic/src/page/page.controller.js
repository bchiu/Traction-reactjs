(function() {
    'use strict';

    angular
        .module('app')
        .controller('PageController', PageController);

    function PageController($scope, $ionicSlideBoxDelegate) {
        $scope.slideEnabled = true;
        $ionicSlideBoxDelegate.enableSlide(true);

        $scope.toggleLock = function(event) {
            $scope.slideEnabled = !$scope.slideEnabled;
            $ionicSlideBoxDelegate.enableSlide($scope.slideEnabled);
            $(event.target).toggleClass("ion-locked");
            $(event.target).toggleClass("ion-unlocked");
        };
    }
})();
