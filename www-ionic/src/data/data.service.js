(function() {
    'use strict';

    angular
        .module('app')
        .factory('DataService', DataService);

    function DataService($scope, $cordovaBluetoothSerial) {

    	$scope.bluetoothEnabled = function() {
            return (window.cordova && $cordovaBluetoothSerial.isEnabled());
        };

        $scope.refresh = function() {
            if (!$scope.bluetoothEnabled()) return;

            $cordovaBluetoothSerial.list().then(
                function(results) { $scope.devices = results },
                $scope.showError
            );
        };
    }
})();
