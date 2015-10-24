/*

www
    css
    img
    js
    lib
        angular
        ionic
        jquery
        justgage
        ngCordova
        raphael
    app
        layout

        device
            list.html
            connect-controller.js
        channel
            list.html
            select-controller.js
        settings

    index.html
*/

angular
    .module('bldcApp', ['ionic', 'ngCordova'])
    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            if(window.StatusBar) {
                StatusBar.styleDefault();
            }

            // bluetooth
            //$cordovaBluetoothSerial.initialize(); 

            // speed & power gauges
            var speedGauge = new Gauge("speedGauge", 0, 150,   "Speed", "KPH");
            var powerGauge = new Gauge("powerGauge", 0, 10000, "Power", "WATTS");

            // flip card
            var flipCard = new FlipCard("flipCard");

            // main updater
            var looper = new Looper(15, function() {
                if (!flipCard.isFlipped()) {
                    speedGauge.set(randInt(100));
                } else {
                    powerGauge.set(randInt(2000));
                }
            });

            //looper.start();
        });
    });


(function() {
    'use strict';

    angular
        .module('bldcApp')
        .controller('bldcController', bldcController)

    function bldcController($scope, $ionicPopover) {
        $ionicPopover.fromTemplateUrl('templates/popmenu.html', {
            id: 0,
            scope: $scope,
        }).then(function(popover) {
            $scope.popover = popover;
        });
    }
})();


(function() {
    'use strict';

    angular
        .module('bldcApp')
        .controller('modalController', modalController)

    function modalController($scope, $ionicModal) {
        $scope.modal = [];

        $ionicModal.fromTemplateUrl('templates/devices.html', {
            id: 0,
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal[0] = modal;
        });

        $ionicModal.fromTemplateUrl('templates/channels.html', {
            id: 1,
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal[1] = modal;
        });

        $scope.openModal = function(i) {
            $scope.modal[i].show();
        };

        $scope.closeModal = function(i) {
            $scope.modal[i].hide();
        };

        $scope.$on('modal.shown', function(event, modal) {
            console.log('Modal ' + modal.id + ' is shown!');
        });

        $scope.$on('modal.hidden', function(event, modal) {
            console.log('Modal ' + modal.id + ' is hidden!');
        });

        $scope.$on('modal.removed', function(event, modal) {
            console.log('Modal ' + modal.id + ' is removed!');
        });

        $scope.$on('$destroy', function() {
            console.log('Destroying modals...');
            for (i = 0; i < $scope.modal.length; i++) {
                $scope.modal[i].remove();
            }
        });
    }
})();
