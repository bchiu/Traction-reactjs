// Document ready
$(function() {
    // material ui
    //$.material.init();

    // reusable spinner
    Spinner.initialize();

    // bluetooth devices
    Devices.initialize('devices');

    // serial data channels
    Channels.initialize('channels');

    // page swiper
    var swiper = new PageSwiper('.swiper-container');
    $("#lockSwiperButton").click(function() { swiper.toggleLock(event) });

    // speed & power gauges
    var gaugeSpeed = new Gauge("gaugeSpeed", 0, 100,  1, "Speed", "KPH");
    var gaugePower = new Gauge("gaugePower", 0, 9999, 1, "Power", "WATTS");

    // mini meters
    var meterRegen     = new Meter("meterRegen");
    var meterThrottle  = new Meter("meterThrottle");
    var meterMotorTemp = new Meter("meterMotorTemp");
    var meterEscTemp   = new Meter("meterEscTemp");

    // jumbo meters
    var meterBattery  = new Meter("meterBattery");
    var meterDistance = new Meter("meterDistance");

    // flip card
    var flipCard = new FlipCard("flipCard");

    // google maps
    Maps.initialize("maps-canvas");

    // main updater
    var looper = new Looper(15, function() {
        if (!flipCard.isFlipped()) {
            gaugeSpeed.set(Util.randFloat(-50, 100, 0));
        } else {
            gaugePower.set(Util.randFloat(-1000, 1000, 1));
        }

        meterThrottle.set(Util.randInt(100));
        meterMotorTemp.set(Util.randInt(120));
        meterEscTemp.set(Util.randInt(120));

        meterBattery.set(Util.randFloat(0, 16.8, 1));
        meterDistance.set(Util.randFloat(0, 100, 1));
    });

    //gaugeSpeed.set(-40);
    //looper.start();

    // cordova device onready
    document.addEventListener('deviceready', function() {
        //looper.start();
        if (window.cordova) console.log("Device is ready");
    }, false);
});
