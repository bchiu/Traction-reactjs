(function() {
    'use strict';

    angular
        .module('app')
        .controller('DevicesController', DevicesController);

    function DevicesController($scope, $ionicModal, $ionicLoading, $cordovaBluetoothSerial) {
        $scope.buttonLabel = "Connect";
        $scope.currentDevice = {id:''};
        $scope.devices = [];    // [{"name":"HC-06","address":"98:D3:31:20:57:E0","id":"98:D3:31:20:57:E0","class":7936}, {..}, {..}]

        $ionicModal.fromTemplateUrl('src/devices/devices-list.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

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

        $scope.openList = function() {
            $scope.refresh();
            $scope.modal.show();
        };

        $scope.closeList = function() {
            $scope.modal.hide();
        };

        $scope.connect = function(device) {
            $scope.showLoading();

            $cordovaBluetoothSerial.connect(device.id).then(
                function() {
                    $scope.currentDevice = device; 
                    $scope.buttonLabel = device.name;
                    $cordovaBluetoothSerial.subscribe('\n'); 
                    $scope.hideLoading();
                    $scope.closeList();
                },
                $scope.showError
            );
        };

        $scope.showError = function(error) {
            $scope.currentDevice.id = "";
            $scope.hideLoading();
            alert(error);
        };

        $scope.showLoading = function() {
            $ionicLoading.show({ 
                template: "<ion-spinner icon='android'></ion-spinner>" 
            });
        };

        $scope.hideLoading = function(){
            $ionicLoading.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
    }
})();
