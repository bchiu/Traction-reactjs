(function() {
    'use strict';

    angular
        .module('app')
        .controller('DashController', DashController);

    function DashController($scope) {

        $scope.init = function() {

            // speed & power gauges
            $scope.speedGauge = new Gauge("speedGauge", 0, 150,   "Speed", "KPH");
            $scope.powerGauge = new Gauge("powerGauge", 0, 10000, "Power", "WATTS");

            // flip card
            $scope.flipCard = new FlipCard("flipCard");

            // main updater
            $scope.looper = new Looper(15, function() {
                if (!$scope.flipCard.isFlipped()) {
                    $scope.speedGauge.set(randInt(100));
                } else {
                    $scope.powerGauge.set(randInt(2000));
                }
            });

            //$scope.looper.start();
        }
    }
})();
