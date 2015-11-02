/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var ReactDOM = __webpack_require__(2);
	var EasySlider = __webpack_require__(3);
	var DataFrame = __webpack_require__(184);
	var Vesc = __webpack_require__(185);
	var Looper = __webpack_require__(186);
	var Util = __webpack_require__(187);
	//var ProtoBuf   = require('protobufjs');

	var Traction = React.createClass({
	    displayName: 'Traction',

	    getInitialState: function getInitialState() {
	        window.dev = !window.cordova;

	        // disable device sleep
	        this.enableWakeLock();

	        // set controller
	        this.bldc = Vesc;

	        // bind data to controller
	        this.data = new DataFrame();
	        this.bldc.bindData(this.data);

	        return {
	            deviceConnected: false,
	            data: this.data
	        };
	    },

	    componentDidMount: function componentDidMount() {
	        $.material.init();

	        // data update loop
	        this.looper = new Looper(15, (function () {

	            if (window.dev) this.data.randomize(); // randomize data for debug
	            else if (!this.state.deviceConnected) return; // disconnected, exit loop
	                else this.bldc.requestValues(); // send serial request

	            this.setState({ data: this.data }); // commit data updates to state
	        }).bind(this));

	        if (window.dev) this.looper.test('app');
	    },

	    enableWakeLock: function enableWakeLock() {
	        document.addEventListener('deviceready', function () {
	            window.powerManagement.acquire(function () {
	                console.warn('Wakelock acquired');
	            }, function () {
	                console.warn('Failed to acquire wakelock');
	            });
	        });
	    },

	    onDeviceConnect: function onDeviceConnect() {
	        this.setState({ deviceConnected: true });
	        this.bldc.startListening();
	        this.looper.start();
	    },

	    onDeviceDisconnect: function onDeviceDisconnect() {
	        this.setState({ deviceConnected: false });
	        this.bldc.stopListening();
	        this.looper.stop();
	    },

	    onTouchStart: function onTouchStart() {
	        this.looper.stop();
	    },

	    onTouchEnd: function onTouchEnd() {
	        this.looper.start();
	    },

	    render: function render() {
	        return React.createElement(EasySlider, {
	            title: 'Traction',
	            data: this.state.data,
	            deviceConnected: this.state.deviceConnected,
	            onDeviceConnect: this.onDeviceConnect,
	            onDeviceDisconnect: this.onDeviceDisconnect,
	            onTouchStart: this.onTouchStart,
	            onTouchEnd: this.onTouchEnd });
	    }
	});

	var App = React.createFactory(Traction);
	ReactDOM.render(App(), document.getElementById('app'));

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Easy Slider - simple layout with slide boxes
	*/
	'use strict';

	var React = __webpack_require__(1);
	var Radium = __webpack_require__(4);
	var Dashboard = __webpack_require__(5);
	var GoogleMaps = __webpack_require__(10);
	var Devices = __webpack_require__(11);
	var ToolBar = __webpack_require__(92);
	var Sliders = __webpack_require__(182);
	var JumboMeter = __webpack_require__(183);

	var EasySlider = React.createClass({
	    displayName: 'EasySlider',

	    showDevices: function showDevices() {
	        this.refs.devices.showModal();
	    },

	    lockSlider: function lockSlider() {
	        this.refs.sliders.lock();
	    },

	    render: function render() {
	        var data = this.props.data;

	        return React.createElement(
	            'div',
	            { style: { height: '100%' } },
	            React.createElement(
	                'div',
	                { style: { height: '10%' } },
	                React.createElement(ToolBar, {
	                    title: this.props.title,
	                    showDevices: this.showDevices,
	                    deviceConnected: this.props.deviceConnected })
	            ),
	            React.createElement(
	                'div',
	                { style: { height: '5%' } },
	                React.createElement(JumboMeter, {
	                    title: 'Battery',
	                    units: 'V',
	                    min: '12',
	                    max: '16.8',
	                    low: '13',
	                    high: '15',
	                    optimum: '16.8',
	                    precision: '1',
	                    value: data.v_in })
	            ),
	            React.createElement(
	                'div',
	                { style: { height: '80%' } },
	                React.createElement(
	                    Sliders,
	                    {
	                        ref: 'sliders',
	                        onTouchStart: this.props.onTouchStart,
	                        onTouchEnd: this.props.onTouchEnd },
	                    React.createElement(Dashboard, { data: data }),
	                    React.createElement(
	                        'div',
	                        { style: { height: '100%' } },
	                        React.createElement(GoogleMaps, null),
	                        React.createElement(Sliders.Lock, { onToggle: this.lockSlider })
	                    )
	                )
	            ),
	            React.createElement(
	                'div',
	                { style: { height: '5%' } },
	                React.createElement(JumboMeter, {
	                    title: 'Distance',
	                    units: 'km',
	                    min: '0',
	                    max: '200',
	                    low: '150',
	                    high: '100',
	                    optimum: '0',
	                    precision: '1',
	                    value: data.odometer })
	            ),
	            React.createElement(Devices, { ref: 'devices',
	                onConnect: this.props.onDeviceConnect,
	                onDisconnect: this.props.onDeviceDisconnect })
	        );
	    }
	});

	module.exports = Radium(EasySlider);

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = Radium;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var Radium = __webpack_require__(4);
	var MiniMeter = __webpack_require__(6);
	var Flipcard = __webpack_require__(7);
	var Gauge = __webpack_require__(8);
	var Datum = __webpack_require__(9);

	var Dashboard = React.createClass({
	    displayName: 'Dashboard',

	    render: function render() {
	        var data = this.props.data;

	        return React.createElement(
	            'div',
	            { style: { height: '100%' } },
	            React.createElement(
	                'div',
	                { style: styles.top },
	                React.createElement(
	                    'table',
	                    { width: '100%', height: '100%' },
	                    React.createElement(
	                        'tbody',
	                        null,
	                        React.createElement(
	                            'tr',
	                            null,
	                            React.createElement(
	                                'td',
	                                { style: styles.cell },
	                                React.createElement(MiniMeter, {
	                                    title: 'Duty Cycle',
	                                    units: '%',
	                                    min: '0',
	                                    max: '100',
	                                    low: '50',
	                                    high: '75',
	                                    optimum: '0',
	                                    precision: '0',
	                                    value: data.duty_now })
	                            )
	                        ),
	                        React.createElement(
	                            'tr',
	                            null,
	                            React.createElement(
	                                'td',
	                                { style: styles.cell },
	                                React.createElement(MiniMeter, {
	                                    title: 'Motorᵀ',
	                                    units: '°C',
	                                    min: '0',
	                                    max: '120',
	                                    low: '50',
	                                    high: '90',
	                                    optimum: '0',
	                                    precision: '0',
	                                    value: data.temp_motor })
	                            )
	                        ),
	                        React.createElement(
	                            'tr',
	                            null,
	                            React.createElement(
	                                'td',
	                                { style: styles.cell },
	                                React.createElement(MiniMeter, {
	                                    title: 'Controlᵀ',
	                                    units: '°C',
	                                    min: '0',
	                                    max: '120',
	                                    low: '50',
	                                    high: '90',
	                                    optimum: '0',
	                                    precision: '0',
	                                    value: data.temp_pcb })
	                            )
	                        )
	                    )
	                )
	            ),
	            React.createElement(
	                'div',
	                { style: styles.center },
	                React.createElement(
	                    Flipcard,
	                    { id: 'flipcard1' },
	                    React.createElement(Gauge, {
	                        id: 'gaugeSpeed',
	                        title: 'Speed',
	                        units: 'KPH',
	                        min: '0',
	                        max: '100',
	                        step: '1',
	                        precision: '0',
	                        value: data.speed }),
	                    React.createElement(Gauge, {
	                        id: 'gaugePower',
	                        title: 'Power',
	                        units: 'Watts',
	                        min: '0',
	                        max: '9999',
	                        step: '1',
	                        precision: '0',
	                        value: data.power })
	                )
	            ),
	            React.createElement(
	                'div',
	                { style: styles.bottom },
	                React.createElement(
	                    'div',
	                    { style: styles.table },
	                    React.createElement(
	                        'div',
	                        { style: styles.row },
	                        React.createElement(
	                            'div',
	                            { style: styles.col },
	                            React.createElement(Datum, {
	                                title: 'Throttle',
	                                units: 'V',
	                                precision: '1',
	                                value: data.throttle_v })
	                        ),
	                        React.createElement(
	                            'div',
	                            { style: styles.col },
	                            React.createElement(Datum, {
	                                title: 'RPM',
	                                units: '',
	                                precision: '0',
	                                value: data.rpm })
	                        ),
	                        React.createElement(
	                            'div',
	                            { style: styles.col },
	                            React.createElement(Datum, {
	                                title: 'Phase',
	                                units: 'A',
	                                precision: '1',
	                                value: data.current_motor })
	                        )
	                    ),
	                    React.createElement(
	                        'div',
	                        { style: styles.row },
	                        React.createElement(
	                            'div',
	                            { style: styles.col },
	                            React.createElement(Datum, {
	                                title: 'Current',
	                                units: 'A',
	                                precision: '1',
	                                value: data.current_in })
	                        ),
	                        React.createElement(
	                            'div',
	                            { style: styles.col },
	                            React.createElement(Datum, {
	                                title: 'Used',
	                                units: 'Ah',
	                                precision: '1',
	                                value: data.amp_hours })
	                        ),
	                        React.createElement(
	                            'div',
	                            { style: styles.col },
	                            React.createElement(Datum, {
	                                title: 'Watt/H',
	                                units: '',
	                                precision: '1',
	                                value: data.watt_hours })
	                        )
	                    )
	                )
	            )
	        );
	    }
	});

	var styles = {

	    table: {
	        display: 'table',
	        width: '100%',
	        height: '100%',
	        fontSize: '3vmin'
	    },

	    col: {
	        textAlign: 'center',
	        verticalAlign: 'middle',

	        '@media screen and (orientation:portrait)': {
	            display: 'table-cell'
	        },

	        '@media screen and (orientation:landscape)': {
	            height: '33.33%',
	            display: 'block',
	            paddingTop: '2.5vw'
	        }
	    },

	    row: {
	        '@media screen and (orientation:portrait)': {
	            display: 'table-row'
	        },

	        '@media screen and (orientation:landscape)': {
	            height: '50%',
	            display: 'block'
	        }
	    },

	    cell: {
	        verticalAlign: 'middle',

	        '@media screen and (orientation:portrait)': {
	            whiteSpace: 'nowrap',
	            overflow: 'hidden'
	        }
	    },

	    top: {
	        '@media screen and (orientation:portrait)': {
	            position: 'absolute',
	            width: '100%',
	            height: '25%',
	            textAlign: 'right'
	        },

	        '@media screen and (orientation:landscape)': {
	            position: 'absolute',
	            width: '25%',
	            height: '100%',
	            textAlign: 'left'
	        }
	    },

	    center: {
	        '@media screen and (orientation:portrait)': {
	            position: 'absolute',
	            width: '100%',
	            height: '50%',
	            top: '25%'
	        },

	        '@media screen and (orientation:landscape)': {
	            position: 'absolute',
	            width: '50%',
	            height: '100%',
	            left: '25%'
	        }
	    },

	    bottom: {
	        '@media screen and (orientation:portrait)': {
	            position: 'absolute',
	            width: '100%',
	            height: '25%',
	            textAlign: 'right',
	            left: '0',
	            bottom: '0'
	        },

	        '@media screen and (orientation:landscape)': {
	            position: 'absolute',
	            width: '25%',
	            height: '100%',
	            textAlign: 'left',
	            top: '0',
	            right: '0'
	        }
	    }
	};

	module.exports = Radium(Dashboard);
	/* small meters */ /* speed & power gauges */ /* simple telemetry */

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var Radium = __webpack_require__(4);

	var MiniMeter = React.createClass({
	    displayName: 'MiniMeter',

	    render: function render() {
	        var value = parseFloat(this.props.value).toFixed(this.props.precision);

	        return React.createElement(
	            'div',
	            null,
	            React.createElement(
	                'span',
	                { style: styles.title },
	                this.props.title,
	                ':'
	            ),
	            ' ',
	            React.createElement(
	                'span',
	                { style: styles.value },
	                value,
	                this.props.units
	            ),
	            ' ',
	            React.createElement('meter', {
	                style: styles.meter,
	                min: this.props.min,
	                max: this.props.max,
	                low: this.props.low,
	                high: this.props.high,
	                optimum: this.props.optimum,
	                value: this.props.value })
	        );
	    }
	});

	var styles = {

	    meter: {
	        background: '#eee',
	        WebkitAppearance: 'none',
	        appearance: 'none',
	        height: '3vw',

	        '@media screen and (orientation:portrait)': {
	            width: '50%'
	        },

	        '@media screen and (orientation:landscape)': {
	            width: '100%'
	        }
	    },

	    title: {
	        fontSize: '3vw'
	    },

	    value: {
	        fontSize: '3vw',
	        fontWeight: 'bold'
	    }
	};

	module.exports = Radium(MiniMeter);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var Radium = __webpack_require__(4);

	var Flipcard = React.createClass({
	    displayName: 'Flipcard',

	    getInitialState: function getInitialState() {
	        return {
	            flipped: false
	        };
	    },

	    flip: function flip() {
	        this.setState({ flipped: !this.state.flipped });
	    },

	    render: function render() {
	        var id = this.props.id;
	        var cards = React.Children.toArray(this.props.children);
	        var flipState = this.state.flipped ? styles.flipped : styles.unflipped;

	        return React.createElement(
	            'div',
	            { id: id, style: [styles.flipcard, flipState], onClick: this.flip },
	            React.createElement(
	                'div',
	                { style: styles.front },
	                cards[0]
	            ),
	            React.createElement(
	                'div',
	                { style: styles.back },
	                cards[1]
	            )
	        );
	    }
	});

	var styles = {

	    flipcard: {
	        background: 'transparent',
	        transformStyle: 'preserve-3d',
	        transition: 'transform 0.8s',
	        textAlign: 'center',
	        position: 'relative',
	        width: '100%',
	        height: '100%'
	    },

	    front: {
	        position: 'absolute',
	        backfaceVisibility: 'hidden',
	        width: '100%',
	        height: 'inherit',
	        padding: '10px',
	        top: '50%',
	        transform: 'translateY(-50%)',
	        zIndex: '2'
	    },

	    back: {
	        position: 'absolute',
	        backfaceVisibility: 'hidden',
	        width: '100%',
	        height: 'inherit',
	        padding: '10px',
	        top: '50%',
	        transform: 'translateY(-50%) rotateY(180deg)',
	        zIndex: '1'
	    },

	    flipped: {
	        transform: 'rotateY(180deg)'
	    },

	    unflipped: {
	        transform: 'none'
	    }
	};

	module.exports = Radium(Flipcard);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var Radium = __webpack_require__(4);

	var Gauge = React.createClass({
	    displayName: 'Gauge',

	    render: function render() {
	        return React.createElement(
	            'div',
	            { style: { width: '100%', height: '100%' } },
	            React.createElement(
	                'div',
	                { style: styles.title },
	                this.props.title
	            ),
	            React.createElement('input', { id: this.props.id, value: this.props.value, 'data-width': '100%' }),
	            React.createElement(
	                'div',
	                { style: styles.units },
	                this.props.units
	            )
	        );
	    },

	    componentDidMount: function componentDidMount() {
	        this.dial = $('#' + this.props.id);

	        this.dial.knob({
	            min: Math.abs(this.props.min),
	            max: Math.abs(this.props.max),
	            step: this.props.step,
	            angleOffset: 270,
	            angleArc: 360,
	            stopper: false,
	            readOnly: true,
	            rotation: 'clockwise',
	            biDirectional: true,
	            biColor: '#FF9900',
	            displayMax: true,
	            relative: true
	        });
	    },

	    componentDidUpdate: function componentDidUpdate() {
	        var value = parseFloat(this.props.value).toFixed(this.props.precision);
	        this.dial.val(value).trigger('change');
	    }
	});

	var styles = {

	    title: {
	        color: '#ccc',
	        fontSize: '4vw',
	        fontWeight: 'bold',
	        position: 'absolute',
	        top: '30%',
	        left: '0',
	        right: '0'
	    },

	    units: {
	        color: '#333',
	        fontSize: '5vw',
	        fontWeight: 'bold',
	        position: 'absolute',
	        top: '60%',
	        left: '0',
	        right: '0'
	    }
	};

	module.exports = Radium(Gauge);

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var Radium = __webpack_require__(4);

	var Datum = React.createClass({
					displayName: 'Datum',

					render: function render() {
									var value = parseFloat(this.props.value).toFixed(this.props.precision);

									return React.createElement(
													'div',
													{ style: styles.datum },
													React.createElement(
																	'span',
																	{ style: styles.title },
																	this.props.title
													),
													' ',
													React.createElement(
																	'span',
																	{ style: styles.value },
																	value,
																	this.props.units
													)
									);
					}
	});

	var styles = {

					datum: {
									fontSize: '4vmin',
									fontWeight: 'bold'
					},

					title: {
									color: '#999'
					},

					value: {
									color: '#333'
					}
	};

	module.exports = Radium(Datum);

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var Radium = __webpack_require__(4);

	var GoogleMaps = React.createClass({
	    displayName: 'GoogleMaps',

	    getInitialState: function getInitialState() {
	        this.map = null;
	        this.markers = [];
	        this.use_geo = false;

	        this.autocomplete = null;
	        this.countryRestrict = { 'country': 'tw' };

	        this.startPosition = new google.maps.LatLng(25.1236, 121.532);
	        this.endPosition = new google.maps.LatLng(25.127347, 121.536150);

	        this.themes = {
	            MidnightCommander: [{ 'featureType': 'water', 'stylers': [{ 'color': '#021019' }] }, { 'featureType': 'landscape', 'stylers': [{ 'color': '#08304b' }] }, { 'featureType': 'poi', 'elementType': 'geometry', 'stylers': [{ 'color': '#0c4152' }, { 'lightness': 5 }] }, { 'featureType': 'road.highway', 'elementType': 'geometry.fill', 'stylers': [{ 'color': '#000000' }] }, { 'featureType': 'road.highway', 'elementType': 'geometry.stroke', 'stylers': [{ 'color': '#0b434f' }, { 'lightness': 25 }] }, { 'featureType': 'road.arterial', 'elementType': 'geometry.fill', 'stylers': [{ 'color': '#000000' }] }, { 'featureType': 'road.arterial', 'elementType': 'geometry.stroke', 'stylers': [{ 'color': '#0b3d51' }, { 'lightness': 16 }] }, { 'featureType': 'road.local', 'elementType': 'geometry', 'stylers': [{ 'color': '#000000' }] }, { 'elementType': 'labels.text.fill', 'stylers': [{ 'color': '#ffffff' }] }, { 'elementType': 'labels.text.stroke', 'stylers': [{ 'color': '#000000' }, { 'lightness': 13 }] }, { 'featureType': 'transit', 'stylers': [{ 'color': '#146474' }] }, { 'featureType': 'administrative', 'elementType': 'geometry.fill', 'stylers': [{ 'color': '#000000' }] }, { 'featureType': 'administrative', 'elementType': 'geometry.stroke', 'stylers': [{ 'color': '#144b53' }, { 'lightness': 14 }, { 'weight': 1.4 }] }],
	            NeutralBlue: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#193341" }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#2c5a71" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#29768a" }, { "lightness": -37 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#406d80" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#406d80" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#3e606f" }, { "weight": 2 }, { "gamma": 0.84 }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "weight": 0.6 }, { "color": "#1a3541" }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#2c5a71" }] }],
	            BlueEssence: [{ "featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#e0efef" }] }, { "featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "hue": "#1900ff" }, { "color": "#c0e8e8" }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill" }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "lightness": 100 }, { "visibility": "simplified" }] }, { "featureType": "road", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "stylers": [{ "color": "#7dcdcd" }] }, { "featureType": "transit.line", "elementType": "geometry", "stylers": [{ "visibility": "on" }, { "lightness": 700 }] }],
	            Cobalt: [{ "featureType": "all", "elementType": "all", "stylers": [{ "invert_lightness": true }, { "saturation": 10 }, { "lightness": 30 }, { "gamma": 0.5 }, { "hue": "#435158" }] }]
	        };

	        return {
	            theme: []
	        };
	    },

	    componentDidMount: function componentDidMount() {

	        this.map = new google.maps.Map($("#maps-canvas")[0], {
	            mapTypeControl: true,
	            zoom: 15,
	            mapTypeId: google.maps.MapTypeId.ROADMAP,
	            styles: this.state.theme
	        });

	        this.getLocation();
	    },

	    addMarker: function addMarker(map, position, title, image) {
	        return new google.maps.Marker({
	            map: map,
	            icon: image,
	            title: title,
	            position: position
	        });
	    },

	    getLocation: function getLocation() {
	        if (this.use_geo) {
	            navigator.geolocation.watchPosition(function (pos) {
	                var position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
	                this.map.setCenter(position);
	                this.addMarker(this.map, position, "My Position", null);
	            }, function () {
	                console.log("Geolocation not supported");
	            });
	        } else {
	            this.map.setCenter(this.startPosition);
	            this.addMarker(this.map, this.startPosition, "My Position", null);
	        }
	    },

	    render: function render() {
	        return React.createElement('div', { style: styles, id: 'maps-canvas' });
	    }
	});

	var styles = {
	    position: 'absolute',
	    width: '100%',
	    height: '100%'
	};

	module.exports = Radium(GoogleMaps);

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Bluetooth devices modal dialog
	*/
	'use strict';

	var React = __webpack_require__(1);
	var Radium = __webpack_require__(4);
	var Modal = __webpack_require__(12);
	var Button = __webpack_require__(81);
	var ListGroup = __webpack_require__(88);
	var ListGroupItem = __webpack_require__(89);
	var Spinner = __webpack_require__(91);

	var Devices = React.createClass({
	    displayName: 'Devices',

	    getInitialState: function getInitialState() {
	        this.bluetooth = false;
	        this.enableBluetooth();

	        return {
	            showModal: false,
	            showMessage: 'block',
	            deviceId: '',
	            spinnerId: '',
	            devices: [{ "name": "HC-06", "address": "98:D3:31:20:57:E0", "id": "98:D3:31:20:57:E0", "class": 7936 }, { "name": "Mi Note", "address": "98:D3:31:20:57:E1", "id": "98:D3:31:20:57:E1", "class": 7936 }, { "name": "Nexus 7", "address": "98:D3:31:20:57:E2", "id": "98:D3:31:20:57:E2", "class": 7936 }, { "name": "Nexus 4", "address": "98:D3:31:20:57:E3", "id": "98:D3:31:20:57:E3", "class": 7936 }]
	        };
	    },

	    showModal: function showModal() {
	        this.setState({ showModal: true, showMessage: 'block', spinnerId: '' });
	        this.refreshDevices();
	    },

	    hideModal: function hideModal() {
	        this.setState({ showModal: false });
	    },

	    showMessage: function showMessage() {
	        this.setState({ showMessage: 'block' });
	    },

	    hideMessage: function hideMessage() {
	        this.setState({ showMessage: 'none' });
	    },

	    showSpinner: function showSpinner(id) {
	        this.setState({ spinnerId: id });
	    },

	    hideSpinner: function hideSpinner() {
	        this.setState({ spinnerId: '' });
	    },

	    enableBluetooth: function enableBluetooth() {
	        document.addEventListener('deviceready', (function () {
	            bluetoothSerial.enable((function () {
	                this.bluetooth = true;
	            }).bind(this), (function () {
	                this.bluetooth = false;
	            }).bind(this));
	        }).bind(this), false);
	    },

	    refreshDevices: function refreshDevices() {
	        if (!this.bluetooth) return;

	        bluetoothSerial.list((function (results) {
	            this.setState({ devices: results });
	        }).bind(this), this.handleError);

	        bluetoothSerial.discoverUnpaired((function (results) {
	            this.hideMessage();
	        }).bind(this), this.handleError);

	        bluetoothSerial.setDeviceDiscoveredListener((function (device) {
	            this.setState({ devices: this.state.devices.concat(device) });
	        }).bind(this));
	    },

	    handleError: function handleError(error) {
	        this.disconnectDevice();
	        console.error(error);
	        alert(error);
	    },

	    getDeviceById: function getDeviceById(uuid) {
	        var results = $.grep(this.state.devices, function (d) {
	            return d.id == uuid;
	        });
	        return results[0];
	    },

	    disconnectDevice: function disconnectDevice() {
	        if (!this.bluetooth) return;
	        this.props.onDisconnect();
	        this.setState({ deviceId: '', spinnerId: '' });
	        bluetoothSerial.isConnected(function () {
	            bluetoothSerial.disconnect();
	        });
	    },

	    connectDevice: function connectDevice(uuid) {
	        this.disconnectDevice();
	        this.showSpinner(uuid);
	        this.hideMessage();
	        //this.setState({ deviceId: uuid });

	        if (!this.bluetooth) return;

	        bluetoothSerial.clearDeviceDiscoveredListener();

	        bluetoothSerial.connect(uuid, (function () {
	            this.setState({ deviceId: uuid });
	            this.hideSpinner();
	            this.hideModal();
	            this.props.onConnect(); // onConnect() callback
	            console.log("Connected to device: " + uuid);
	        }).bind(this), this.handleError);
	    },

	    render: function render() {

	        var list = this.state.devices.map(function (device, index) {
	            var active = device.id == this.state.deviceId ? true : false;
	            var spinner = device.id == this.state.spinnerId ? React.createElement(Spinner, { width: '20px', height: '20px', style: styles.spinner }) : '';
	            var onclick = active ? null : this.connectDevice.bind(this, device.id);

	            return React.createElement(
	                ListGroupItem,
	                {
	                    href: '#',
	                    key: index,
	                    onClick: onclick,
	                    active: active },
	                React.createElement('img', { src: 'img/ic_bluetooth_black_24px.svg' }),
	                device.name,
	                ' (',
	                device.id,
	                ')',
	                spinner
	            );
	        }, this);

	        return React.createElement(
	            'div',
	            null,
	            React.createElement(
	                Modal,
	                {
	                    backdrop: 'static',
	                    show: this.state.showModal,
	                    onHide: this.hideModal,
	                    container: this,
	                    bsSize: 'large' },
	                React.createElement(
	                    Modal.Header,
	                    { style: styles.header, closeButton: true },
	                    React.createElement(
	                        Modal.Title,
	                        null,
	                        'Bluetooth Devices'
	                    )
	                ),
	                React.createElement(
	                    Modal.Body,
	                    null,
	                    React.createElement(
	                        ListGroup,
	                        null,
	                        list
	                    ),
	                    React.createElement(
	                        'div',
	                        { style: [{ display: this.state.showMessage }, styles.message] },
	                        'Discovering devices...',
	                        React.createElement(Spinner, { width: '25px', height: '25px', style: styles.spinner })
	                    )
	                )
	            )
	        );
	    }
	});

	var styles = {

	    header: {
	        color: '#fff',
	        background: '#337ab7'
	    },

	    message: {
	        padding: '0 15px 0 15px'
	    },

	    spinner: {
	        float: 'right'
	    }
	};

	module.exports = Radium(Devices);

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-disable react/prop-types */

	'use strict';

	var _extends = __webpack_require__(13)['default'];

	var _objectWithoutProperties = __webpack_require__(27)['default'];

	var _Object$isFrozen = __webpack_require__(28)['default'];

	var _Object$keys = __webpack_require__(33)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _utilsDomUtils = __webpack_require__(38);

	var _utilsDomUtils2 = _interopRequireDefault(_utilsDomUtils);

	var _domHelpersUtilScrollbarSize = __webpack_require__(42);

	var _domHelpersUtilScrollbarSize2 = _interopRequireDefault(_domHelpersUtilScrollbarSize);

	var _utilsEventListener = __webpack_require__(44);

	var _utilsEventListener2 = _interopRequireDefault(_utilsEventListener);

	var _utilsCreateChainedFunction = __webpack_require__(45);

	var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

	var _reactPropTypesLibElementType = __webpack_require__(46);

	var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

	var _domHelpersUtilInDOM = __webpack_require__(43);

	var _domHelpersUtilInDOM2 = _interopRequireDefault(_domHelpersUtilInDOM);

	var _domHelpersQueryContains = __webpack_require__(48);

	var _domHelpersQueryContains2 = _interopRequireDefault(_domHelpersQueryContains);

	var _domHelpersActiveElement = __webpack_require__(49);

	var _domHelpersActiveElement2 = _interopRequireDefault(_domHelpersActiveElement);

	var _reactOverlaysLibPortal = __webpack_require__(50);

	var _reactOverlaysLibPortal2 = _interopRequireDefault(_reactOverlaysLibPortal);

	var _Fade = __webpack_require__(55);

	var _Fade2 = _interopRequireDefault(_Fade);

	var _ModalDialog = __webpack_require__(73);

	var _ModalDialog2 = _interopRequireDefault(_ModalDialog);

	var _ModalBody = __webpack_require__(77);

	var _ModalBody2 = _interopRequireDefault(_ModalBody);

	var _ModalHeader = __webpack_require__(78);

	var _ModalHeader2 = _interopRequireDefault(_ModalHeader);

	var _ModalTitle = __webpack_require__(79);

	var _ModalTitle2 = _interopRequireDefault(_ModalTitle);

	var _ModalFooter = __webpack_require__(80);

	var _ModalFooter2 = _interopRequireDefault(_ModalFooter);

	/**
	 * Gets the correct clientHeight of the modal container
	 * when the body/window/document you need to use the docElement clientHeight
	 * @param  {HTMLElement} container
	 * @param  {ReactElement|HTMLElement} context
	 * @return {Number}
	 */
	function containerClientHeight(container, context) {
	  var doc = _utilsDomUtils2['default'].ownerDocument(context);

	  return container === doc.body || container === doc.documentElement ? doc.documentElement.clientHeight : container.clientHeight;
	}

	function getContainer(context) {
	  return context.props.container && _reactDom2['default'].findDOMNode(context.props.container) || _utilsDomUtils2['default'].ownerDocument(context).body;
	}

	var currentFocusListener = undefined;

	/**
	 * Firefox doesn't have a focusin event so using capture is easiest way to get bubbling
	 * IE8 can't do addEventListener, but does have onfocusin, so we use that in ie8
	 *
	 * We only allow one Listener at a time to avoid stack overflows
	 *
	 * @param  {ReactElement|HTMLElement} context
	 * @param  {Function} handler
	 */
	function onFocus(context, handler) {
	  var doc = _utilsDomUtils2['default'].ownerDocument(context);
	  var useFocusin = !doc.addEventListener;
	  var remove = undefined;

	  if (currentFocusListener) {
	    currentFocusListener.remove();
	  }

	  if (useFocusin) {
	    document.attachEvent('onfocusin', handler);
	    remove = function () {
	      return document.detachEvent('onfocusin', handler);
	    };
	  } else {
	    document.addEventListener('focus', handler, true);
	    remove = function () {
	      return document.removeEventListener('focus', handler, true);
	    };
	  }

	  currentFocusListener = { remove: remove };

	  return currentFocusListener;
	}

	var Modal = _react2['default'].createClass({
	  displayName: 'Modal',

	  propTypes: _extends({}, _reactOverlaysLibPortal2['default'].propTypes, _ModalDialog2['default'].propTypes, {

	    /**
	     * Include a backdrop component. Specify 'static' for a backdrop that doesn't trigger an "onHide" when clicked.
	     */
	    backdrop: _react2['default'].PropTypes.oneOf(['static', true, false]),

	    /**
	     * Close the modal when escape key is pressed
	     */
	    keyboard: _react2['default'].PropTypes.bool,

	    /**
	     * Open and close the Modal with a slide and fade animation.
	     */
	    animation: _react2['default'].PropTypes.bool,

	    /**
	     * A Component type that provides the modal content Markup. This is a useful prop when you want to use your own
	     * styles and markup to create a custom modal component.
	     */
	    dialogComponent: _reactPropTypesLibElementType2['default'],

	    /**
	     * When `true` The modal will automatically shift focus to itself when it opens, and replace it to the last focused element when it closes.
	     * Generally this should never be set to false as it makes the Modal less accessible to assistive technologies, like screen-readers.
	     */
	    autoFocus: _react2['default'].PropTypes.bool,

	    /**
	     * When `true` The modal will prevent focus from leaving the Modal while open.
	     * Consider leaving the default value here, as it is necessary to make the Modal work well with assistive technologies,
	     * such as screen readers.
	     */
	    enforceFocus: _react2['default'].PropTypes.bool,

	    /**
	     * Hide this from automatic props documentation generation.
	     * @private
	     */
	    bsStyle: _react2['default'].PropTypes.string,

	    /**
	     * When `true` The modal will show itself.
	     */
	    show: _react2['default'].PropTypes.bool
	  }),

	  getDefaultProps: function getDefaultProps() {
	    return {
	      bsClass: 'modal',
	      dialogComponent: _ModalDialog2['default'],
	      show: false,
	      animation: true,
	      backdrop: true,
	      keyboard: true,
	      autoFocus: true,
	      enforceFocus: true
	    };
	  },

	  getInitialState: function getInitialState() {
	    return {
	      exited: !this.props.show
	    };
	  },

	  render: function render() {
	    var _props = this.props;
	    var children = _props.children;
	    var animation = _props.animation;
	    var backdrop = _props.backdrop;

	    var props = _objectWithoutProperties(_props, ['children', 'animation', 'backdrop']);

	    var onExit = props.onExit;
	    var onExiting = props.onExiting;
	    var onEnter = props.onEnter;
	    var onEntering = props.onEntering;
	    var onEntered = props.onEntered;

	    var show = !!props.show;
	    var Dialog = props.dialogComponent;

	    var mountModal = show || animation && !this.state.exited;
	    if (!mountModal) {
	      return null;
	    }

	    var modal = _react2['default'].createElement(
	      Dialog,
	      _extends({}, props, {
	        ref: this._setDialogRef,
	        className: _classnames2['default'](this.props.className, { 'in': show && !animation }),
	        onClick: backdrop === true ? this.handleBackdropClick : null }),
	      this.renderContent()
	    );

	    if (animation) {
	      modal = _react2['default'].createElement(
	        _Fade2['default'],
	        {
	          transitionAppear: true,
	          unmountOnExit: true,
	          'in': show,
	          timeout: Modal.TRANSITION_DURATION,
	          onExit: onExit,
	          onExiting: onExiting,
	          onExited: this.handleHidden,
	          onEnter: onEnter,
	          onEntering: onEntering,
	          onEntered: onEntered },
	        modal
	      );
	    }

	    if (backdrop) {
	      modal = this.renderBackdrop(modal);
	    }

	    return _react2['default'].createElement(
	      _reactOverlaysLibPortal2['default'],
	      { container: props.container },
	      modal
	    );
	  },

	  renderContent: function renderContent() {
	    var _this = this;

	    return _react2['default'].Children.map(this.props.children, function (child) {
	      // TODO: use context in 0.14
	      if (child && child.type && child.type.__isModalHeader) {
	        return _react.cloneElement(child, {
	          onHide: _utilsCreateChainedFunction2['default'](_this.props.onHide, child.props.onHide)
	        });
	      }
	      return child;
	    });
	  },

	  renderBackdrop: function renderBackdrop(modal) {
	    var _props2 = this.props;
	    var animation = _props2.animation;
	    var bsClass = _props2.bsClass;

	    var duration = Modal.BACKDROP_TRANSITION_DURATION;

	    // Don't handle clicks for "static" backdrops
	    var onClick = this.props.backdrop === true ? this.handleBackdropClick : null;

	    var backdrop = _react2['default'].createElement('div', {
	      ref: 'backdrop',
	      className: _classnames2['default'](bsClass + '-backdrop', { 'in': this.props.show && !animation }),
	      onClick: onClick });

	    return _react2['default'].createElement(
	      'div',
	      {
	        ref: 'modal' },
	      animation ? _react2['default'].createElement(
	        _Fade2['default'],
	        { transitionAppear: true, 'in': this.props.show, timeout: duration },
	        backdrop
	      ) : backdrop,
	      modal
	    );
	  },

	  _setDialogRef: function _setDialogRef(ref) {
	    // issue #1074
	    // due to: https://github.com/facebook/react/blob/v0.13.3/src/core/ReactCompositeComponent.js#L842
	    //
	    // when backdrop is `false` react hasn't had a chance to reassign the refs to a usable object, b/c there are no other
	    // "classic" refs on the component (or they haven't been processed yet)
	    // TODO: Remove the need for this in next breaking release
	    if (_Object$isFrozen(this.refs) && !_Object$keys(this.refs).length) {
	      this.refs = {};
	    }

	    this.refs.dialog = ref;

	    // maintains backwards compat with older component breakdown
	    if (!this.props.backdrop) {
	      this.refs.modal = ref;
	    }
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (nextProps.show) {
	      this.setState({ exited: false });
	    } else if (!nextProps.animation) {
	      // Otherwise let handleHidden take care of marking exited.
	      this.setState({ exited: true });
	    }
	  },

	  componentWillUpdate: function componentWillUpdate(nextProps) {
	    if (nextProps.show) {
	      this.checkForFocus();
	    }
	  },

	  componentDidMount: function componentDidMount() {
	    if (this.props.show) {
	      this.onShow();
	    }
	  },

	  componentDidUpdate: function componentDidUpdate(prevProps) {
	    var animation = this.props.animation;

	    if (prevProps.show && !this.props.show && !animation) {
	      // otherwise handleHidden will call this.
	      this.onHide();
	    } else if (!prevProps.show && this.props.show) {
	      this.onShow();
	    }
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    if (this.props.show) {
	      this.onHide();
	    }
	  },

	  onShow: function onShow() {
	    var _this2 = this;

	    var doc = _utilsDomUtils2['default'].ownerDocument(this);
	    var win = _utilsDomUtils2['default'].ownerWindow(this);

	    this._onDocumentKeyupListener = _utilsEventListener2['default'].listen(doc, 'keyup', this.handleDocumentKeyUp);

	    this._onWindowResizeListener = _utilsEventListener2['default'].listen(win, 'resize', this.handleWindowResize);

	    if (this.props.enforceFocus) {
	      this._onFocusinListener = onFocus(this, this.enforceFocus);
	    }

	    var container = getContainer(this);

	    container.className += container.className.length ? ' modal-open' : 'modal-open';

	    this._containerIsOverflowing = container.scrollHeight > containerClientHeight(container, this);

	    this._originalPadding = container.style.paddingRight;

	    if (this._containerIsOverflowing) {
	      container.style.paddingRight = parseInt(this._originalPadding || 0, 10) + _domHelpersUtilScrollbarSize2['default']() + 'px';
	    }

	    this.setState(this._getStyles(), function () {
	      return _this2.focusModalContent();
	    });
	  },

	  onHide: function onHide() {
	    this._onDocumentKeyupListener.remove();
	    this._onWindowResizeListener.remove();

	    if (this._onFocusinListener) {
	      this._onFocusinListener.remove();
	    }

	    var container = getContainer(this);

	    container.style.paddingRight = this._originalPadding;

	    container.className = container.className.replace(/ ?modal-open/, '');

	    this.restoreLastFocus();
	  },

	  handleHidden: function handleHidden() {
	    this.setState({ exited: true });

	    this.onHide();

	    if (this.props.onExited) {
	      var _props3;

	      (_props3 = this.props).onExited.apply(_props3, arguments);
	    }
	  },

	  handleBackdropClick: function handleBackdropClick(e) {
	    if (e.target !== e.currentTarget) {
	      return;
	    }

	    this.props.onHide();
	  },

	  handleDocumentKeyUp: function handleDocumentKeyUp(e) {
	    if (this.props.keyboard && e.keyCode === 27) {
	      this.props.onHide();
	    }
	  },

	  handleWindowResize: function handleWindowResize() {
	    this.setState(this._getStyles());
	  },

	  checkForFocus: function checkForFocus() {
	    if (_domHelpersUtilInDOM2['default']) {
	      this.lastFocus = _domHelpersActiveElement2['default'](document);
	    }
	  },

	  focusModalContent: function focusModalContent() {
	    var modalContent = _reactDom2['default'].findDOMNode(this.refs.dialog);
	    var current = _domHelpersActiveElement2['default'](_utilsDomUtils2['default'].ownerDocument(this));
	    var focusInModal = current && _domHelpersQueryContains2['default'](modalContent, current);

	    if (modalContent && this.props.autoFocus && !focusInModal) {
	      this.lastFocus = current;
	      modalContent.focus();
	    }
	  },

	  restoreLastFocus: function restoreLastFocus() {
	    if (this.lastFocus && this.lastFocus.focus) {
	      this.lastFocus.focus();
	      this.lastFocus = null;
	    }
	  },

	  enforceFocus: function enforceFocus() {
	    if (!this.isMounted()) {
	      return;
	    }

	    var active = _domHelpersActiveElement2['default'](_utilsDomUtils2['default'].ownerDocument(this));
	    var modal = _reactDom2['default'].findDOMNode(this.refs.dialog);

	    if (modal && modal !== active && !_domHelpersQueryContains2['default'](modal, active)) {
	      modal.focus();
	    }
	  },

	  _getStyles: function _getStyles() {
	    if (!_domHelpersUtilInDOM2['default']) {
	      return {};
	    }

	    var node = _reactDom2['default'].findDOMNode(this.refs.modal);
	    var scrollHt = node.scrollHeight;
	    var container = getContainer(this);
	    var containerIsOverflowing = this._containerIsOverflowing;
	    var modalIsOverflowing = scrollHt > containerClientHeight(container, this);

	    return {
	      dialogStyles: {
	        paddingRight: containerIsOverflowing && !modalIsOverflowing ? _domHelpersUtilScrollbarSize2['default']() : void 0,
	        paddingLeft: !containerIsOverflowing && modalIsOverflowing ? _domHelpersUtilScrollbarSize2['default']() : void 0
	      }
	    };
	  }

	});

	Modal.Body = _ModalBody2['default'];
	Modal.Header = _ModalHeader2['default'];
	Modal.Title = _ModalTitle2['default'];
	Modal.Footer = _ModalFooter2['default'];

	Modal.Dialog = _ModalDialog2['default'];

	Modal.TRANSITION_DURATION = 300;
	Modal.BACKDROP_TRANSITION_DURATION = 150;

	exports['default'] = Modal;
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$assign = __webpack_require__(14)["default"];

	exports["default"] = _Object$assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

	exports.__esModule = true;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(15), __esModule: true };

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(16);
	module.exports = __webpack_require__(19).Object.assign;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $def = __webpack_require__(17);

	$def($def.S + $def.F, 'Object', {assign: __webpack_require__(20)});

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(18)
	  , core      = __webpack_require__(19)
	  , PROTOTYPE = 'prototype';
	var ctx = function(fn, that){
	  return function(){
	    return fn.apply(that, arguments);
	  };
	};
	var $def = function(type, name, source){
	  var key, own, out, exp
	    , isGlobal = type & $def.G
	    , isProto  = type & $def.P
	    , target   = isGlobal ? global : type & $def.S
	        ? global[name] : (global[name] || {})[PROTOTYPE]
	    , exports  = isGlobal ? core : core[name] || (core[name] = {});
	  if(isGlobal)source = name;
	  for(key in source){
	    // contains in native
	    own = !(type & $def.F) && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    if(isGlobal && typeof target[key] != 'function')exp = source[key];
	    // bind timers to global for call from export context
	    else if(type & $def.B && own)exp = ctx(out, global);
	    // wrap global constructors for prevent change them in library
	    else if(type & $def.W && target[key] == out)!function(C){
	      exp = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      exp[PROTOTYPE] = C[PROTOTYPE];
	    }(out);
	    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export
	    exports[key] = exp;
	    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$def.F = 1;  // forced
	$def.G = 2;  // global
	$def.S = 4;  // static
	$def.P = 8;  // proto
	$def.B = 16; // bind
	$def.W = 32; // wrap
	module.exports = $def;

/***/ },
/* 18 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 19 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.3'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(21)
	  , toObject = __webpack_require__(22)
	  , IObject  = __webpack_require__(24);

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(26)(function(){
	  var a = Object.assign
	    , A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , $$    = arguments
	    , $$len = $$.length
	    , index = 1
	    , getKeys    = $.getKeys
	    , getSymbols = $.getSymbols
	    , isEnum     = $.isEnum;
	  while($$len > index){
	    var S      = IObject($$[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  }
	  return T;
	} : Object.assign;

/***/ },
/* 21 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(23);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(25);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (obj, keys) {
	  var target = {};

	  for (var i in obj) {
	    if (keys.indexOf(i) >= 0) continue;
	    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
	    target[i] = obj[i];
	  }

	  return target;
	};

	exports.__esModule = true;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(29), __esModule: true };

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(30);
	module.exports = __webpack_require__(19).Object.isFrozen;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.12 Object.isFrozen(O)
	var isObject = __webpack_require__(31);

	__webpack_require__(32)('isFrozen', function($isFrozen){
	  return function isFrozen(it){
	    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
	  };
	});

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	module.exports = function(KEY, exec){
	  var $def = __webpack_require__(17)
	    , fn   = (__webpack_require__(19).Object || {})[KEY] || Object[KEY]
	    , exp  = {};
	  exp[KEY] = exec(fn);
	  $def($def.S + $def.F * __webpack_require__(26)(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(34), __esModule: true };

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(35);
	module.exports = __webpack_require__(19).Object.keys;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(22);

	__webpack_require__(32)('keys', function($keys){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 36 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};

	exports.__esModule = true;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2015 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */

	(function () {
		'use strict';

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = '';

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes += ' ' + arg;
				} else if (Array.isArray(arg)) {
					classes += ' ' + classNames.apply(null, arg);
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes += ' ' + key;
						}
					}
				}
			}

			return classes.substr(1);
		}

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _domHelpersOwnerDocument = __webpack_require__(39);

	var _domHelpersOwnerDocument2 = _interopRequireDefault(_domHelpersOwnerDocument);

	var _domHelpersOwnerWindow = __webpack_require__(40);

	var _domHelpersOwnerWindow2 = _interopRequireDefault(_domHelpersOwnerWindow);

	function ownerDocument(componentOrElement) {
	  var elem = _reactDom2['default'].findDOMNode(componentOrElement);
	  return _domHelpersOwnerDocument2['default'](elem && elem.ownerDocument || document);
	}

	function ownerWindow(componentOrElement) {
	  var doc = ownerDocument(componentOrElement);
	  return _domHelpersOwnerWindow2['default'](doc);
	}

	/**
	 * Get the height of the document
	 *
	 * @returns {documentHeight: number}
	 */
	function getDocumentHeight() {
	  return Math.max(document.documentElement.offsetHeight, document.height, document.body.scrollHeight, document.body.offsetHeight);
	}

	/**
	 * Get an element's size
	 *
	 * @param {HTMLElement} elem
	 * @returns {{width: number, height: number}}
	 */
	function getSize(elem) {
	  var rect = {
	    width: elem.offsetWidth || 0,
	    height: elem.offsetHeight || 0
	  };
	  if (typeof elem.getBoundingClientRect !== 'undefined') {
	    var _elem$getBoundingClientRect = elem.getBoundingClientRect();

	    var width = _elem$getBoundingClientRect.width;
	    var height = _elem$getBoundingClientRect.height;

	    rect.width = width || rect.width;
	    rect.height = height || rect.height;
	  }
	  return rect;
	}

	exports['default'] = {
	  ownerWindow: ownerWindow,
	  ownerDocument: ownerDocument,
	  getDocumentHeight: getDocumentHeight,
	  getSize: getSize
	};
	module.exports = exports['default'];

/***/ },
/* 39 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = ownerDocument;

	function ownerDocument(node) {
	  return node && node.ownerDocument || document;
	}

	module.exports = exports["default"];

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var babelHelpers = __webpack_require__(41);

	exports.__esModule = true;
	exports['default'] = ownerWindow;

	var _ownerDocument = __webpack_require__(39);

	var _ownerDocument2 = babelHelpers.interopRequireDefault(_ownerDocument);

	function ownerWindow(node) {
	  var doc = (0, _ownerDocument2['default'])(node);
	  return doc && doc.defaultView || doc.parentWindow;
	}

	module.exports = exports['default'];

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === "object") {
	    factory(exports);
	  } else {
	    factory(root.babelHelpers = {});
	  }
	})(this, function (global) {
	  var babelHelpers = global;

	  babelHelpers.interopRequireDefault = function (obj) {
	    return obj && obj.__esModule ? obj : {
	      "default": obj
	    };
	  };

	  babelHelpers._extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };
	})

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var canUseDOM = __webpack_require__(43);

	var size;

	module.exports = function (recalc) {
	  if (!size || recalc) {
	    if (canUseDOM) {
	      var scrollDiv = document.createElement('div');

	      scrollDiv.style.position = 'absolute';
	      scrollDiv.style.top = '-9999px';
	      scrollDiv.style.width = '50px';
	      scrollDiv.style.height = '50px';
	      scrollDiv.style.overflow = 'scroll';

	      document.body.appendChild(scrollDiv);
	      size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
	      document.body.removeChild(scrollDiv);
	    }
	  }

	  return size;
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';
	module.exports = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/***/ },
/* 44 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * This file contains a modified version of:
	 * https://github.com/facebook/react/blob/v0.12.0/src/vendor/stubs/EventListener.js
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * TODO: remove in favour of solution provided by:
	 *  https://github.com/facebook/react/issues/285
	 */

	/**
	 * Does not take into account specific nature of platform.
	 */
	'use strict';

	exports.__esModule = true;
	var EventListener = {
	  /**
	   * Listen to DOM events during the bubble phase.
	   *
	   * @param {DOMEventTarget} target DOM element to register listener on.
	   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
	   * @param {function} callback Callback function.
	   * @return {object} Object with a `remove` method.
	   */
	  listen: function listen(target, eventType, callback) {
	    if (target.addEventListener) {
	      target.addEventListener(eventType, callback, false);
	      return {
	        remove: function remove() {
	          target.removeEventListener(eventType, callback, false);
	        }
	      };
	    } else if (target.attachEvent) {
	      target.attachEvent('on' + eventType, callback);
	      return {
	        remove: function remove() {
	          target.detachEvent('on' + eventType, callback);
	        }
	      };
	    }
	  }
	};

	exports['default'] = EventListener;
	module.exports = exports['default'];

/***/ },
/* 45 */
/***/ function(module, exports) {

	/**
	 * Safe chained function
	 *
	 * Will only create a new function if needed,
	 * otherwise will pass back existing functions or null.
	 *
	 * @param {function} functions to chain
	 * @returns {function|null}
	 */
	'use strict';

	exports.__esModule = true;
	function createChainedFunction() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }

	  return funcs.filter(function (f) {
	    return f != null;
	  }).reduce(function (acc, f) {
	    if (typeof f !== 'function') {
	      throw new Error('Invalid Argument Type, must only provide functions, undefined, or null.');
	    }

	    if (acc === null) {
	      return f;
	    }

	    return function chainedFunction() {
	      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      acc.apply(this, args);
	      f.apply(this, args);
	    };
	  }, null);
	}

	exports['default'] = createChainedFunction;
	module.exports = exports['default'];

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _common = __webpack_require__(47);

	/**
	 * Checks whether a prop provides a type of element.
	 *
	 * The type of element can be provided in two forms:
	 * - tag name (string)
	 * - a return value of React.createClass(...)
	 *
	 * @param props
	 * @param propName
	 * @param componentName
	 * @returns {Error|undefined}
	 */

	function validate(props, propName, componentName) {
	  var errBeginning = _common.errMsg(props, propName, componentName, '. Expected an Element `type`');

	  if (typeof props[propName] !== 'function') {
	    if (_react2['default'].isValidElement(props[propName])) {
	      return new Error(errBeginning + ', not an actual Element');
	    }

	    if (typeof props[propName] !== 'string') {
	      return new Error(errBeginning + ' such as a tag name or return value of React.createClass(...)');
	    }
	  }
	}

	exports['default'] = _common.createChainableTypeChecker(validate);
	module.exports = exports['default'];

/***/ },
/* 47 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.errMsg = errMsg;
	exports.createChainableTypeChecker = createChainableTypeChecker;

	function errMsg(props, propName, componentName, msgContinuation) {
	  return 'Invalid prop \'' + propName + '\' of value \'' + props[propName] + '\'' + (' supplied to \'' + componentName + '\'' + msgContinuation);
	}

	/**
	 * Create chain-able isRequired validator
	 *
	 * Largely copied directly from:
	 *  https://github.com/facebook/react/blob/0.11-stable/src/core/ReactPropTypes.js#L94
	 */

	function createChainableTypeChecker(validate) {
	  function checkType(isRequired, props, propName, componentName) {
	    componentName = componentName || '<<anonymous>>';
	    if (props[propName] == null) {
	      if (isRequired) {
	        return new Error('Required prop \'' + propName + '\' was not specified in \'' + componentName + '\'.');
	      }
	    } else {
	      return validate(props, propName, componentName);
	    }
	  }

	  var chainedCheckType = checkType.bind(null, false);
	  chainedCheckType.isRequired = checkType.bind(null, true);

	  return chainedCheckType;
	}

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var canUseDOM = __webpack_require__(43);

	var contains = (function () {
	  var root = canUseDOM && document.documentElement;

	  return root && root.contains ? function (context, node) {
	    return context.contains(node);
	  } : root && root.compareDocumentPosition ? function (context, node) {
	    return context === node || !!(context.compareDocumentPosition(node) & 16);
	  } : function (context, node) {
	    if (node) do {
	      if (node === context) return true;
	    } while (node = node.parentNode);

	    return false;
	  };
	})();

	module.exports = contains;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var babelHelpers = __webpack_require__(41);

	exports.__esModule = true;

	/**
	 * document.activeElement
	 */
	exports['default'] = activeElement;

	var _ownerDocument = __webpack_require__(39);

	var _ownerDocument2 = babelHelpers.interopRequireDefault(_ownerDocument);

	function activeElement() {
	  var doc = arguments[0] === undefined ? document : arguments[0];

	  try {
	    return doc.activeElement;
	  } catch (e) {}
	}

	module.exports = exports['default'];

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _reactPropTypesLibMountable = __webpack_require__(51);

	var _reactPropTypesLibMountable2 = _interopRequireDefault(_reactPropTypesLibMountable);

	var _utilsOwnerDocument = __webpack_require__(53);

	var _utilsOwnerDocument2 = _interopRequireDefault(_utilsOwnerDocument);

	var _utilsGetContainer = __webpack_require__(54);

	var _utilsGetContainer2 = _interopRequireDefault(_utilsGetContainer);

	/**
	 * The `<Portal/>` component renders its children into a new "subtree" outside of current component hierarchy.
	 * You can think of it as a declarative `appendChild()`, or jQuery's `$.fn.appendTo()`.
	 * The children of `<Portal/>` component will be appended to the `container` specified.
	 */
	var Portal = _react2['default'].createClass({

	  displayName: 'Portal',

	  propTypes: {
	    /**
	     * A Node, Component instance, or function that returns either. The `container` will have the Portal children
	     * appended to it.
	     */
	    container: _react2['default'].PropTypes.oneOfType([_reactPropTypesLibMountable2['default'], _react2['default'].PropTypes.func])
	  },

	  componentDidMount: function componentDidMount() {
	    this._renderOverlay();
	  },

	  componentDidUpdate: function componentDidUpdate() {
	    this._renderOverlay();
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    this._unrenderOverlay();
	    this._unmountOverlayTarget();
	  },

	  _mountOverlayTarget: function _mountOverlayTarget() {
	    if (!this._overlayTarget) {
	      this._overlayTarget = document.createElement('div');
	      this.getContainerDOMNode().appendChild(this._overlayTarget);
	    }
	  },

	  _unmountOverlayTarget: function _unmountOverlayTarget() {
	    if (this._overlayTarget) {
	      this.getContainerDOMNode().removeChild(this._overlayTarget);
	      this._overlayTarget = null;
	    }
	  },

	  _renderOverlay: function _renderOverlay() {

	    var overlay = !this.props.children ? null : _react2['default'].Children.only(this.props.children);

	    // Save reference for future access.
	    if (overlay !== null) {
	      this._mountOverlayTarget();
	      this._overlayInstance = _reactDom2['default'].unstable_renderSubtreeIntoContainer(this, overlay, this._overlayTarget);
	    } else {
	      // Unrender if the component is null for transitions to null
	      this._unrenderOverlay();
	      this._unmountOverlayTarget();
	    }
	  },

	  _unrenderOverlay: function _unrenderOverlay() {
	    if (this._overlayTarget) {
	      _reactDom2['default'].unmountComponentAtNode(this._overlayTarget);
	      this._overlayInstance = null;
	    }
	  },

	  render: function render() {
	    return null;
	  },

	  getMountNode: function getMountNode() {
	    return this._overlayTarget;
	  },

	  getOverlayDOMNode: function getOverlayDOMNode() {
	    if (!this.isMounted()) {
	      throw new Error('getOverlayDOMNode(): A component must be mounted to have a DOM node.');
	    }

	    if (this._overlayInstance) {
	      if (this._overlayInstance.getWrappedDOMNode) {
	        return this._overlayInstance.getWrappedDOMNode();
	      } else {
	        return _reactDom2['default'].findDOMNode(this._overlayInstance);
	      }
	    }

	    return null;
	  },

	  getContainerDOMNode: function getContainerDOMNode() {
	    return _utilsGetContainer2['default'](this.props.container, _utilsOwnerDocument2['default'](this).body);
	  }
	});

	exports['default'] = Portal;
	module.exports = exports['default'];

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _common = __webpack_require__(52);

	/**
	 * Checks whether a prop provides a DOM element
	 *
	 * The element can be provided in two forms:
	 * - Directly passed
	 * - Or passed an object that has a `render` method
	 *
	 * @param props
	 * @param propName
	 * @param componentName
	 * @returns {Error|undefined}
	 */

	function validate(props, propName, componentName) {
	  if (typeof props[propName] !== 'object' || typeof props[propName].render !== 'function' && props[propName].nodeType !== 1) {
	    return new Error(_common.errMsg(props, propName, componentName, ', expected a DOM element or an object that has a `render` method'));
	  }
	}

	exports['default'] = _common.createChainableTypeChecker(validate);
	module.exports = exports['default'];

/***/ },
/* 52 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.errMsg = errMsg;
	exports.createChainableTypeChecker = createChainableTypeChecker;

	function errMsg(props, propName, componentName, msgContinuation) {
	  return 'Invalid prop \'' + propName + '\' of value \'' + props[propName] + '\'' + (' supplied to \'' + componentName + '\'' + msgContinuation);
	}

	/**
	 * Create chain-able isRequired validator
	 *
	 * Largely copied directly from:
	 *  https://github.com/facebook/react/blob/0.11-stable/src/core/ReactPropTypes.js#L94
	 */

	function createChainableTypeChecker(validate) {
	  function checkType(isRequired, props, propName, componentName) {
	    componentName = componentName || '<<anonymous>>';
	    if (props[propName] == null) {
	      if (isRequired) {
	        return new Error('Required prop \'' + propName + '\' was not specified in \'' + componentName + '\'.');
	      }
	    } else {
	      return validate(props, propName, componentName);
	    }
	  }

	  var chainedCheckType = checkType.bind(null, false);
	  chainedCheckType.isRequired = checkType.bind(null, true);

	  return chainedCheckType;
	}

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _domHelpersOwnerDocument = __webpack_require__(39);

	var _domHelpersOwnerDocument2 = _interopRequireDefault(_domHelpersOwnerDocument);

	exports['default'] = function (componentOrElement) {
	  return _domHelpersOwnerDocument2['default'](_reactDom2['default'].findDOMNode(componentOrElement));
	};

	module.exports = exports['default'];

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = getContainer;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	function getContainer(container, defaultContainer) {
	  container = typeof container === 'function' ? container() : container;
	  return _reactDom2['default'].findDOMNode(container) || defaultContainer;
	}

	module.exports = exports['default'];

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inherits = __webpack_require__(56)['default'];

	var _classCallCheck = __webpack_require__(66)['default'];

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactOverlaysLibTransition = __webpack_require__(67);

	var _reactOverlaysLibTransition2 = _interopRequireDefault(_reactOverlaysLibTransition);

	var _reactPropTypesLibDeprecated = __webpack_require__(70);

	var _reactPropTypesLibDeprecated2 = _interopRequireDefault(_reactPropTypesLibDeprecated);

	var Fade = (function (_React$Component) {
	  _inherits(Fade, _React$Component);

	  function Fade() {
	    _classCallCheck(this, Fade);

	    _React$Component.apply(this, arguments);
	  }

	  // Explicitly copied from Transition for doc generation.
	  // TODO: Remove duplication once #977 is resolved.

	  Fade.prototype.render = function render() {
	    var timeout = this.props.timeout || this.props.duration;

	    return _react2['default'].createElement(
	      _reactOverlaysLibTransition2['default'],
	      _extends({}, this.props, {
	        timeout: timeout,
	        className: 'fade',
	        enteredClassName: 'in',
	        enteringClassName: 'in'
	      }),
	      this.props.children
	    );
	  };

	  return Fade;
	})(_react2['default'].Component);

	Fade.propTypes = {
	  /**
	   * Show the component; triggers the fade in or fade out animation
	   */
	  'in': _react2['default'].PropTypes.bool,

	  /**
	   * Unmount the component (remove it from the DOM) when it is faded out
	   */
	  unmountOnExit: _react2['default'].PropTypes.bool,

	  /**
	   * Run the fade in animation when the component mounts, if it is initially
	   * shown
	   */
	  transitionAppear: _react2['default'].PropTypes.bool,

	  /**
	   * Duration of the fade animation in milliseconds, to ensure that finishing
	   * callbacks are fired even if the original browser transition end events are
	   * canceled
	   */
	  timeout: _react2['default'].PropTypes.number,

	  /**
	   * duration
	   * @private
	   */
	  duration: _reactPropTypesLibDeprecated2['default'](_react2['default'].PropTypes.number, 'Use `timeout`.'),

	  /**
	   * Callback fired before the component fades in
	   */
	  onEnter: _react2['default'].PropTypes.func,
	  /**
	   * Callback fired after the component starts to fade in
	   */
	  onEntering: _react2['default'].PropTypes.func,
	  /**
	   * Callback fired after the has component faded in
	   */
	  onEntered: _react2['default'].PropTypes.func,
	  /**
	   * Callback fired before the component fades out
	   */
	  onExit: _react2['default'].PropTypes.func,
	  /**
	   * Callback fired after the component starts to fade out
	   */
	  onExiting: _react2['default'].PropTypes.func,
	  /**
	   * Callback fired after the component has faded out
	   */
	  onExited: _react2['default'].PropTypes.func
	};

	Fade.defaultProps = {
	  'in': false,
	  timeout: 300,
	  unmountOnExit: false,
	  transitionAppear: false
	};

	exports['default'] = Fade;
	module.exports = exports['default'];

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$create = __webpack_require__(57)["default"];

	var _Object$setPrototypeOf = __webpack_require__(59)["default"];

	exports["default"] = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = _Object$create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	exports.__esModule = true;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(58), __esModule: true };

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(21);
	module.exports = function create(P, D){
	  return $.create(P, D);
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(60), __esModule: true };

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(61);
	module.exports = __webpack_require__(19).Object.setPrototypeOf;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $def = __webpack_require__(17);
	$def($def.S, 'Object', {setPrototypeOf: __webpack_require__(62).set});

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var getDesc  = __webpack_require__(21).getDesc
	  , isObject = __webpack_require__(31)
	  , anObject = __webpack_require__(63);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(64)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(31);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(65);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 66 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	exports.__esModule = true;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _domHelpersTransitionProperties = __webpack_require__(68);

	var _domHelpersTransitionProperties2 = _interopRequireDefault(_domHelpersTransitionProperties);

	var _domHelpersEventsOn = __webpack_require__(69);

	var _domHelpersEventsOn2 = _interopRequireDefault(_domHelpersEventsOn);

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var transitionEndEvent = _domHelpersTransitionProperties2['default'].end;

	var UNMOUNTED = 0;
	exports.UNMOUNTED = UNMOUNTED;
	var EXITED = 1;
	exports.EXITED = EXITED;
	var ENTERING = 2;
	exports.ENTERING = ENTERING;
	var ENTERED = 3;
	exports.ENTERED = ENTERED;
	var EXITING = 4;

	exports.EXITING = EXITING;
	/**
	 * The Transition component lets you define and run css transitions with a simple declarative api.
	 * It works similar to React's own [CSSTransitionGroup](http://facebook.github.io/react/docs/animation.html#high-level-api-reactcsstransitiongroup)
	 * but is specifically optimized for transitioning a single child "in" or "out".
	 *
	 * You don't even need to use class based css transitions if you don't want to (but it is easiest).
	 * The extensive set of lifecyle callbacks means you have control over
	 * the transitioning now at each step of the way.
	 */

	var Transition = (function (_React$Component) {
	  function Transition(props, context) {
	    _classCallCheck(this, Transition);

	    _React$Component.call(this, props, context);

	    var initialStatus = undefined;
	    if (props['in']) {
	      // Start enter transition in componentDidMount.
	      initialStatus = props.transitionAppear ? EXITED : ENTERED;
	    } else {
	      initialStatus = props.unmountOnExit ? UNMOUNTED : EXITED;
	    }
	    this.state = { status: initialStatus };

	    this.nextCallback = null;
	  }

	  _inherits(Transition, _React$Component);

	  Transition.prototype.componentDidMount = function componentDidMount() {
	    if (this.props.transitionAppear && this.props['in']) {
	      this.performEnter(this.props);
	    }
	  };

	  Transition.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	    var status = this.state.status;
	    if (nextProps['in']) {
	      if (status === EXITING) {
	        this.performEnter(nextProps);
	      } else if (this.props.unmountOnExit) {
	        if (status === UNMOUNTED) {
	          // Start enter transition in componentDidUpdate.
	          this.setState({ status: EXITED });
	        }
	      } else if (status === EXITED) {
	        this.performEnter(nextProps);
	      }

	      // Otherwise we're already entering or entered.
	    } else {
	      if (status === ENTERING || status === ENTERED) {
	        this.performExit(nextProps);
	      }

	      // Otherwise we're already exited or exiting.
	    }
	  };

	  Transition.prototype.componentDidUpdate = function componentDidUpdate() {
	    if (this.props.unmountOnExit && this.state.status === EXITED) {
	      // EXITED is always a transitional state to either ENTERING or UNMOUNTED
	      // when using unmountOnExit.
	      if (this.props['in']) {
	        this.performEnter(this.props);
	      } else {
	        this.setState({ status: UNMOUNTED });
	      }
	    }
	  };

	  Transition.prototype.componentWillUnmount = function componentWillUnmount() {
	    this.cancelNextCallback();
	  };

	  Transition.prototype.performEnter = function performEnter(props) {
	    var _this = this;

	    this.cancelNextCallback();
	    var node = _reactDom2['default'].findDOMNode(this);

	    // Not this.props, because we might be about to receive new props.
	    props.onEnter(node);

	    this.safeSetState({ status: ENTERING }, function () {
	      _this.props.onEntering(node);

	      _this.onTransitionEnd(node, function () {
	        _this.safeSetState({ status: ENTERED }, function () {
	          _this.props.onEntered(node);
	        });
	      });
	    });
	  };

	  Transition.prototype.performExit = function performExit(props) {
	    var _this2 = this;

	    this.cancelNextCallback();
	    var node = _reactDom2['default'].findDOMNode(this);

	    // Not this.props, because we might be about to receive new props.
	    props.onExit(node);

	    this.safeSetState({ status: EXITING }, function () {
	      _this2.props.onExiting(node);

	      _this2.onTransitionEnd(node, function () {
	        _this2.safeSetState({ status: EXITED }, function () {
	          _this2.props.onExited(node);
	        });
	      });
	    });
	  };

	  Transition.prototype.cancelNextCallback = function cancelNextCallback() {
	    if (this.nextCallback !== null) {
	      this.nextCallback.cancel();
	      this.nextCallback = null;
	    }
	  };

	  Transition.prototype.safeSetState = function safeSetState(nextState, callback) {
	    // This shouldn't be necessary, but there are weird race conditions with
	    // setState callbacks and unmounting in testing, so always make sure that
	    // we can cancel any pending setState callbacks after we unmount.
	    this.setState(nextState, this.setNextCallback(callback));
	  };

	  Transition.prototype.setNextCallback = function setNextCallback(callback) {
	    var _this3 = this;

	    var active = true;

	    this.nextCallback = function (event) {
	      if (active) {
	        active = false;
	        _this3.nextCallback = null;

	        callback(event);
	      }
	    };

	    this.nextCallback.cancel = function () {
	      active = false;
	    };

	    return this.nextCallback;
	  };

	  Transition.prototype.onTransitionEnd = function onTransitionEnd(node, handler) {
	    this.setNextCallback(handler);

	    if (node) {
	      _domHelpersEventsOn2['default'](node, transitionEndEvent, this.nextCallback);
	      setTimeout(this.nextCallback, this.props.timeout);
	    } else {
	      setTimeout(this.nextCallback, 0);
	    }
	  };

	  Transition.prototype.render = function render() {
	    var status = this.state.status;
	    if (status === UNMOUNTED) {
	      return null;
	    }

	    var _props = this.props;
	    var children = _props.children;
	    var className = _props.className;

	    var childProps = _objectWithoutProperties(_props, ['children', 'className']);

	    Object.keys(Transition.propTypes).forEach(function (key) {
	      return delete childProps[key];
	    });

	    var transitionClassName = undefined;
	    if (status === EXITED) {
	      transitionClassName = this.props.exitedClassName;
	    } else if (status === ENTERING) {
	      transitionClassName = this.props.enteringClassName;
	    } else if (status === ENTERED) {
	      transitionClassName = this.props.enteredClassName;
	    } else if (status === EXITING) {
	      transitionClassName = this.props.exitingClassName;
	    }

	    var child = _react2['default'].Children.only(children);
	    return _react2['default'].cloneElement(child, _extends({}, childProps, {
	      className: _classnames2['default'](child.props.className, className, transitionClassName)
	    }));
	  };

	  return Transition;
	})(_react2['default'].Component);

	Transition.propTypes = {
	  /**
	   * Show the component; triggers the enter or exit animation
	   */
	  'in': _react2['default'].PropTypes.bool,

	  /**
	   * Unmount the component (remove it from the DOM) when it is not shown
	   */
	  unmountOnExit: _react2['default'].PropTypes.bool,

	  /**
	   * Run the enter animation when the component mounts, if it is initially
	   * shown
	   */
	  transitionAppear: _react2['default'].PropTypes.bool,

	  /**
	   * A Timeout for the animation, in milliseconds, to ensure that a node doesn't
	   * transition indefinately if the browser transitionEnd events are
	   * canceled or interrupted.
	   *
	   * By default this is set to a high number (5 seconds) as a failsafe. You should consider
	   * setting this to the duration of your animation (or a bit above it).
	   */
	  timeout: _react2['default'].PropTypes.number,

	  /**
	   * CSS class or classes applied when the component is exited
	   */
	  exitedClassName: _react2['default'].PropTypes.string,
	  /**
	   * CSS class or classes applied while the component is exiting
	   */
	  exitingClassName: _react2['default'].PropTypes.string,
	  /**
	   * CSS class or classes applied when the component is entered
	   */
	  enteredClassName: _react2['default'].PropTypes.string,
	  /**
	   * CSS class or classes applied while the component is entering
	   */
	  enteringClassName: _react2['default'].PropTypes.string,

	  /**
	   * Callback fired before the "entering" classes are applied
	   */
	  onEnter: _react2['default'].PropTypes.func,
	  /**
	   * Callback fired after the "entering" classes are applied
	   */
	  onEntering: _react2['default'].PropTypes.func,
	  /**
	   * Callback fired after the "enter" classes are applied
	   */
	  onEntered: _react2['default'].PropTypes.func,
	  /**
	   * Callback fired before the "exiting" classes are applied
	   */
	  onExit: _react2['default'].PropTypes.func,
	  /**
	   * Callback fired after the "exiting" classes are applied
	   */
	  onExiting: _react2['default'].PropTypes.func,
	  /**
	   * Callback fired after the "exited" classes are applied
	   */
	  onExited: _react2['default'].PropTypes.func
	};

	// Name the function so it is clearer in the documentation
	function noop() {}

	Transition.displayName = 'Transition';

	Transition.defaultProps = {
	  'in': false,
	  unmountOnExit: false,
	  transitionAppear: false,

	  timeout: 5000,

	  onEnter: noop,
	  onEntering: noop,
	  onEntered: noop,

	  onExit: noop,
	  onExiting: noop,
	  onExited: noop
	};

	exports['default'] = Transition;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var canUseDOM = __webpack_require__(43);

	var has = Object.prototype.hasOwnProperty,
	    transform = 'transform',
	    transition = {},
	    transitionTiming,
	    transitionDuration,
	    transitionProperty,
	    transitionDelay;

	if (canUseDOM) {
	  transition = getTransitionProperties();

	  transform = transition.prefix + transform;

	  transitionProperty = transition.prefix + 'transition-property';
	  transitionDuration = transition.prefix + 'transition-duration';
	  transitionDelay = transition.prefix + 'transition-delay';
	  transitionTiming = transition.prefix + 'transition-timing-function';
	}

	module.exports = {
	  transform: transform,
	  end: transition.end,
	  property: transitionProperty,
	  timing: transitionTiming,
	  delay: transitionDelay,
	  duration: transitionDuration
	};

	function getTransitionProperties() {
	  var endEvent,
	      prefix = '',
	      transitions = {
	    O: 'otransitionend',
	    Moz: 'transitionend',
	    Webkit: 'webkitTransitionEnd',
	    ms: 'MSTransitionEnd'
	  };

	  var element = document.createElement('div');

	  for (var vendor in transitions) if (has.call(transitions, vendor)) {
	    if (element.style[vendor + 'TransitionProperty'] !== undefined) {
	      prefix = '-' + vendor.toLowerCase() + '-';
	      endEvent = transitions[vendor];
	      break;
	    }
	  }

	  if (!endEvent && element.style.transitionProperty !== undefined) endEvent = 'transitionend';

	  return { end: endEvent, prefix: prefix };
	}

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var canUseDOM = __webpack_require__(43);
	var on = function on() {};

	if (canUseDOM) {
	  on = (function () {

	    if (document.addEventListener) return function (node, eventName, handler, capture) {
	      return node.addEventListener(eventName, handler, capture || false);
	    };else if (document.attachEvent) return function (node, eventName, handler) {
	      return node.attachEvent('on' + eventName, handler);
	    };
	  })();
	}

	module.exports = on;

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = deprecated;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _warning = __webpack_require__(71);

	var _warning2 = _interopRequireDefault(_warning);

	function deprecated(propType, explanation) {
	  return function validate(props, propName, componentName) {
	    if (props[propName] != null) {
	      _warning2['default'](false, '"' + propName + '" property of "' + componentName + '" has been deprecated.\n' + explanation);
	    }

	    return propType(props, propName, componentName);
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = function() {};

	if (process.env.NODE_ENV !== 'production') {
	  warning = function(condition, format, args) {
	    var len = arguments.length;
	    args = new Array(len > 2 ? len - 2 : 0);
	    for (var key = 2; key < len; key++) {
	      args[key - 2] = arguments[key];
	    }
	    if (format === undefined) {
	      throw new Error(
	        '`warning(condition, format, ...args)` requires a warning ' +
	        'message argument'
	      );
	    }

	    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
	      throw new Error(
	        'The warning format should be able to uniquely identify this ' +
	        'warning. Please, use a more descriptive format than: ' + format
	      );
	    }

	    if (!condition) {
	      var argIndex = 0;
	      var message = 'Warning: ' +
	        format.replace(/%s/g, function() {
	          return args[argIndex++];
	        });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch(x) {}
	    }
	  };
	}

	module.exports = warning;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(72)))

/***/ },
/* 72 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-disable react/prop-types */
	'use strict';

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _BootstrapMixin = __webpack_require__(74);

	var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

	var ModalDialog = _react2['default'].createClass({
	  displayName: 'ModalDialog',

	  mixins: [_BootstrapMixin2['default']],

	  propTypes: {
	    /**
	     * A Callback fired when the header closeButton or non-static backdrop is clicked.
	     * @type {function}
	     * @required
	     */
	    onHide: _react2['default'].PropTypes.func.isRequired,

	    /**
	     * A css class to apply to the Modal dialog DOM node.
	     */
	    dialogClassName: _react2['default'].PropTypes.string

	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      bsClass: 'modal',
	      closeButton: true
	    };
	  },

	  render: function render() {
	    var modalStyle = _extends({
	      display: 'block'
	    }, this.props.style);
	    var bsClass = this.props.bsClass;
	    var dialogClasses = this.getBsClassSet();

	    delete dialogClasses.modal;
	    dialogClasses[bsClass + '-dialog'] = true;

	    return _react2['default'].createElement(
	      'div',
	      _extends({}, this.props, {
	        title: null,
	        tabIndex: '-1',
	        role: 'dialog',
	        style: modalStyle,
	        className: _classnames2['default'](this.props.className, bsClass) }),
	      _react2['default'].createElement(
	        'div',
	        { className: _classnames2['default'](this.props.dialogClassName, dialogClasses) },
	        _react2['default'].createElement(
	          'div',
	          { className: bsClass + '-content', role: 'document' },
	          this.props.children
	        )
	      )
	    );
	  }
	});

	exports['default'] = ModalDialog;
	module.exports = exports['default'];

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _styleMaps = __webpack_require__(75);

	var _styleMaps2 = _interopRequireDefault(_styleMaps);

	var _reactPropTypesLibKeyOf = __webpack_require__(76);

	var _reactPropTypesLibKeyOf2 = _interopRequireDefault(_reactPropTypesLibKeyOf);

	var BootstrapMixin = {
	  propTypes: {
	    /**
	     * bootstrap className
	     * @private
	     */
	    bsClass: _reactPropTypesLibKeyOf2['default'](_styleMaps2['default'].CLASSES),
	    /**
	     * Style variants
	     * @type {("default"|"primary"|"success"|"info"|"warning"|"danger"|"link")}
	     */
	    bsStyle: _react2['default'].PropTypes.oneOf(_styleMaps2['default'].STYLES),
	    /**
	     * Size variants
	     * @type {("xsmall"|"small"|"medium"|"large"|"xs"|"sm"|"md"|"lg")}
	     */
	    bsSize: _reactPropTypesLibKeyOf2['default'](_styleMaps2['default'].SIZES)
	  },

	  getBsClassSet: function getBsClassSet() {
	    var classes = {};

	    var bsClass = this.props.bsClass && _styleMaps2['default'].CLASSES[this.props.bsClass];
	    if (bsClass) {
	      classes[bsClass] = true;

	      var prefix = bsClass + '-';

	      var bsSize = this.props.bsSize && _styleMaps2['default'].SIZES[this.props.bsSize];
	      if (bsSize) {
	        classes[prefix + bsSize] = true;
	      }

	      if (this.props.bsStyle) {
	        if (_styleMaps2['default'].STYLES.indexOf(this.props.bsStyle) >= 0) {
	          classes[prefix + this.props.bsStyle] = true;
	        } else {
	          classes[this.props.bsStyle] = true;
	        }
	      }
	    }

	    return classes;
	  },

	  prefixClass: function prefixClass(subClass) {
	    return _styleMaps2['default'].CLASSES[this.props.bsClass] + '-' + subClass;
	  }
	};

	exports['default'] = BootstrapMixin;
	module.exports = exports['default'];

/***/ },
/* 75 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	var styleMaps = {
	  CLASSES: {
	    'alert': 'alert',
	    'button': 'btn',
	    'button-group': 'btn-group',
	    'button-toolbar': 'btn-toolbar',
	    'column': 'col',
	    'input-group': 'input-group',
	    'form': 'form',
	    'glyphicon': 'glyphicon',
	    'label': 'label',
	    'thumbnail': 'thumbnail',
	    'list-group-item': 'list-group-item',
	    'panel': 'panel',
	    'panel-group': 'panel-group',
	    'pagination': 'pagination',
	    'progress-bar': 'progress-bar',
	    'nav': 'nav',
	    'navbar': 'navbar',
	    'modal': 'modal',
	    'row': 'row',
	    'well': 'well'
	  },
	  STYLES: ['default', 'primary', 'success', 'info', 'warning', 'danger', 'link', 'inline', 'tabs', 'pills'],
	  addStyle: function addStyle(name) {
	    styleMaps.STYLES.push(name);
	  },
	  SIZES: {
	    'large': 'lg',
	    'medium': 'md',
	    'small': 'sm',
	    'xsmall': 'xs',
	    'lg': 'lg',
	    'md': 'md',
	    'sm': 'sm',
	    'xs': 'xs'
	  },
	  GRID_COLUMNS: 12
	};

	exports['default'] = styleMaps;
	module.exports = exports['default'];

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = keyOf;

	var _common = __webpack_require__(47);

	/**
	 * Checks whether a prop matches a key of an associated object
	 *
	 * @param props
	 * @param propName
	 * @param componentName
	 * @returns {Error|undefined}
	 */

	function keyOf(obj) {
	  function validate(props, propName, componentName) {
	    var propValue = props[propName];
	    if (!obj.hasOwnProperty(propValue)) {
	      var valuesString = JSON.stringify(Object.keys(obj));
	      return new Error(_common.errMsg(props, propName, componentName, ', expected one of ' + valuesString + '.'));
	    }
	  }
	  return _common.createChainableTypeChecker(validate);
	}

	module.exports = exports['default'];

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inherits = __webpack_require__(56)['default'];

	var _classCallCheck = __webpack_require__(66)['default'];

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var ModalBody = (function (_React$Component) {
	  _inherits(ModalBody, _React$Component);

	  function ModalBody() {
	    _classCallCheck(this, ModalBody);

	    _React$Component.apply(this, arguments);
	  }

	  ModalBody.prototype.render = function render() {
	    return _react2['default'].createElement(
	      'div',
	      _extends({}, this.props, {
	        className: _classnames2['default'](this.props.className, this.props.modalClassName) }),
	      this.props.children
	    );
	  };

	  return ModalBody;
	})(_react2['default'].Component);

	ModalBody.propTypes = {
	  /**
	   * A css class applied to the Component
	   */
	  modalClassName: _react2['default'].PropTypes.string
	};

	ModalBody.defaultProps = {
	  modalClassName: 'modal-body'
	};

	exports['default'] = ModalBody;
	module.exports = exports['default'];

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inherits = __webpack_require__(56)['default'];

	var _classCallCheck = __webpack_require__(66)['default'];

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var ModalHeader = (function (_React$Component) {
	  _inherits(ModalHeader, _React$Component);

	  function ModalHeader() {
	    _classCallCheck(this, ModalHeader);

	    _React$Component.apply(this, arguments);
	  }

	  // used in liue of parent contexts right now to auto wire the close button

	  ModalHeader.prototype.render = function render() {
	    return _react2['default'].createElement(
	      'div',
	      _extends({}, this.props, {
	        className: _classnames2['default'](this.props.className, this.props.modalClassName) }),
	      this.props.closeButton && _react2['default'].createElement(
	        'button',
	        {
	          className: 'close',
	          onClick: this.props.onHide },
	        _react2['default'].createElement(
	          'span',
	          { 'aria-hidden': 'true' },
	          '×'
	        )
	      ),
	      this.props.children
	    );
	  };

	  return ModalHeader;
	})(_react2['default'].Component);

	ModalHeader.__isModalHeader = true;

	ModalHeader.propTypes = {
	  /**
	   * The 'aria-label' attribute is used to define a string that labels the current element.
	   * It is used for Assistive Technology when the label text is not visible on screen.
	   */
	  'aria-label': _react2['default'].PropTypes.string,

	  /**
	   * A css class applied to the Component
	   */
	  modalClassName: _react2['default'].PropTypes.string,

	  /**
	   * Specify whether the Component should contain a close button
	   */
	  closeButton: _react2['default'].PropTypes.bool,

	  /**
	   * A Callback fired when the close button is clicked. If used directly inside a Modal component, the onHide will automatically
	   * be propagated up to the parent Modal `onHide`.
	   */
	  onHide: _react2['default'].PropTypes.func
	};

	ModalHeader.defaultProps = {
	  'aria-label': 'Close',
	  modalClassName: 'modal-header',
	  closeButton: false
	};

	exports['default'] = ModalHeader;
	module.exports = exports['default'];

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inherits = __webpack_require__(56)['default'];

	var _classCallCheck = __webpack_require__(66)['default'];

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var ModalTitle = (function (_React$Component) {
	  _inherits(ModalTitle, _React$Component);

	  function ModalTitle() {
	    _classCallCheck(this, ModalTitle);

	    _React$Component.apply(this, arguments);
	  }

	  ModalTitle.prototype.render = function render() {
	    return _react2['default'].createElement(
	      'h4',
	      _extends({}, this.props, {
	        className: _classnames2['default'](this.props.className, this.props.modalClassName) }),
	      this.props.children
	    );
	  };

	  return ModalTitle;
	})(_react2['default'].Component);

	ModalTitle.propTypes = {
	  /**
	   * A css class applied to the Component
	   */
	  modalClassName: _react2['default'].PropTypes.string
	};

	ModalTitle.defaultProps = {
	  modalClassName: 'modal-title'
	};

	exports['default'] = ModalTitle;
	module.exports = exports['default'];

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inherits = __webpack_require__(56)['default'];

	var _classCallCheck = __webpack_require__(66)['default'];

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var ModalFooter = (function (_React$Component) {
	  _inherits(ModalFooter, _React$Component);

	  function ModalFooter() {
	    _classCallCheck(this, ModalFooter);

	    _React$Component.apply(this, arguments);
	  }

	  ModalFooter.prototype.render = function render() {
	    return _react2['default'].createElement(
	      'div',
	      _extends({}, this.props, {
	        className: _classnames2['default'](this.props.className, this.props.modalClassName) }),
	      this.props.children
	    );
	  };

	  return ModalFooter;
	})(_react2['default'].Component);

	ModalFooter.propTypes = {
	  /**
	   * A css class applied to the Component
	   */
	  modalClassName: _react2['default'].PropTypes.string
	};

	ModalFooter.defaultProps = {
	  modalClassName: 'modal-footer'
	};

	exports['default'] = ModalFooter;
	module.exports = exports['default'];

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _BootstrapMixin = __webpack_require__(74);

	var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

	var _reactPropTypesLibElementType = __webpack_require__(46);

	var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

	var _ButtonInput = __webpack_require__(82);

	var _ButtonInput2 = _interopRequireDefault(_ButtonInput);

	var Button = _react2['default'].createClass({
	  displayName: 'Button',

	  mixins: [_BootstrapMixin2['default']],

	  propTypes: {
	    active: _react2['default'].PropTypes.bool,
	    disabled: _react2['default'].PropTypes.bool,
	    block: _react2['default'].PropTypes.bool,
	    navItem: _react2['default'].PropTypes.bool,
	    navDropdown: _react2['default'].PropTypes.bool,
	    /**
	     * You can use a custom element for this component
	     */
	    componentClass: _reactPropTypesLibElementType2['default'],
	    href: _react2['default'].PropTypes.string,
	    target: _react2['default'].PropTypes.string,
	    /**
	     * Defines HTML button type Attribute
	     * @type {("button"|"reset"|"submit")}
	     * @defaultValue 'button'
	     */
	    type: _react2['default'].PropTypes.oneOf(_ButtonInput2['default'].types)
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      active: false,
	      block: false,
	      bsClass: 'button',
	      bsStyle: 'default',
	      disabled: false,
	      navItem: false,
	      navDropdown: false
	    };
	  },

	  render: function render() {
	    var classes = this.props.navDropdown ? {} : this.getBsClassSet();
	    var renderFuncName = undefined;

	    classes = _extends({
	      active: this.props.active,
	      'btn-block': this.props.block
	    }, classes);

	    if (this.props.navItem) {
	      return this.renderNavItem(classes);
	    }

	    renderFuncName = this.props.href || this.props.target || this.props.navDropdown ? 'renderAnchor' : 'renderButton';

	    return this[renderFuncName](classes);
	  },

	  renderAnchor: function renderAnchor(classes) {
	    var Component = this.props.componentClass || 'a';
	    var href = this.props.href || '#';
	    classes.disabled = this.props.disabled;

	    return _react2['default'].createElement(
	      Component,
	      _extends({}, this.props, {
	        href: href,
	        className: _classnames2['default'](this.props.className, classes),
	        role: 'button' }),
	      this.props.children
	    );
	  },

	  renderButton: function renderButton(classes) {
	    var Component = this.props.componentClass || 'button';

	    return _react2['default'].createElement(
	      Component,
	      _extends({}, this.props, {
	        type: this.props.type || 'button',
	        className: _classnames2['default'](this.props.className, classes) }),
	      this.props.children
	    );
	  },

	  renderNavItem: function renderNavItem(classes) {
	    var liClasses = {
	      active: this.props.active
	    };

	    return _react2['default'].createElement(
	      'li',
	      { className: _classnames2['default'](liClasses) },
	      this.renderAnchor(classes)
	    );
	  }
	});

	exports['default'] = Button;
	module.exports = exports['default'];

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inherits = __webpack_require__(56)['default'];

	var _classCallCheck = __webpack_require__(66)['default'];

	var _objectWithoutProperties = __webpack_require__(27)['default'];

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Button = __webpack_require__(81);

	var _Button2 = _interopRequireDefault(_Button);

	var _FormGroup = __webpack_require__(83);

	var _FormGroup2 = _interopRequireDefault(_FormGroup);

	var _InputBase2 = __webpack_require__(84);

	var _InputBase3 = _interopRequireDefault(_InputBase2);

	var _utilsChildrenValueInputValidation = __webpack_require__(86);

	var _utilsChildrenValueInputValidation2 = _interopRequireDefault(_utilsChildrenValueInputValidation);

	var ButtonInput = (function (_InputBase) {
	  _inherits(ButtonInput, _InputBase);

	  function ButtonInput() {
	    _classCallCheck(this, ButtonInput);

	    _InputBase.apply(this, arguments);
	  }

	  ButtonInput.prototype.renderFormGroup = function renderFormGroup(children) {
	    var _props = this.props;
	    var bsStyle = _props.bsStyle;
	    var value = _props.value;

	    var other = _objectWithoutProperties(_props, ['bsStyle', 'value']);

	    return _react2['default'].createElement(
	      _FormGroup2['default'],
	      other,
	      children
	    );
	  };

	  ButtonInput.prototype.renderInput = function renderInput() {
	    var _props2 = this.props;
	    var children = _props2.children;
	    var value = _props2.value;

	    var other = _objectWithoutProperties(_props2, ['children', 'value']);

	    var val = children ? children : value;
	    return _react2['default'].createElement(_Button2['default'], _extends({}, other, { componentClass: 'input', ref: 'input', key: 'input', value: val }));
	  };

	  return ButtonInput;
	})(_InputBase3['default']);

	ButtonInput.types = ['button', 'reset', 'submit'];

	ButtonInput.defaultProps = {
	  type: 'button'
	};

	ButtonInput.propTypes = {
	  type: _react2['default'].PropTypes.oneOf(ButtonInput.types),
	  bsStyle: function bsStyle() {
	    // defer to Button propTypes of bsStyle
	    return null;
	  },
	  children: _utilsChildrenValueInputValidation2['default'],
	  value: _utilsChildrenValueInputValidation2['default']
	};

	exports['default'] = ButtonInput;
	module.exports = exports['default'];

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inherits = __webpack_require__(56)['default'];

	var _classCallCheck = __webpack_require__(66)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var FormGroup = (function (_React$Component) {
	  _inherits(FormGroup, _React$Component);

	  function FormGroup() {
	    _classCallCheck(this, FormGroup);

	    _React$Component.apply(this, arguments);
	  }

	  FormGroup.prototype.render = function render() {
	    var classes = {
	      'form-group': !this.props.standalone,
	      'form-group-lg': !this.props.standalone && this.props.bsSize === 'large',
	      'form-group-sm': !this.props.standalone && this.props.bsSize === 'small',
	      'has-feedback': this.props.hasFeedback,
	      'has-success': this.props.bsStyle === 'success',
	      'has-warning': this.props.bsStyle === 'warning',
	      'has-error': this.props.bsStyle === 'error'
	    };

	    return _react2['default'].createElement(
	      'div',
	      { className: _classnames2['default'](classes, this.props.groupClassName) },
	      this.props.children
	    );
	  };

	  return FormGroup;
	})(_react2['default'].Component);

	FormGroup.defaultProps = {
	  hasFeedback: false,
	  standalone: false
	};

	FormGroup.propTypes = {
	  standalone: _react2['default'].PropTypes.bool,
	  hasFeedback: _react2['default'].PropTypes.bool,
	  bsSize: function bsSize(props) {
	    if (props.standalone && props.bsSize !== undefined) {
	      return new Error('bsSize will not be used when `standalone` is set.');
	    }

	    return _react2['default'].PropTypes.oneOf(['small', 'medium', 'large']).apply(null, arguments);
	  },
	  bsStyle: _react2['default'].PropTypes.oneOf(['success', 'warning', 'error']),
	  groupClassName: _react2['default'].PropTypes.string
	};

	exports['default'] = FormGroup;
	module.exports = exports['default'];

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inherits = __webpack_require__(56)['default'];

	var _classCallCheck = __webpack_require__(66)['default'];

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _FormGroup = __webpack_require__(83);

	var _FormGroup2 = _interopRequireDefault(_FormGroup);

	var _Glyphicon = __webpack_require__(85);

	var _Glyphicon2 = _interopRequireDefault(_Glyphicon);

	var InputBase = (function (_React$Component) {
	  _inherits(InputBase, _React$Component);

	  function InputBase() {
	    _classCallCheck(this, InputBase);

	    _React$Component.apply(this, arguments);
	  }

	  InputBase.prototype.getInputDOMNode = function getInputDOMNode() {
	    return this.refs.input;
	  };

	  InputBase.prototype.getValue = function getValue() {
	    if (this.props.type === 'static') {
	      return this.props.value;
	    } else if (this.props.type) {
	      if (this.props.type === 'select' && this.props.multiple) {
	        return this.getSelectedOptions();
	      }
	      return this.getInputDOMNode().value;
	    }
	    throw new Error('Cannot use getValue without specifying input type.');
	  };

	  InputBase.prototype.getChecked = function getChecked() {
	    return this.getInputDOMNode().checked;
	  };

	  InputBase.prototype.getSelectedOptions = function getSelectedOptions() {
	    var values = [];

	    Array.prototype.forEach.call(this.getInputDOMNode().getElementsByTagName('option'), function (option) {
	      if (option.selected) {
	        var value = option.getAttribute('value') || option.innerHtml;
	        values.push(value);
	      }
	    });

	    return values;
	  };

	  InputBase.prototype.isCheckboxOrRadio = function isCheckboxOrRadio() {
	    return this.props.type === 'checkbox' || this.props.type === 'radio';
	  };

	  InputBase.prototype.isFile = function isFile() {
	    return this.props.type === 'file';
	  };

	  InputBase.prototype.renderInputGroup = function renderInputGroup(children) {
	    var addonBefore = this.props.addonBefore ? _react2['default'].createElement(
	      'span',
	      { className: 'input-group-addon', key: 'addonBefore' },
	      this.props.addonBefore
	    ) : null;

	    var addonAfter = this.props.addonAfter ? _react2['default'].createElement(
	      'span',
	      { className: 'input-group-addon', key: 'addonAfter' },
	      this.props.addonAfter
	    ) : null;

	    var buttonBefore = this.props.buttonBefore ? _react2['default'].createElement(
	      'span',
	      { className: 'input-group-btn' },
	      this.props.buttonBefore
	    ) : null;

	    var buttonAfter = this.props.buttonAfter ? _react2['default'].createElement(
	      'span',
	      { className: 'input-group-btn' },
	      this.props.buttonAfter
	    ) : null;

	    var inputGroupClassName = undefined;
	    switch (this.props.bsSize) {
	      case 'small':
	        inputGroupClassName = 'input-group-sm';break;
	      case 'large':
	        inputGroupClassName = 'input-group-lg';break;
	      default:
	    }

	    return addonBefore || addonAfter || buttonBefore || buttonAfter ? _react2['default'].createElement(
	      'div',
	      { className: _classnames2['default'](inputGroupClassName, 'input-group'), key: 'input-group' },
	      addonBefore,
	      buttonBefore,
	      children,
	      addonAfter,
	      buttonAfter
	    ) : children;
	  };

	  InputBase.prototype.renderIcon = function renderIcon() {
	    if (this.props.hasFeedback) {
	      if (this.props.feedbackIcon) {
	        return _react2['default'].cloneElement(this.props.feedbackIcon, { formControlFeedback: true });
	      }

	      switch (this.props.bsStyle) {
	        case 'success':
	          return _react2['default'].createElement(_Glyphicon2['default'], { formControlFeedback: true, glyph: 'ok', key: 'icon' });
	        case 'warning':
	          return _react2['default'].createElement(_Glyphicon2['default'], { formControlFeedback: true, glyph: 'warning-sign', key: 'icon' });
	        case 'error':
	          return _react2['default'].createElement(_Glyphicon2['default'], { formControlFeedback: true, glyph: 'remove', key: 'icon' });
	        default:
	          return _react2['default'].createElement('span', { className: 'form-control-feedback', key: 'icon' });
	      }
	    } else {
	      return null;
	    }
	  };

	  InputBase.prototype.renderHelp = function renderHelp() {
	    return this.props.help ? _react2['default'].createElement(
	      'span',
	      { className: 'help-block', key: 'help' },
	      this.props.help
	    ) : null;
	  };

	  InputBase.prototype.renderCheckboxAndRadioWrapper = function renderCheckboxAndRadioWrapper(children) {
	    var classes = {
	      'checkbox': this.props.type === 'checkbox',
	      'radio': this.props.type === 'radio'
	    };

	    return _react2['default'].createElement(
	      'div',
	      { className: _classnames2['default'](classes), key: 'checkboxRadioWrapper' },
	      children
	    );
	  };

	  InputBase.prototype.renderWrapper = function renderWrapper(children) {
	    return this.props.wrapperClassName ? _react2['default'].createElement(
	      'div',
	      { className: this.props.wrapperClassName, key: 'wrapper' },
	      children
	    ) : children;
	  };

	  InputBase.prototype.renderLabel = function renderLabel(children) {
	    var classes = {
	      'control-label': !this.isCheckboxOrRadio()
	    };
	    classes[this.props.labelClassName] = this.props.labelClassName;

	    return this.props.label ? _react2['default'].createElement(
	      'label',
	      { htmlFor: this.props.id, className: _classnames2['default'](classes), key: 'label' },
	      children,
	      this.props.label
	    ) : children;
	  };

	  InputBase.prototype.renderInput = function renderInput() {
	    if (!this.props.type) {
	      return this.props.children;
	    }

	    switch (this.props.type) {
	      case 'select':
	        return _react2['default'].createElement(
	          'select',
	          _extends({}, this.props, { className: _classnames2['default'](this.props.className, 'form-control'), ref: 'input', key: 'input' }),
	          this.props.children
	        );
	      case 'textarea':
	        return _react2['default'].createElement('textarea', _extends({}, this.props, { className: _classnames2['default'](this.props.className, 'form-control'), ref: 'input', key: 'input' }));
	      case 'static':
	        return _react2['default'].createElement(
	          'p',
	          _extends({}, this.props, { className: _classnames2['default'](this.props.className, 'form-control-static'), ref: 'input', key: 'input' }),
	          this.props.value
	        );
	      default:
	        var className = this.isCheckboxOrRadio() || this.isFile() ? '' : 'form-control';
	        return _react2['default'].createElement('input', _extends({}, this.props, { className: _classnames2['default'](this.props.className, className), ref: 'input', key: 'input' }));
	    }
	  };

	  InputBase.prototype.renderFormGroup = function renderFormGroup(children) {
	    return _react2['default'].createElement(
	      _FormGroup2['default'],
	      this.props,
	      children
	    );
	  };

	  InputBase.prototype.renderChildren = function renderChildren() {
	    return !this.isCheckboxOrRadio() ? [this.renderLabel(), this.renderWrapper([this.renderInputGroup(this.renderInput()), this.renderIcon(), this.renderHelp()])] : this.renderWrapper([this.renderCheckboxAndRadioWrapper(this.renderLabel(this.renderInput())), this.renderHelp()]);
	  };

	  InputBase.prototype.render = function render() {
	    var children = this.renderChildren();
	    return this.renderFormGroup(children);
	  };

	  return InputBase;
	})(_react2['default'].Component);

	InputBase.propTypes = {
	  type: _react2['default'].PropTypes.string,
	  label: _react2['default'].PropTypes.node,
	  help: _react2['default'].PropTypes.node,
	  addonBefore: _react2['default'].PropTypes.node,
	  addonAfter: _react2['default'].PropTypes.node,
	  buttonBefore: _react2['default'].PropTypes.node,
	  buttonAfter: _react2['default'].PropTypes.node,
	  bsSize: _react2['default'].PropTypes.oneOf(['small', 'medium', 'large']),
	  bsStyle: _react2['default'].PropTypes.oneOf(['success', 'warning', 'error']),
	  hasFeedback: _react2['default'].PropTypes.bool,
	  feedbackIcon: _react2['default'].PropTypes.node,
	  id: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
	  groupClassName: _react2['default'].PropTypes.string,
	  wrapperClassName: _react2['default'].PropTypes.string,
	  labelClassName: _react2['default'].PropTypes.string,
	  multiple: _react2['default'].PropTypes.bool,
	  disabled: _react2['default'].PropTypes.bool,
	  value: _react2['default'].PropTypes.any
	};

	InputBase.defaultProps = {
	  disabled: false,
	  hasFeedback: false,
	  multiple: false
	};

	exports['default'] = InputBase;
	module.exports = exports['default'];

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var Glyphicon = _react2['default'].createClass({
	  displayName: 'Glyphicon',

	  propTypes: {
	    /**
	     * bootstrap className
	     * @private
	     */
	    bsClass: _react2['default'].PropTypes.string,
	    /**
	     * An icon name. See e.g. http://getbootstrap.com/components/#glyphicons
	     */
	    glyph: _react2['default'].PropTypes.string.isRequired,
	    /**
	     * Adds 'form-control-feedback' class
	     * @private
	     */
	    formControlFeedback: _react2['default'].PropTypes.bool
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      bsClass: 'glyphicon',
	      formControlFeedback: false
	    };
	  },

	  render: function render() {
	    var _classNames;

	    var className = _classnames2['default'](this.props.className, (_classNames = {}, _classNames[this.props.bsClass] = true, _classNames['glyphicon-' + this.props.glyph] = true, _classNames['form-control-feedback'] = this.props.formControlFeedback, _classNames));

	    return _react2['default'].createElement(
	      'span',
	      _extends({}, this.props, { className: className }),
	      this.props.children
	    );
	  }
	});

	exports['default'] = Glyphicon;
	module.exports = exports['default'];

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;
	exports['default'] = valueValidation;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactPropTypesLibSinglePropFrom = __webpack_require__(87);

	var _reactPropTypesLibSinglePropFrom2 = _interopRequireDefault(_reactPropTypesLibSinglePropFrom);

	function valueValidation(props, propName, componentName) {
	  var error = _reactPropTypesLibSinglePropFrom2['default']('children', 'value')(props, propName, componentName);

	  if (!error) {
	    error = _react2['default'].PropTypes.node(props, propName, componentName);
	  }

	  return error;
	}

	module.exports = exports['default'];

/***/ },
/* 87 */
/***/ function(module, exports) {

	/**
	 * Checks if only one of the listed properties is in use. An error is given
	 * if multiple have a value
	 *
	 * @param props
	 * @param propName
	 * @param componentName
	 * @returns {Error|undefined}
	 */
	'use strict';

	exports.__esModule = true;
	exports['default'] = createSinglePropFromChecker;

	function createSinglePropFromChecker() {
	  for (var _len = arguments.length, arrOfProps = Array(_len), _key = 0; _key < _len; _key++) {
	    arrOfProps[_key] = arguments[_key];
	  }

	  function validate(props, propName, componentName) {
	    var usedPropCount = arrOfProps.map(function (listedProp) {
	      return props[listedProp];
	    }).reduce(function (acc, curr) {
	      return acc + (curr !== undefined ? 1 : 0);
	    }, 0);

	    if (usedPropCount > 1) {
	      var first = arrOfProps[0];
	      var others = arrOfProps.slice(1);

	      var message = others.join(', ') + ' and ' + first;
	      return new Error('Invalid prop \'' + propName + '\', only one of the following ' + ('may be provided: ' + message));
	    }
	  }
	  return validate;
	}

	module.exports = exports['default'];

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inherits = __webpack_require__(56)['default'];

	var _classCallCheck = __webpack_require__(66)['default'];

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _ListGroupItem = __webpack_require__(89);

	var _ListGroupItem2 = _interopRequireDefault(_ListGroupItem);

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _utilsValidComponentChildren = __webpack_require__(90);

	var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

	var ListGroup = (function (_React$Component) {
	  _inherits(ListGroup, _React$Component);

	  function ListGroup() {
	    _classCallCheck(this, ListGroup);

	    _React$Component.apply(this, arguments);
	  }

	  ListGroup.prototype.render = function render() {
	    var _this = this;

	    var items = _utilsValidComponentChildren2['default'].map(this.props.children, function (item, index) {
	      return _react.cloneElement(item, { key: item.key ? item.key : index });
	    });

	    if (this.areCustomChildren(items)) {
	      var Component = this.props.componentClass;
	      return _react2['default'].createElement(
	        Component,
	        _extends({}, this.props, {
	          className: _classnames2['default'](this.props.className, 'list-group') }),
	        items
	      );
	    }

	    var shouldRenderDiv = false;

	    if (!this.props.children) {
	      shouldRenderDiv = true;
	    } else {
	      _utilsValidComponentChildren2['default'].forEach(this.props.children, function (child) {
	        if (_this.isAnchorOrButton(child.props)) {
	          shouldRenderDiv = true;
	        }
	      });
	    }

	    return shouldRenderDiv ? this.renderDiv(items) : this.renderUL(items);
	  };

	  ListGroup.prototype.isAnchorOrButton = function isAnchorOrButton(props) {
	    return props.href || props.onClick;
	  };

	  ListGroup.prototype.areCustomChildren = function areCustomChildren(children) {
	    var customChildren = false;

	    _utilsValidComponentChildren2['default'].forEach(children, function (child) {
	      if (child.type !== _ListGroupItem2['default']) {
	        customChildren = true;
	      }
	    }, this);

	    return customChildren;
	  };

	  ListGroup.prototype.renderUL = function renderUL(items) {
	    var listItems = _utilsValidComponentChildren2['default'].map(items, function (item) {
	      return _react.cloneElement(item, { listItem: true });
	    });

	    return _react2['default'].createElement(
	      'ul',
	      _extends({}, this.props, {
	        className: _classnames2['default'](this.props.className, 'list-group') }),
	      listItems
	    );
	  };

	  ListGroup.prototype.renderDiv = function renderDiv(items) {
	    return _react2['default'].createElement(
	      'div',
	      _extends({}, this.props, {
	        className: _classnames2['default'](this.props.className, 'list-group') }),
	      items
	    );
	  };

	  return ListGroup;
	})(_react2['default'].Component);

	ListGroup.defaultProps = {
	  componentClass: 'div'
	};

	ListGroup.propTypes = {
	  className: _react2['default'].PropTypes.string,
	  /**
	   * The element for ListGroup if children are
	   * user-defined custom components.
	   * @type {("ul"|"div")}
	   */
	  componentClass: _react2['default'].PropTypes.oneOf(['ul', 'div']),
	  id: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number])
	};

	exports['default'] = ListGroup;
	module.exports = exports['default'];

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _BootstrapMixin = __webpack_require__(74);

	var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var ListGroupItem = _react2['default'].createClass({
	  displayName: 'ListGroupItem',

	  mixins: [_BootstrapMixin2['default']],

	  propTypes: {
	    bsStyle: _react2['default'].PropTypes.oneOf(['danger', 'info', 'success', 'warning']),
	    className: _react2['default'].PropTypes.string,
	    active: _react2['default'].PropTypes.any,
	    disabled: _react2['default'].PropTypes.any,
	    header: _react2['default'].PropTypes.node,
	    listItem: _react2['default'].PropTypes.bool,
	    onClick: _react2['default'].PropTypes.func,
	    href: _react2['default'].PropTypes.string
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      bsClass: 'list-group-item',
	      listItem: false
	    };
	  },

	  render: function render() {
	    var classes = this.getBsClassSet();

	    classes.active = this.props.active;
	    classes.disabled = this.props.disabled;

	    if (this.props.href) {
	      return this.renderAnchor(classes);
	    } else if (this.props.onClick) {
	      return this.renderButton(classes);
	    } else if (this.props.listItem) {
	      return this.renderLi(classes);
	    }
	    return this.renderSpan(classes);
	  },

	  renderLi: function renderLi(classes) {
	    return _react2['default'].createElement(
	      'li',
	      _extends({}, this.props, { className: _classnames2['default'](this.props.className, classes) }),
	      this.props.header ? this.renderStructuredContent() : this.props.children
	    );
	  },

	  renderAnchor: function renderAnchor(classes) {
	    return _react2['default'].createElement(
	      'a',
	      _extends({}, this.props, {
	        className: _classnames2['default'](this.props.className, classes)
	      }),
	      this.props.header ? this.renderStructuredContent() : this.props.children
	    );
	  },

	  renderButton: function renderButton(classes) {
	    return _react2['default'].createElement(
	      'button',
	      _extends({
	        type: 'button'
	      }, this.props, {
	        className: _classnames2['default'](this.props.className, classes) }),
	      this.props.header ? this.renderStructuredContent() : this.props.children
	    );
	  },

	  renderSpan: function renderSpan(classes) {
	    return _react2['default'].createElement(
	      'span',
	      _extends({}, this.props, { className: _classnames2['default'](this.props.className, classes) }),
	      this.props.header ? this.renderStructuredContent() : this.props.children
	    );
	  },

	  renderStructuredContent: function renderStructuredContent() {
	    var header = undefined;
	    if (_react2['default'].isValidElement(this.props.header)) {
	      header = _react.cloneElement(this.props.header, {
	        key: 'header',
	        className: _classnames2['default'](this.props.header.props.className, 'list-group-item-heading')
	      });
	    } else {
	      header = _react2['default'].createElement(
	        'h4',
	        { key: 'header', className: 'list-group-item-heading' },
	        this.props.header
	      );
	    }

	    var content = _react2['default'].createElement(
	      'p',
	      { key: 'content', className: 'list-group-item-text' },
	      this.props.children
	    );

	    return [header, content];
	  }
	});

	exports['default'] = ListGroupItem;
	module.exports = exports['default'];

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	/**
	 * Maps children that are typically specified as `props.children`,
	 * but only iterates over children that are "valid components".
	 *
	 * The mapFunction provided index will be normalised to the components mapped,
	 * so an invalid component would not increase the index.
	 *
	 * @param {?*} children Children tree container.
	 * @param {function(*, int)} mapFunction.
	 * @param {*} mapContext Context for mapFunction.
	 * @return {object} Object containing the ordered map of results.
	 */
	function mapValidComponents(children, func, context) {
	  var index = 0;

	  return _react2['default'].Children.map(children, function (child) {
	    if (_react2['default'].isValidElement(child)) {
	      var lastIndex = index;
	      index++;
	      return func.call(context, child, lastIndex);
	    }

	    return child;
	  });
	}

	/**
	 * Iterates through children that are typically specified as `props.children`,
	 * but only iterates over children that are "valid components".
	 *
	 * The provided forEachFunc(child, index) will be called for each
	 * leaf child with the index reflecting the position relative to "valid components".
	 *
	 * @param {?*} children Children tree container.
	 * @param {function(*, int)} forEachFunc.
	 * @param {*} forEachContext Context for forEachContext.
	 */
	function forEachValidComponents(children, func, context) {
	  var index = 0;

	  return _react2['default'].Children.forEach(children, function (child) {
	    if (_react2['default'].isValidElement(child)) {
	      func.call(context, child, index);
	      index++;
	    }
	  });
	}

	/**
	 * Count the number of "valid components" in the Children container.
	 *
	 * @param {?*} children Children tree container.
	 * @returns {number}
	 */
	function numberOfValidComponents(children) {
	  var count = 0;

	  _react2['default'].Children.forEach(children, function (child) {
	    if (_react2['default'].isValidElement(child)) {
	      count++;
	    }
	  });

	  return count;
	}

	/**
	 * Determine if the Child container has one or more "valid components".
	 *
	 * @param {?*} children Children tree container.
	 * @returns {boolean}
	 */
	function hasValidComponent(children) {
	  var hasValid = false;

	  _react2['default'].Children.forEach(children, function (child) {
	    if (!hasValid && _react2['default'].isValidElement(child)) {
	      hasValid = true;
	    }
	  });

	  return hasValid;
	}

	function find(children, finder) {
	  var child = undefined;

	  forEachValidComponents(children, function (c, idx) {
	    if (!child && finder(c, idx, children)) {
	      child = c;
	    }
	  });

	  return child;
	}

	/**
	 * Finds children that are typically specified as `props.children`,
	 * but only iterates over children that are "valid components".
	 *
	 * The provided forEachFunc(child, index) will be called for each
	 * leaf child with the index reflecting the position relative to "valid components".
	 *
	 * @param {?*} children Children tree container.
	 * @param {function(*, int)} findFunc.
	 * @param {*} findContext Context for findContext.
	 * @returns {array} of children that meet the findFunc return statement
	 */
	function findValidComponents(children, func, context) {
	  var index = 0;
	  var returnChildren = [];

	  _react2['default'].Children.forEach(children, function (child) {
	    if (_react2['default'].isValidElement(child)) {
	      if (func.call(context, child, index)) {
	        returnChildren.push(child);
	      }
	      index++;
	    }
	  });

	  return returnChildren;
	}

	exports['default'] = {
	  map: mapValidComponents,
	  forEach: forEachValidComponents,
	  numberOf: numberOfValidComponents,
	  find: find,
	  findValidComponents: findValidComponents,
	  hasValidComponent: hasValidComponent
	};
	module.exports = exports['default'];

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var Radium = __webpack_require__(4);
	var ReactDOM = __webpack_require__(2);

	var Spinner = React.createClass({
	    displayName: 'Spinner',

	    render: function render() {
	        return React.createElement(
	            'svg',
	            {
	                style: [styles.spinner, this.props.style],
	                width: this.props.width,
	                height: this.props.height,
	                viewBox: '0 0 66 66',
	                xmlns: 'http://www.w3.org/2000/svg' },
	            React.createElement('circle', {
	                style: styles.path,
	                fill: 'none',
	                strokeWidth: '6',
	                strokeLinecap: 'round',
	                cx: '33',
	                cy: '33',
	                r: '30' })
	        );
	    }
	});

	var rotator = Radium.keyframes({
	    '0%': { WebkitTransform: 'rotate(0deg)', transform: 'rotate(0deg)' },
	    '100%': { WebkitTransform: 'rotate(270deg)', transform: 'rotate(270deg)' }
	}, 'Spinner');

	var colors = Radium.keyframes({
	    '0%': { stroke: '#4285F4' },
	    '25%': { stroke: '#DE3E35' },
	    '50%': { stroke: '#F7C223' },
	    '75%': { stroke: '#1B9A59' },
	    '100%': { stroke: '#4285F4' }
	}, 'Spinner');

	var dash = Radium.keyframes({
	    '0%': { strokeDashoffset: '187' },
	    '50%': { strokeDashoffset: '46.75', WebkitTransform: 'rotate(135deg)', transform: 'rotate(135deg)' },
	    '100%': { strokeDashoffset: '187', WebkitTransform: 'rotate(450deg)', transform: 'rotate(450deg)' }
	}, 'Spinner');

	var styles = {

	    spinner: {
	        WebkitAnimation: rotator + ' 1.4s linear infinite',
	        animation: rotator + ' 1.4s linear infinite'
	    },

	    path: {
	        strokeDasharray: '187',
	        strokeDashoffset: '0',
	        WebkitTransformOrigin: 'center',
	        transformOrigin: 'center',
	        WebkitAnimation: dash + ' 1.4s ease-in-out infinite, ' + colors + ' 5.6s ease-in-out infinite',
	        animation: dash + ' 1.4s ease-in-out infinite, ' + colors + ' 5.6s ease-in-out infinite'
	    }
	};

	module.exports = Radium(Spinner);

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var Radium = __webpack_require__(4);
	var Channels = __webpack_require__(93);

	var Toolbar = React.createClass({
	    displayName: 'Toolbar',

	    render: function render() {
	        var btButtonState = this.props.deviceConnected ? styles.btButtonOn : {};

	        return React.createElement(
	            'table',
	            { style: styles.navbar },
	            React.createElement(
	                'tbody',
	                null,
	                React.createElement(
	                    'tr',
	                    { valign: 'middle' },
	                    React.createElement(
	                        'td',
	                        { width: '15%', align: 'left' },
	                        React.createElement(
	                            'button',
	                            { className: 'btn', style: [styles.btButton, btButtonState], onClick: this.props.showDevices },
	                            React.createElement(
	                                'svg',
	                                { style: styles.btButtonIcon, fill: '#FFFFFF', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' },
	                                React.createElement('path', { d: 'M0 0h24v24H0z', fill: 'none' }),
	                                React.createElement('path', { d: 'M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z' })
	                            )
	                        )
	                    ),
	                    React.createElement(
	                        'td',
	                        { width: '70%', align: 'center' },
	                        React.createElement(
	                            'div',
	                            { style: styles.brand },
	                            this.props.title
	                        )
	                    ),
	                    React.createElement(
	                        'td',
	                        { width: '15%', align: 'right' },
	                        React.createElement(Channels, null)
	                    )
	                )
	            )
	        );
	    }
	});

	var styles = {

	    navbar: {
	        background: '#337ab7',
	        width: '100%',
	        height: '101%',
	        minHeight: '10px',
	        margin: '0',
	        padding: '0'
	    },

	    brand: {
	        color: '#fff',
	        fontSize: '5vh',
	        textAlign: 'center'
	    },

	    btButton: {
	        border: 'none',
	        width: '8vh',
	        height: 'auto',
	        padding: '1vh',
	        marginLeft: '1vh',
	        borderRadius: '50%',
	        overflow: 'hidden',
	        background: '#000'
	    },

	    btButtonOn: {
	        background: '#5cb85c'
	    },

	    btButtonIcon: {
	        display: 'block'
	    }
	};

	module.exports = Radium(Toolbar);

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    Data channels dropdown menu
	*/
	'use strict';

	var React = __webpack_require__(1);
	var Radium = __webpack_require__(4);
	var DropdownButton = __webpack_require__(94);
	var MenuItem = __webpack_require__(181);

	var Channels = React.createClass({
	    displayName: 'Channels',

	    getInitialState: function getInitialState() {
	        return {
	            channelId: 1,
	            channels: [1, 2, 3, 4]
	        };
	    },

	    render: function render() {
	        return React.createElement(
	            DropdownButton,
	            {
	                id: 'channelsButton',
	                title: 'CH' + this.state.channelId,
	                bsStyle: 'primary',
	                pullRight: true,
	                style: styles.dropdown },
	            this.state.channels.map(function (channel) {
	                return React.createElement(
	                    MenuItem,
	                    { key: channel, eventKey: channel },
	                    'CH' + channel
	                );
	            })
	        );
	    }
	});

	var styles = {

	    dropdown: {
	        float: 'right',
	        height: '85%'
	    }
	};

	module.exports = Radium(Channels);

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inherits = __webpack_require__(56)['default'];

	var _classCallCheck = __webpack_require__(66)['default'];

	var _extends = __webpack_require__(13)['default'];

	var _objectWithoutProperties = __webpack_require__(27)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _BootstrapMixin = __webpack_require__(74);

	var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

	var _Dropdown = __webpack_require__(95);

	var _Dropdown2 = _interopRequireDefault(_Dropdown);

	var _lodashCompatObjectOmit = __webpack_require__(150);

	var _lodashCompatObjectOmit2 = _interopRequireDefault(_lodashCompatObjectOmit);

	var DropdownButton = (function (_React$Component) {
	  _inherits(DropdownButton, _React$Component);

	  function DropdownButton(props) {
	    _classCallCheck(this, DropdownButton);

	    _React$Component.call(this, props);
	  }

	  DropdownButton.prototype.render = function render() {
	    var _props = this.props;
	    var title = _props.title;

	    var props = _objectWithoutProperties(_props, ['title']);

	    var toggleProps = _lodashCompatObjectOmit2['default'](props, _Dropdown2['default'].ControlledComponent.propTypes);

	    return _react2['default'].createElement(
	      _Dropdown2['default'],
	      props,
	      _react2['default'].createElement(
	        _Dropdown2['default'].Toggle,
	        toggleProps,
	        title
	      ),
	      _react2['default'].createElement(
	        _Dropdown2['default'].Menu,
	        null,
	        this.props.children
	      )
	    );
	  };

	  return DropdownButton;
	})(_react2['default'].Component);

	DropdownButton.propTypes = _extends({
	  /**
	   * When used with the `title` prop, the noCaret option will not render a caret icon, in the toggle element.
	   */
	  noCaret: _react2['default'].PropTypes.bool,

	  title: _react2['default'].PropTypes.node.isRequired

	}, _Dropdown2['default'].propTypes, _BootstrapMixin2['default'].propTypes);

	DropdownButton.defaultProps = {
	  pullRight: false,
	  dropup: false,
	  navItem: false,
	  noCaret: false
	};

	exports['default'] = DropdownButton;
	module.exports = exports['default'];

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inherits = __webpack_require__(56)['default'];

	var _classCallCheck = __webpack_require__(66)['default'];

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _domHelpersActiveElement = __webpack_require__(49);

	var _domHelpersActiveElement2 = _interopRequireDefault(_domHelpersActiveElement);

	var _domHelpersQueryContains = __webpack_require__(48);

	var _domHelpersQueryContains2 = _interopRequireDefault(_domHelpersQueryContains);

	var _keycode = __webpack_require__(96);

	var _keycode2 = _interopRequireDefault(_keycode);

	var _lodashCompatCollectionFind = __webpack_require__(97);

	var _lodashCompatCollectionFind2 = _interopRequireDefault(_lodashCompatCollectionFind);

	var _lodashCompatObjectOmit = __webpack_require__(150);

	var _lodashCompatObjectOmit2 = _interopRequireDefault(_lodashCompatObjectOmit);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _reactPropTypesLibAll = __webpack_require__(165);

	var _reactPropTypesLibAll2 = _interopRequireDefault(_reactPropTypesLibAll);

	var _reactPropTypesLibElementType = __webpack_require__(46);

	var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

	var _reactPropTypesLibIsRequiredForA11y = __webpack_require__(166);

	var _reactPropTypesLibIsRequiredForA11y2 = _interopRequireDefault(_reactPropTypesLibIsRequiredForA11y);

	var _uncontrollable = __webpack_require__(167);

	var _uncontrollable2 = _interopRequireDefault(_uncontrollable);

	var _ButtonGroup = __webpack_require__(171);

	var _ButtonGroup2 = _interopRequireDefault(_ButtonGroup);

	var _DropdownMenu = __webpack_require__(172);

	var _DropdownMenu2 = _interopRequireDefault(_DropdownMenu);

	var _DropdownToggle = __webpack_require__(177);

	var _DropdownToggle2 = _interopRequireDefault(_DropdownToggle);

	var _utilsCreateChainedFunction = __webpack_require__(45);

	var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

	var _utilsCustomPropTypes = __webpack_require__(179);

	var _utilsCustomPropTypes2 = _interopRequireDefault(_utilsCustomPropTypes);

	var _utilsValidComponentChildren = __webpack_require__(90);

	var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

	var TOGGLE_REF = 'toggle-btn';
	var TOGGLE_ROLE = _DropdownToggle2['default'].defaultProps.bsRole;
	var MENU_ROLE = _DropdownMenu2['default'].defaultProps.bsRole;

	var Dropdown = (function (_React$Component) {
	  _inherits(Dropdown, _React$Component);

	  function Dropdown(props) {
	    _classCallCheck(this, Dropdown);

	    _React$Component.call(this, props);

	    this.Toggle = _DropdownToggle2['default'];

	    this.toggleOpen = this.toggleOpen.bind(this);
	    this.handleClick = this.handleClick.bind(this);
	    this.handleKeyDown = this.handleKeyDown.bind(this);
	    this.handleClose = this.handleClose.bind(this);
	    this.extractChildren = this.extractChildren.bind(this);

	    this.refineMenu = this.refineMenu.bind(this);
	    this.refineToggle = this.refineToggle.bind(this);

	    this.childExtractors = [{
	      key: 'toggle',
	      matches: function matches(child) {
	        return child.props.bsRole === TOGGLE_ROLE;
	      },
	      refine: this.refineToggle
	    }, {
	      key: 'menu',
	      exclusive: true,
	      matches: function matches(child) {
	        return child.props.bsRole === MENU_ROLE;
	      },
	      refine: this.refineMenu
	    }];

	    this.state = {};

	    this.lastOpenEventType = null;
	  }

	  Dropdown.prototype.componentDidMount = function componentDidMount() {
	    this.focusNextOnOpen();
	  };

	  Dropdown.prototype.componentWillUpdate = function componentWillUpdate(nextProps) {
	    if (!nextProps.open && this.props.open) {
	      this._focusInDropdown = _domHelpersQueryContains2['default'](_reactDom2['default'].findDOMNode(this.refs.menu), _domHelpersActiveElement2['default'](document));
	    }
	  };

	  Dropdown.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
	    if (this.props.open && !prevProps.open) {
	      this.focusNextOnOpen();
	    }

	    if (!this.props.open && prevProps.open) {
	      // if focus hasn't already moved from the menu lets return it
	      // to the toggle
	      if (this._focusInDropdown) {
	        this._focusInDropdown = false;
	        this.focus();
	      }
	    }
	  };

	  Dropdown.prototype.render = function render() {
	    var children = this.extractChildren();
	    var Component = this.props.componentClass;

	    var props = _lodashCompatObjectOmit2['default'](this.props, ['id', 'role']);

	    var rootClasses = {
	      open: this.props.open,
	      disabled: this.props.disabled,
	      dropdown: !this.props.dropup,
	      dropup: this.props.dropup
	    };

	    return _react2['default'].createElement(
	      Component,
	      _extends({}, props, {
	        tabIndex: '-1',
	        className: _classnames2['default'](this.props.className, rootClasses)
	      }),
	      children
	    );
	  };

	  Dropdown.prototype.toggleOpen = function toggleOpen() {
	    var eventType = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

	    var open = !this.props.open;

	    if (open) {
	      this.lastOpenEventType = eventType;
	    }

	    if (this.props.onToggle) {
	      this.props.onToggle(open);
	    }
	  };

	  Dropdown.prototype.handleClick = function handleClick() {
	    if (this.props.disabled) {
	      return;
	    }

	    this.toggleOpen('click');
	  };

	  Dropdown.prototype.handleKeyDown = function handleKeyDown(event) {
	    if (this.props.disabled) {
	      return;
	    }

	    switch (event.keyCode) {
	      case _keycode2['default'].codes.down:
	        if (!this.props.open) {
	          this.toggleOpen('keydown');
	        } else if (this.refs.menu.focusNext) {
	          this.refs.menu.focusNext();
	        }
	        event.preventDefault();
	        break;
	      case _keycode2['default'].codes.esc:
	      case _keycode2['default'].codes.tab:
	        this.handleClose(event);
	        break;
	      default:
	    }
	  };

	  Dropdown.prototype.handleClose = function handleClose() {
	    if (!this.props.open) {
	      return;
	    }

	    this.toggleOpen();
	  };

	  Dropdown.prototype.focusNextOnOpen = function focusNextOnOpen() {
	    var menu = this.refs.menu;

	    if (!menu.focusNext) {
	      return;
	    }

	    if (this.lastOpenEventType === 'keydown' || this.props.role === 'menuitem') {
	      menu.focusNext();
	    }
	  };

	  Dropdown.prototype.focus = function focus() {
	    var toggle = _reactDom2['default'].findDOMNode(this.refs[TOGGLE_REF]);

	    if (toggle && toggle.focus) {
	      toggle.focus();
	    }
	  };

	  Dropdown.prototype.extractChildren = function extractChildren() {
	    var _this = this;

	    var open = !!this.props.open;
	    var seen = {};

	    return _utilsValidComponentChildren2['default'].map(this.props.children, function (child) {
	      var extractor = _lodashCompatCollectionFind2['default'](_this.childExtractors, function (x) {
	        return x.matches(child);
	      });

	      if (extractor) {
	        if (seen[extractor.key]) {
	          return false;
	        }

	        seen[extractor.key] = extractor.exclusive;
	        child = extractor.refine(child, open);
	      }

	      return child;
	    });
	  };

	  Dropdown.prototype.refineMenu = function refineMenu(menu, open) {
	    var menuProps = {
	      ref: 'menu',
	      open: open,
	      labelledBy: this.props.id,
	      pullRight: this.props.pullRight
	    };

	    menuProps.onClose = _utilsCreateChainedFunction2['default'](menu.props.onClose, this.props.onClose, this.handleClose);

	    menuProps.onSelect = _utilsCreateChainedFunction2['default'](menu.props.onSelect, this.props.onSelect, this.handleClose);

	    return _react.cloneElement(menu, menuProps, menu.props.children);
	  };

	  Dropdown.prototype.refineToggle = function refineToggle(toggle, open) {
	    var toggleProps = {
	      open: open,
	      id: this.props.id,
	      ref: TOGGLE_REF,
	      role: this.props.role
	    };

	    toggleProps.onClick = _utilsCreateChainedFunction2['default'](toggle.props.onClick, this.handleClick);

	    toggleProps.onKeyDown = _utilsCreateChainedFunction2['default'](toggle.props.onKeyDown, this.handleKeyDown);

	    return _react.cloneElement(toggle, toggleProps, toggle.props.children);
	  };

	  return Dropdown;
	})(_react2['default'].Component);

	Dropdown.Toggle = _DropdownToggle2['default'];

	Dropdown.TOGGLE_REF = TOGGLE_REF;
	Dropdown.TOGGLE_ROLE = TOGGLE_ROLE;
	Dropdown.MENU_ROLE = MENU_ROLE;

	Dropdown.defaultProps = {
	  componentClass: _ButtonGroup2['default'],
	  alwaysFocusNextOnOpen: false
	};

	Dropdown.propTypes = {
	  /**
	   * The menu will open above the dropdown button, instead of below it.
	   */
	  dropup: _react2['default'].PropTypes.bool,

	  /**
	   * An html id attribute, necessary for assistive technologies, such as screen readers.
	   * @type {string|number}
	   * @required
	   */
	  id: _reactPropTypesLibIsRequiredForA11y2['default'](_react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number])),

	  componentClass: _reactPropTypesLibElementType2['default'],

	  /**
	   * The children of a Dropdown may be a `<Dropdown.Toggle/>` or a `<Dropdown.Menu/>`.
	   * @type {node}
	   */
	  children: _reactPropTypesLibAll2['default'](_utilsCustomPropTypes2['default'].requiredRoles(TOGGLE_ROLE, MENU_ROLE), _utilsCustomPropTypes2['default'].exclusiveRoles(MENU_ROLE)),

	  /**
	   * Whether or not component is disabled.
	   */
	  disabled: _react2['default'].PropTypes.bool,

	  /**
	   * Align the menu to the right side of the Dropdown toggle
	   */
	  pullRight: _react2['default'].PropTypes.bool,

	  /**
	   * Whether or not the Dropdown is visible.
	   *
	   * @controllable onToggle
	   */
	  open: _react2['default'].PropTypes.bool,

	  /**
	   * A callback fired when the Dropdown closes.
	   */
	  onClose: _react2['default'].PropTypes.func,

	  /**
	   * A callback fired when the Dropdown wishes to change visibility. Called with the requested
	   * `open` value.
	   *
	   * ```js
	   * function(Boolean isOpen) {}
	   * ```
	   * @controllable open
	   */
	  onToggle: _react2['default'].PropTypes.func,

	  /**
	   * A callback fired when a menu item is selected.
	   *
	   * ```js
	   * function(Object event, Any eventKey)
	   * ```
	   */
	  onSelect: _react2['default'].PropTypes.func,

	  /**
	   * If `'menuitem'`, causes the dropdown to behave like a menu item rather than
	   * a menu button.
	   */
	  role: _react2['default'].PropTypes.string
	};

	Dropdown = _uncontrollable2['default'](Dropdown, { open: 'onToggle' });

	Dropdown.Toggle = _DropdownToggle2['default'];
	Dropdown.Menu = _DropdownMenu2['default'];

	exports['default'] = Dropdown;
	module.exports = exports['default'];

/***/ },
/* 96 */
/***/ function(module, exports) {

	// Source: http://jsfiddle.net/vWx8V/
	// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes



	/**
	 * Conenience method returns corresponding value for given keyName or keyCode.
	 *
	 * @param {Mixed} keyCode {Number} or keyName {String}
	 * @return {Mixed}
	 * @api public
	 */

	exports = module.exports = function(searchInput) {
	  // Keyboard Events
	  if (searchInput && 'object' === typeof searchInput) {
	    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode
	    if (hasKeyCode) searchInput = hasKeyCode
	  }

	  // Numbers
	  if ('number' === typeof searchInput) return names[searchInput]

	  // Everything else (cast to string)
	  var search = String(searchInput)

	  // check codes
	  var foundNamedKey = codes[search.toLowerCase()]
	  if (foundNamedKey) return foundNamedKey

	  // check aliases
	  var foundNamedKey = aliases[search.toLowerCase()]
	  if (foundNamedKey) return foundNamedKey

	  // weird character?
	  if (search.length === 1) return search.charCodeAt(0)

	  return undefined
	}

	/**
	 * Get by name
	 *
	 *   exports.code['enter'] // => 13
	 */

	var codes = exports.code = exports.codes = {
	  'backspace': 8,
	  'tab': 9,
	  'enter': 13,
	  'shift': 16,
	  'ctrl': 17,
	  'alt': 18,
	  'pause/break': 19,
	  'caps lock': 20,
	  'esc': 27,
	  'space': 32,
	  'page up': 33,
	  'page down': 34,
	  'end': 35,
	  'home': 36,
	  'left': 37,
	  'up': 38,
	  'right': 39,
	  'down': 40,
	  'insert': 45,
	  'delete': 46,
	  'command': 91,
	  'right click': 93,
	  'numpad *': 106,
	  'numpad +': 107,
	  'numpad -': 109,
	  'numpad .': 110,
	  'numpad /': 111,
	  'num lock': 144,
	  'scroll lock': 145,
	  'my computer': 182,
	  'my calculator': 183,
	  ';': 186,
	  '=': 187,
	  ',': 188,
	  '-': 189,
	  '.': 190,
	  '/': 191,
	  '`': 192,
	  '[': 219,
	  '\\': 220,
	  ']': 221,
	  "'": 222,
	}

	// Helper aliases

	var aliases = exports.aliases = {
	  'windows': 91,
	  '⇧': 16,
	  '⌥': 18,
	  '⌃': 17,
	  '⌘': 91,
	  'ctl': 17,
	  'control': 17,
	  'option': 18,
	  'pause': 19,
	  'break': 19,
	  'caps': 20,
	  'return': 13,
	  'escape': 27,
	  'spc': 32,
	  'pgup': 33,
	  'pgdn': 33,
	  'ins': 45,
	  'del': 46,
	  'cmd': 91
	}


	/*!
	 * Programatically add the following
	 */

	// lower case chars
	for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32

	// numbers
	for (var i = 48; i < 58; i++) codes[i - 48] = i

	// function keys
	for (i = 1; i < 13; i++) codes['f'+i] = i + 111

	// numpad keys
	for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96

	/**
	 * Get by code
	 *
	 *   exports.name[13] // => 'Enter'
	 */

	var names = exports.names = exports.title = {} // title for backward compat

	// Create reverse mapping
	for (i in codes) names[codes[i]] = i

	// Add aliases
	for (var alias in aliases) {
	  codes[alias] = aliases[alias]
	}


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var baseEach = __webpack_require__(98),
	    createFind = __webpack_require__(123);

	/**
	 * Iterates over elements of `collection`, returning the first element
	 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
	 * invoked with three arguments: (value, index|key, collection).
	 *
	 * If a property name is provided for `predicate` the created `_.property`
	 * style callback returns the property value of the given element.
	 *
	 * If a value is also provided for `thisArg` the created `_.matchesProperty`
	 * style callback returns `true` for elements that have a matching property
	 * value, else `false`.
	 *
	 * If an object is provided for `predicate` the created `_.matches` style
	 * callback returns `true` for elements that have the properties of the given
	 * object, else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @alias detect
	 * @category Collection
	 * @param {Array|Object|string} collection The collection to search.
	 * @param {Function|Object|string} [predicate=_.identity] The function invoked
	 *  per iteration.
	 * @param {*} [thisArg] The `this` binding of `predicate`.
	 * @returns {*} Returns the matched element, else `undefined`.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney',  'age': 36, 'active': true },
	 *   { 'user': 'fred',    'age': 40, 'active': false },
	 *   { 'user': 'pebbles', 'age': 1,  'active': true }
	 * ];
	 *
	 * _.result(_.find(users, function(chr) {
	 *   return chr.age < 40;
	 * }), 'user');
	 * // => 'barney'
	 *
	 * // using the `_.matches` callback shorthand
	 * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
	 * // => 'pebbles'
	 *
	 * // using the `_.matchesProperty` callback shorthand
	 * _.result(_.find(users, 'active', false), 'user');
	 * // => 'fred'
	 *
	 * // using the `_.property` callback shorthand
	 * _.result(_.find(users, 'active'), 'user');
	 * // => 'barney'
	 */
	var find = createFind(baseEach);

	module.exports = find;


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	var baseForOwn = __webpack_require__(99),
	    createBaseEach = __webpack_require__(122);

	/**
	 * The base implementation of `_.forEach` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object|string} Returns `collection`.
	 */
	var baseEach = createBaseEach(baseForOwn);

	module.exports = baseEach;


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(100),
	    keys = __webpack_require__(107);

	/**
	 * The base implementation of `_.forOwn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return baseFor(object, iteratee, keys);
	}

	module.exports = baseForOwn;


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(101);

	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iteratee functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();

	module.exports = baseFor;


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(102);

	/**
	 * Creates a base function for `_.forIn` or `_.forInRight`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var iterable = toObject(object),
	        props = keysFunc(object),
	        length = props.length,
	        index = fromRight ? length : -1;

	    while ((fromRight ? index-- : ++index < length)) {
	      var key = props[index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	module.exports = createBaseFor;


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(103),
	    isString = __webpack_require__(104),
	    support = __webpack_require__(106);

	/**
	 * Converts `value` to an object if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Object} Returns the object.
	 */
	function toObject(value) {
	  if (support.unindexedChars && isString(value)) {
	    var index = -1,
	        length = value.length,
	        result = Object(value);

	    while (++index < length) {
	      result[index] = value.charAt(index);
	    }
	    return result;
	  }
	  return isObject(value) ? value : Object(value);
	}

	module.exports = toObject;


/***/ },
/* 103 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	var isObjectLike = __webpack_require__(105);

	/** `Object#toString` result references. */
	var stringTag = '[object String]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
	}

	module.exports = isString;


/***/ },
/* 105 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 106 */
/***/ function(module, exports) {

	/** Used for native method references. */
	var arrayProto = Array.prototype,
	    errorProto = Error.prototype,
	    objectProto = Object.prototype;

	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable,
	    splice = arrayProto.splice;

	/**
	 * An object environment feature flags.
	 *
	 * @static
	 * @memberOf _
	 * @type Object
	 */
	var support = {};

	(function(x) {
	  var Ctor = function() { this.x = x; },
	      object = { '0': x, 'length': x },
	      props = [];

	  Ctor.prototype = { 'valueOf': x, 'y': x };
	  for (var key in new Ctor) { props.push(key); }

	  /**
	   * Detect if `name` or `message` properties of `Error.prototype` are
	   * enumerable by default (IE < 9, Safari < 5.1).
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') ||
	    propertyIsEnumerable.call(errorProto, 'name');

	  /**
	   * Detect if `prototype` properties are enumerable by default.
	   *
	   * Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
	   * (if the prototype or a property on the prototype has been set)
	   * incorrectly set the `[[Enumerable]]` value of a function's `prototype`
	   * property to `true`.
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.enumPrototypes = propertyIsEnumerable.call(Ctor, 'prototype');

	  /**
	   * Detect if properties shadowing those on `Object.prototype` are non-enumerable.
	   *
	   * In IE < 9 an object's own properties, shadowing non-enumerable ones,
	   * are made non-enumerable as well (a.k.a the JScript `[[DontEnum]]` bug).
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.nonEnumShadows = !/valueOf/.test(props);

	  /**
	   * Detect if own properties are iterated after inherited properties (IE < 9).
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.ownLast = props[0] != 'x';

	  /**
	   * Detect if `Array#shift` and `Array#splice` augment array-like objects
	   * correctly.
	   *
	   * Firefox < 10, compatibility modes of IE 8, and IE < 9 have buggy Array
	   * `shift()` and `splice()` functions that fail to remove the last element,
	   * `value[0]`, of array-like objects even though the "length" property is
	   * set to `0`. The `shift()` method is buggy in compatibility modes of IE 8,
	   * while `splice()` is buggy regardless of mode in IE < 9.
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.spliceObjects = (splice.call(object, 0, 1), !object[0]);

	  /**
	   * Detect lack of support for accessing string characters by index.
	   *
	   * IE < 8 can't access characters by index. IE 8 can only access characters
	   * by index on string literals, not string objects.
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';
	}(1, 0));

	module.exports = support;


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(108),
	    isArrayLike = __webpack_require__(112),
	    isObject = __webpack_require__(103),
	    shimKeys = __webpack_require__(116),
	    support = __webpack_require__(106);

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = getNative(Object, 'keys');

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	var keys = !nativeKeys ? shimKeys : function(object) {
	  var Ctor = object == null ? undefined : object.constructor;
	  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	      (typeof object == 'function' ? support.enumPrototypes : isArrayLike(object))) {
	    return shimKeys(object);
	  }
	  return isObject(object) ? nativeKeys(object) : [];
	};

	module.exports = keys;


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(109);

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}

	module.exports = getNative;


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(110),
	    isHostObject = __webpack_require__(111),
	    isObjectLike = __webpack_require__(105);

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && (isHostObject(value) ? reIsNative : reIsHostCtor).test(value);
	}

	module.exports = isNative;


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(103);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 which returns 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	module.exports = isFunction;


/***/ },
/* 111 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	var isHostObject = (function() {
	  try {
	    Object({ 'toString': 0 } + '');
	  } catch(e) {
	    return function() { return false; };
	  }
	  return function(value) {
	    // IE < 9 presents many host objects as `Object` objects that can coerce
	    // to strings despite having improperly defined `toString` methods.
	    return typeof value.toString != 'function' && typeof (value + '') == 'string';
	  };
	}());

	module.exports = isHostObject;


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(113),
	    isLength = __webpack_require__(115);

	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}

	module.exports = isArrayLike;


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(114);

	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');

	module.exports = getLength;


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(102);

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : toObject(object)[key];
	  };
	}

	module.exports = baseProperty;


/***/ },
/* 115 */
/***/ function(module, exports) {

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	module.exports = isLength;


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(117),
	    isArray = __webpack_require__(118),
	    isIndex = __webpack_require__(119),
	    isLength = __webpack_require__(115),
	    isString = __webpack_require__(104),
	    keysIn = __webpack_require__(120);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A fallback implementation of `Object.keys` which creates an array of the
	 * own enumerable property names of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function shimKeys(object) {
	  var props = keysIn(object),
	      propsLength = props.length,
	      length = propsLength && object.length;

	  var allowIndexes = !!length && isLength(length) &&
	    (isArray(object) || isArguments(object) || isString(object));

	  var index = -1,
	      result = [];

	  while (++index < propsLength) {
	    var key = props[index];
	    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = shimKeys;


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(112),
	    isObjectLike = __webpack_require__(105);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  return isObjectLike(value) && isArrayLike(value) &&
	    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
	}

	module.exports = isArguments;


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(108),
	    isLength = __webpack_require__(115),
	    isObjectLike = __webpack_require__(105);

	/** `Object#toString` result references. */
	var arrayTag = '[object Array]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = getNative(Array, 'isArray');

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};

	module.exports = isArray;


/***/ },
/* 119 */
/***/ function(module, exports) {

	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}

	module.exports = isIndex;


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	var arrayEach = __webpack_require__(121),
	    isArguments = __webpack_require__(117),
	    isArray = __webpack_require__(118),
	    isFunction = __webpack_require__(110),
	    isIndex = __webpack_require__(119),
	    isLength = __webpack_require__(115),
	    isObject = __webpack_require__(103),
	    isString = __webpack_require__(104),
	    support = __webpack_require__(106);

	/** `Object#toString` result references. */
	var arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    stringTag = '[object String]';

	/** Used to fix the JScript `[[DontEnum]]` bug. */
	var shadowProps = [
	  'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
	  'toLocaleString', 'toString', 'valueOf'
	];

	/** Used for native method references. */
	var errorProto = Error.prototype,
	    objectProto = Object.prototype,
	    stringProto = String.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/** Used to avoid iterating over non-enumerable properties in IE < 9. */
	var nonEnumProps = {};
	nonEnumProps[arrayTag] = nonEnumProps[dateTag] = nonEnumProps[numberTag] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
	nonEnumProps[boolTag] = nonEnumProps[stringTag] = { 'constructor': true, 'toString': true, 'valueOf': true };
	nonEnumProps[errorTag] = nonEnumProps[funcTag] = nonEnumProps[regexpTag] = { 'constructor': true, 'toString': true };
	nonEnumProps[objectTag] = { 'constructor': true };

	arrayEach(shadowProps, function(key) {
	  for (var tag in nonEnumProps) {
	    if (hasOwnProperty.call(nonEnumProps, tag)) {
	      var props = nonEnumProps[tag];
	      props[key] = hasOwnProperty.call(props, key);
	    }
	  }
	});

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;

	  length = (length && isLength(length) &&
	    (isArray(object) || isArguments(object) || isString(object)) && length) || 0;

	  var Ctor = object.constructor,
	      index = -1,
	      proto = (isFunction(Ctor) && Ctor.prototype) || objectProto,
	      isProto = proto === object,
	      result = Array(length),
	      skipIndexes = length > 0,
	      skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error),
	      skipProto = support.enumPrototypes && isFunction(object);

	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  // lodash skips the `constructor` property when it infers it's iterating
	  // over a `prototype` object because IE < 9 can't set the `[[Enumerable]]`
	  // attribute of an existing property and the `constructor` property of a
	  // prototype defaults to non-enumerable.
	  for (var key in object) {
	    if (!(skipProto && key == 'prototype') &&
	        !(skipErrorProps && (key == 'message' || key == 'name')) &&
	        !(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  if (support.nonEnumShadows && object !== objectProto) {
	    var tag = object === stringProto ? stringTag : (object === errorProto ? errorTag : objToString.call(object)),
	        nonEnums = nonEnumProps[tag] || nonEnumProps[objectTag];

	    if (tag == objectTag) {
	      proto = objectProto;
	    }
	    length = shadowProps.length;
	    while (length--) {
	      key = shadowProps[length];
	      var nonEnum = nonEnums[key];
	      if (!(isProto && nonEnum) &&
	          (nonEnum ? hasOwnProperty.call(object, key) : object[key] !== proto[key])) {
	        result.push(key);
	      }
	    }
	  }
	  return result;
	}

	module.exports = keysIn;


/***/ },
/* 121 */
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.forEach` for arrays without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array.length;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	module.exports = arrayEach;


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(113),
	    isLength = __webpack_require__(115),
	    toObject = __webpack_require__(102);

	/**
	 * Creates a `baseEach` or `baseEachRight` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseEach(eachFunc, fromRight) {
	  return function(collection, iteratee) {
	    var length = collection ? getLength(collection) : 0;
	    if (!isLength(length)) {
	      return eachFunc(collection, iteratee);
	    }
	    var index = fromRight ? length : -1,
	        iterable = toObject(collection);

	    while ((fromRight ? index-- : ++index < length)) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  };
	}

	module.exports = createBaseEach;


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	var baseCallback = __webpack_require__(124),
	    baseFind = __webpack_require__(148),
	    baseFindIndex = __webpack_require__(149),
	    isArray = __webpack_require__(118);

	/**
	 * Creates a `_.find` or `_.findLast` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new find function.
	 */
	function createFind(eachFunc, fromRight) {
	  return function(collection, predicate, thisArg) {
	    predicate = baseCallback(predicate, thisArg, 3);
	    if (isArray(collection)) {
	      var index = baseFindIndex(collection, predicate, fromRight);
	      return index > -1 ? collection[index] : undefined;
	    }
	    return baseFind(collection, predicate, eachFunc);
	  };
	}

	module.exports = createFind;


/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	var baseMatches = __webpack_require__(125),
	    baseMatchesProperty = __webpack_require__(137),
	    bindCallback = __webpack_require__(144),
	    identity = __webpack_require__(145),
	    property = __webpack_require__(146);

	/**
	 * The base implementation of `_.callback` which supports specifying the
	 * number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {*} [func=_.identity] The value to convert to a callback.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function baseCallback(func, thisArg, argCount) {
	  var type = typeof func;
	  if (type == 'function') {
	    return thisArg === undefined
	      ? func
	      : bindCallback(func, thisArg, argCount);
	  }
	  if (func == null) {
	    return identity;
	  }
	  if (type == 'object') {
	    return baseMatches(func);
	  }
	  return thisArg === undefined
	    ? property(func)
	    : baseMatchesProperty(func, thisArg);
	}

	module.exports = baseCallback;


/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsMatch = __webpack_require__(126),
	    getMatchData = __webpack_require__(134),
	    toObject = __webpack_require__(102);

	/**
	 * The base implementation of `_.matches` which does not clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatches(source) {
	  var matchData = getMatchData(source);
	  if (matchData.length == 1 && matchData[0][2]) {
	    var key = matchData[0][0],
	        value = matchData[0][1];

	    return function(object) {
	      if (object == null) {
	        return false;
	      }
	      object = toObject(object);
	      return object[key] === value && (value !== undefined || (key in object));
	    };
	  }
	  return function(object) {
	    return baseIsMatch(object, matchData);
	  };
	}

	module.exports = baseMatches;


/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqual = __webpack_require__(127),
	    toObject = __webpack_require__(102);

	/**
	 * The base implementation of `_.isMatch` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Array} matchData The propery names, values, and compare flags to match.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, matchData, customizer) {
	  var index = matchData.length,
	      length = index,
	      noCustomizer = !customizer;

	  if (object == null) {
	    return !length;
	  }
	  object = toObject(object);
	  while (index--) {
	    var data = matchData[index];
	    if ((noCustomizer && data[2])
	          ? data[1] !== object[data[0]]
	          : !(data[0] in object)
	        ) {
	      return false;
	    }
	  }
	  while (++index < length) {
	    data = matchData[index];
	    var key = data[0],
	        objValue = object[key],
	        srcValue = data[1];

	    if (noCustomizer && data[2]) {
	      if (objValue === undefined && !(key in object)) {
	        return false;
	      }
	    } else {
	      var result = customizer ? customizer(objValue, srcValue, key) : undefined;
	      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
	        return false;
	      }
	    }
	  }
	  return true;
	}

	module.exports = baseIsMatch;


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqualDeep = __webpack_require__(128),
	    isObject = __webpack_require__(103),
	    isObjectLike = __webpack_require__(105);

	/**
	 * The base implementation of `_.isEqual` without support for `this` binding
	 * `customizer` functions.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
	}

	module.exports = baseIsEqual;


/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	var equalArrays = __webpack_require__(129),
	    equalByTag = __webpack_require__(131),
	    equalObjects = __webpack_require__(132),
	    isArray = __webpack_require__(118),
	    isHostObject = __webpack_require__(111),
	    isTypedArray = __webpack_require__(133);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    objectTag = '[object Object]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
	 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;

	  if (!objIsArr) {
	    objTag = objToString.call(object);
	    if (objTag == argsTag) {
	      objTag = objectTag;
	    } else if (objTag != objectTag) {
	      objIsArr = isTypedArray(object);
	    }
	  }
	  if (!othIsArr) {
	    othTag = objToString.call(other);
	    if (othTag == argsTag) {
	      othTag = objectTag;
	    } else if (othTag != objectTag) {
	      othIsArr = isTypedArray(other);
	    }
	  }
	  var objIsObj = objTag == objectTag && !isHostObject(object),
	      othIsObj = othTag == objectTag && !isHostObject(other),
	      isSameTag = objTag == othTag;

	  if (isSameTag && !(objIsArr || objIsObj)) {
	    return equalByTag(object, other, objTag);
	  }
	  if (!isLoose) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	    if (objIsWrapped || othIsWrapped) {
	      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  // For more information on detecting circular references see https://es5.github.io/#JO.
	  stackA || (stackA = []);
	  stackB || (stackB = []);

	  var length = stackA.length;
	  while (length--) {
	    if (stackA[length] == object) {
	      return stackB[length] == other;
	    }
	  }
	  // Add `object` and `other` to the stack of traversed objects.
	  stackA.push(object);
	  stackB.push(other);

	  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

	  stackA.pop();
	  stackB.pop();

	  return result;
	}

	module.exports = baseIsEqualDeep;


/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	var arraySome = __webpack_require__(130);

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing arrays.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var index = -1,
	      arrLength = array.length,
	      othLength = other.length;

	  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
	    return false;
	  }
	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index],
	        result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

	    if (result !== undefined) {
	      if (result) {
	        continue;
	      }
	      return false;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (isLoose) {
	      if (!arraySome(other, function(othValue) {
	            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	          })) {
	        return false;
	      }
	    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
	      return false;
	    }
	  }
	  return true;
	}

	module.exports = equalArrays;


/***/ },
/* 130 */
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.some` for arrays without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if any element passes the predicate check,
	 *  else `false`.
	 */
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array.length;

	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}

	module.exports = arraySome;


/***/ },
/* 131 */
/***/ function(module, exports) {

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    stringTag = '[object String]';

	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag) {
	  switch (tag) {
	    case boolTag:
	    case dateTag:
	      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	      return +object == +other;

	    case errorTag:
	      return object.name == other.name && object.message == other.message;

	    case numberTag:
	      // Treat `NaN` vs. `NaN` as equal.
	      return (object != +object)
	        ? other != +other
	        : object == +other;

	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings primitives and string
	      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	      return object == (other + '');
	  }
	  return false;
	}

	module.exports = equalByTag;


/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(107);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;

	  if (objLength != othLength && !isLoose) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
	      return false;
	    }
	  }
	  var skipCtor = isLoose;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key],
	        result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;

	    // Recursively compare objects (susceptible to call stack limits).
	    if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
	      return false;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (!skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      return false;
	    }
	  }
	  return true;
	}

	module.exports = equalObjects;


/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(115),
	    isObjectLike = __webpack_require__(105);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	function isTypedArray(value) {
	  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
	}

	module.exports = isTypedArray;


/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	var isStrictComparable = __webpack_require__(135),
	    pairs = __webpack_require__(136);

	/**
	 * Gets the propery names, values, and compare flags of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the match data of `object`.
	 */
	function getMatchData(object) {
	  var result = pairs(object),
	      length = result.length;

	  while (length--) {
	    result[length][2] = isStrictComparable(result[length][1]);
	  }
	  return result;
	}

	module.exports = getMatchData;


/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(103);

	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject(value);
	}

	module.exports = isStrictComparable;


/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(107),
	    toObject = __webpack_require__(102);

	/**
	 * Creates a two dimensional array of the key-value pairs for `object`,
	 * e.g. `[[key1, value1], [key2, value2]]`.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the new array of key-value pairs.
	 * @example
	 *
	 * _.pairs({ 'barney': 36, 'fred': 40 });
	 * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
	 */
	function pairs(object) {
	  object = toObject(object);

	  var index = -1,
	      props = keys(object),
	      length = props.length,
	      result = Array(length);

	  while (++index < length) {
	    var key = props[index];
	    result[index] = [key, object[key]];
	  }
	  return result;
	}

	module.exports = pairs;


/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(138),
	    baseIsEqual = __webpack_require__(127),
	    baseSlice = __webpack_require__(139),
	    isArray = __webpack_require__(118),
	    isKey = __webpack_require__(140),
	    isStrictComparable = __webpack_require__(135),
	    last = __webpack_require__(141),
	    toObject = __webpack_require__(102),
	    toPath = __webpack_require__(142);

	/**
	 * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} srcValue The value to compare.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatchesProperty(path, srcValue) {
	  var isArr = isArray(path),
	      isCommon = isKey(path) && isStrictComparable(srcValue),
	      pathKey = (path + '');

	  path = toPath(path);
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    var key = pathKey;
	    object = toObject(object);
	    if ((isArr || !isCommon) && !(key in object)) {
	      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
	      if (object == null) {
	        return false;
	      }
	      key = last(path);
	      object = toObject(object);
	    }
	    return object[key] === srcValue
	      ? (srcValue !== undefined || (key in object))
	      : baseIsEqual(srcValue, object[key], undefined, true);
	  };
	}

	module.exports = baseMatchesProperty;


/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(102);

	/**
	 * The base implementation of `get` without support for string paths
	 * and default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} path The path of the property to get.
	 * @param {string} [pathKey] The key representation of path.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path, pathKey) {
	  if (object == null) {
	    return;
	  }
	  object = toObject(object);
	  if (pathKey !== undefined && pathKey in object) {
	    path = [pathKey];
	  }
	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = toObject(object)[path[index++]];
	  }
	  return (index && index == length) ? object : undefined;
	}

	module.exports = baseGet;


/***/ },
/* 139 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */
	function baseSlice(array, start, end) {
	  var index = -1,
	      length = array.length;

	  start = start == null ? 0 : (+start || 0);
	  if (start < 0) {
	    start = -start > length ? 0 : (length + start);
	  }
	  end = (end === undefined || end > length) ? length : (+end || 0);
	  if (end < 0) {
	    end += length;
	  }
	  length = start > end ? 0 : ((end - start) >>> 0);
	  start >>>= 0;

	  var result = Array(length);
	  while (++index < length) {
	    result[index] = array[index + start];
	  }
	  return result;
	}

	module.exports = baseSlice;


/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(118),
	    toObject = __webpack_require__(102);

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  var type = typeof value;
	  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
	    return true;
	  }
	  if (isArray(value)) {
	    return false;
	  }
	  var result = !reIsDeepProp.test(value);
	  return result || (object != null && value in toObject(object));
	}

	module.exports = isKey;


/***/ },
/* 141 */
/***/ function(module, exports) {

	/**
	 * Gets the last element of `array`.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to query.
	 * @returns {*} Returns the last element of `array`.
	 * @example
	 *
	 * _.last([1, 2, 3]);
	 * // => 3
	 */
	function last(array) {
	  var length = array ? array.length : 0;
	  return length ? array[length - 1] : undefined;
	}

	module.exports = last;


/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(143),
	    isArray = __webpack_require__(118);

	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `value` to property path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Array} Returns the property path array.
	 */
	function toPath(value) {
	  if (isArray(value)) {
	    return value;
	  }
	  var result = [];
	  baseToString(value).replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	}

	module.exports = toPath;


/***/ },
/* 143 */
/***/ function(module, exports) {

	/**
	 * Converts `value` to a string if it's not one. An empty string is returned
	 * for `null` or `undefined` values.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  return value == null ? '' : (value + '');
	}

	module.exports = baseToString;


/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(145);

	/**
	 * A specialized version of `baseCallback` which only supports `this` binding
	 * and specifying the number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {Function} func The function to bind.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function bindCallback(func, thisArg, argCount) {
	  if (typeof func != 'function') {
	    return identity;
	  }
	  if (thisArg === undefined) {
	    return func;
	  }
	  switch (argCount) {
	    case 1: return function(value) {
	      return func.call(thisArg, value);
	    };
	    case 3: return function(value, index, collection) {
	      return func.call(thisArg, value, index, collection);
	    };
	    case 4: return function(accumulator, value, index, collection) {
	      return func.call(thisArg, accumulator, value, index, collection);
	    };
	    case 5: return function(value, other, key, object, source) {
	      return func.call(thisArg, value, other, key, object, source);
	    };
	  }
	  return function() {
	    return func.apply(thisArg, arguments);
	  };
	}

	module.exports = bindCallback;


/***/ },
/* 145 */
/***/ function(module, exports) {

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	module.exports = identity;


/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(114),
	    basePropertyDeep = __webpack_require__(147),
	    isKey = __webpack_require__(140);

	/**
	 * Creates a function that returns the property value at `path` on a
	 * given object.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': { 'c': 2 } } },
	 *   { 'a': { 'b': { 'c': 1 } } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b.c'));
	 * // => [2, 1]
	 *
	 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
	 * // => [1, 2]
	 */
	function property(path) {
	  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
	}

	module.exports = property;


/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(138),
	    toPath = __webpack_require__(142);

	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function basePropertyDeep(path) {
	  var pathKey = (path + '');
	  path = toPath(path);
	  return function(object) {
	    return baseGet(object, path, pathKey);
	  };
	}

	module.exports = basePropertyDeep;


/***/ },
/* 148 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
	 * without support for callback shorthands and `this` binding, which iterates
	 * over `collection` using the provided `eachFunc`.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to search.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {Function} eachFunc The function to iterate over `collection`.
	 * @param {boolean} [retKey] Specify returning the key of the found element
	 *  instead of the element itself.
	 * @returns {*} Returns the found element or its key, else `undefined`.
	 */
	function baseFind(collection, predicate, eachFunc, retKey) {
	  var result;
	  eachFunc(collection, function(value, key, collection) {
	    if (predicate(value, key, collection)) {
	      result = retKey ? key : value;
	      return false;
	    }
	  });
	  return result;
	}

	module.exports = baseFind;


/***/ },
/* 149 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for callback shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseFindIndex(array, predicate, fromRight) {
	  var length = array.length,
	      index = fromRight ? length : -1;

	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}

	module.exports = baseFindIndex;


/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	var arrayMap = __webpack_require__(151),
	    baseDifference = __webpack_require__(152),
	    baseFlatten = __webpack_require__(159),
	    bindCallback = __webpack_require__(144),
	    keysIn = __webpack_require__(120),
	    pickByArray = __webpack_require__(161),
	    pickByCallback = __webpack_require__(162),
	    restParam = __webpack_require__(164);

	/**
	 * The opposite of `_.pick`; this method creates an object composed of the
	 * own and inherited enumerable properties of `object` that are not omitted.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The source object.
	 * @param {Function|...(string|string[])} [predicate] The function invoked per
	 *  iteration or property names to omit, specified as individual property
	 *  names or arrays of property names.
	 * @param {*} [thisArg] The `this` binding of `predicate`.
	 * @returns {Object} Returns the new object.
	 * @example
	 *
	 * var object = { 'user': 'fred', 'age': 40 };
	 *
	 * _.omit(object, 'age');
	 * // => { 'user': 'fred' }
	 *
	 * _.omit(object, _.isNumber);
	 * // => { 'user': 'fred' }
	 */
	var omit = restParam(function(object, props) {
	  if (object == null) {
	    return {};
	  }
	  if (typeof props[0] != 'function') {
	    var props = arrayMap(baseFlatten(props), String);
	    return pickByArray(object, baseDifference(keysIn(object), props));
	  }
	  var predicate = bindCallback(props[0], props[1], 3);
	  return pickByCallback(object, function(value, key, object) {
	    return !predicate(value, key, object);
	  });
	});

	module.exports = omit;


/***/ },
/* 151 */
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.map` for arrays without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	module.exports = arrayMap;


/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	var baseIndexOf = __webpack_require__(153),
	    cacheIndexOf = __webpack_require__(155),
	    createCache = __webpack_require__(156);

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * The base implementation of `_.difference` which accepts a single array
	 * of values to exclude.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Array} values The values to exclude.
	 * @returns {Array} Returns the new array of filtered values.
	 */
	function baseDifference(array, values) {
	  var length = array ? array.length : 0,
	      result = [];

	  if (!length) {
	    return result;
	  }
	  var index = -1,
	      indexOf = baseIndexOf,
	      isCommon = true,
	      cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
	      valuesLength = values.length;

	  if (cache) {
	    indexOf = cacheIndexOf;
	    isCommon = false;
	    values = cache;
	  }
	  outer:
	  while (++index < length) {
	    var value = array[index];

	    if (isCommon && value === value) {
	      var valuesIndex = valuesLength;
	      while (valuesIndex--) {
	        if (values[valuesIndex] === value) {
	          continue outer;
	        }
	      }
	      result.push(value);
	    }
	    else if (indexOf(values, value, 0) < 0) {
	      result.push(value);
	    }
	  }
	  return result;
	}

	module.exports = baseDifference;


/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	var indexOfNaN = __webpack_require__(154);

	/**
	 * The base implementation of `_.indexOf` without support for binary searches.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  if (value !== value) {
	    return indexOfNaN(array, fromIndex);
	  }
	  var index = fromIndex - 1,
	      length = array.length;

	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}

	module.exports = baseIndexOf;


/***/ },
/* 154 */
/***/ function(module, exports) {

	/**
	 * Gets the index at which the first occurrence of `NaN` is found in `array`.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
	 */
	function indexOfNaN(array, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 0 : -1);

	  while ((fromRight ? index-- : ++index < length)) {
	    var other = array[index];
	    if (other !== other) {
	      return index;
	    }
	  }
	  return -1;
	}

	module.exports = indexOfNaN;


/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(103);

	/**
	 * Checks if `value` is in `cache` mimicking the return signature of
	 * `_.indexOf` by returning `0` if the value is found, else `-1`.
	 *
	 * @private
	 * @param {Object} cache The cache to search.
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `0` if `value` is found, else `-1`.
	 */
	function cacheIndexOf(cache, value) {
	  var data = cache.data,
	      result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

	  return result ? 0 : -1;
	}

	module.exports = cacheIndexOf;


/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var SetCache = __webpack_require__(157),
	    getNative = __webpack_require__(108);

	/** Native method references. */
	var Set = getNative(global, 'Set');

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeCreate = getNative(Object, 'create');

	/**
	 * Creates a `Set` cache object to optimize linear searches of large arrays.
	 *
	 * @private
	 * @param {Array} [values] The values to cache.
	 * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
	 */
	function createCache(values) {
	  return (nativeCreate && Set) ? new SetCache(values) : null;
	}

	module.exports = createCache;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var cachePush = __webpack_require__(158),
	    getNative = __webpack_require__(108);

	/** Native method references. */
	var Set = getNative(global, 'Set');

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeCreate = getNative(Object, 'create');

	/**
	 *
	 * Creates a cache object to store unique values.
	 *
	 * @private
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var length = values ? values.length : 0;

	  this.data = { 'hash': nativeCreate(null), 'set': new Set };
	  while (length--) {
	    this.push(values[length]);
	  }
	}

	// Add functions to the `Set` cache.
	SetCache.prototype.push = cachePush;

	module.exports = SetCache;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(103);

	/**
	 * Adds `value` to the cache.
	 *
	 * @private
	 * @name push
	 * @memberOf SetCache
	 * @param {*} value The value to cache.
	 */
	function cachePush(value) {
	  var data = this.data;
	  if (typeof value == 'string' || isObject(value)) {
	    data.set.add(value);
	  } else {
	    data.hash[value] = true;
	  }
	}

	module.exports = cachePush;


/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	var arrayPush = __webpack_require__(160),
	    isArguments = __webpack_require__(117),
	    isArray = __webpack_require__(118),
	    isArrayLike = __webpack_require__(112),
	    isObjectLike = __webpack_require__(105);

	/**
	 * The base implementation of `_.flatten` with added support for restricting
	 * flattening and specifying the start index.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {boolean} [isDeep] Specify a deep flatten.
	 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, isDeep, isStrict, result) {
	  result || (result = []);

	  var index = -1,
	      length = array.length;

	  while (++index < length) {
	    var value = array[index];
	    if (isObjectLike(value) && isArrayLike(value) &&
	        (isStrict || isArray(value) || isArguments(value))) {
	      if (isDeep) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten(value, isDeep, isStrict, result);
	      } else {
	        arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	}

	module.exports = baseFlatten;


/***/ },
/* 160 */
/***/ function(module, exports) {

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;

	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}

	module.exports = arrayPush;


/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(102);

	/**
	 * A specialized version of `_.pick` which picks `object` properties specified
	 * by `props`.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {string[]} props The property names to pick.
	 * @returns {Object} Returns the new object.
	 */
	function pickByArray(object, props) {
	  object = toObject(object);

	  var index = -1,
	      length = props.length,
	      result = {};

	  while (++index < length) {
	    var key = props[index];
	    if (key in object) {
	      result[key] = object[key];
	    }
	  }
	  return result;
	}

	module.exports = pickByArray;


/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	var baseForIn = __webpack_require__(163);

	/**
	 * A specialized version of `_.pick` which picks `object` properties `predicate`
	 * returns truthy for.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Object} Returns the new object.
	 */
	function pickByCallback(object, predicate) {
	  var result = {};
	  baseForIn(object, function(value, key, object) {
	    if (predicate(value, key, object)) {
	      result[key] = value;
	    }
	  });
	  return result;
	}

	module.exports = pickByCallback;


/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(100),
	    keysIn = __webpack_require__(120);

	/**
	 * The base implementation of `_.forIn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForIn(object, iteratee) {
	  return baseFor(object, iteratee, keysIn);
	}

	module.exports = baseForIn;


/***/ },
/* 164 */
/***/ function(module, exports) {

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * Creates a function that invokes `func` with the `this` binding of the
	 * created function and arguments from `start` and beyond provided as an array.
	 *
	 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var say = _.restParam(function(what, names) {
	 *   return what + ' ' + _.initial(names).join(', ') +
	 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	 * });
	 *
	 * say('hello', 'fred', 'barney', 'pebbles');
	 * // => 'hello fred, barney, & pebbles'
	 */
	function restParam(func, start) {
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        rest = Array(length);

	    while (++index < length) {
	      rest[index] = args[start + index];
	    }
	    switch (start) {
	      case 0: return func.call(this, rest);
	      case 1: return func.call(this, args[0], rest);
	      case 2: return func.call(this, args[0], args[1], rest);
	    }
	    var otherArgs = Array(start + 1);
	    index = -1;
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = rest;
	    return func.apply(this, otherArgs);
	  };
	}

	module.exports = restParam;


/***/ },
/* 165 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = all;

	function all() {
	  for (var _len = arguments.length, propTypes = Array(_len), _key = 0; _key < _len; _key++) {
	    propTypes[_key] = arguments[_key];
	  }

	  if (propTypes === undefined) {
	    throw new Error('No validations provided');
	  }

	  if (propTypes.some(function (propType) {
	    return typeof propType !== 'function';
	  })) {
	    throw new Error('Invalid arguments, must be functions');
	  }

	  if (propTypes.length === 0) {
	    throw new Error('No validations provided');
	  }

	  return function validate(props, propName, componentName) {
	    for (var i = 0; i < propTypes.length; i++) {
	      var result = propTypes[i](props, propName, componentName);

	      if (result !== undefined && result !== null) {
	        return result;
	      }
	    }
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 166 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = isRequiredForA11y;

	function isRequiredForA11y(propType) {
	  return function validate(props, propName, componentName) {
	    if (props[propName] == null) {
	      return new Error("The prop '" + propName + "' is required to make '" + componentName + "' accessible" + " for users using assistive technologies such as screen readers");
	    }

	    return propType(props, propName, componentName);
	  };
	}

	module.exports = exports["default"];

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _createUncontrollable = __webpack_require__(168);

	var _createUncontrollable2 = _interopRequireDefault(_createUncontrollable);

	var mixin = {
	  shouldComponentUpdate: function shouldComponentUpdate() {
	    //let the forceUpdate trigger the update
	    return !this._notifying;
	  }
	};

	function set(component, propName, handler, value, args) {
	  if (handler) {
	    component._notifying = true;
	    handler.call.apply(handler, [component, value].concat(args));
	    component._notifying = false;
	  }

	  component._values[propName] = value;
	  component.forceUpdate();
	}

	exports['default'] = _createUncontrollable2['default']([mixin], set);
	module.exports = exports['default'];

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports['default'] = createUncontrollable;

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _utils = __webpack_require__(169);

	var utils = _interopRequireWildcard(_utils);

	function createUncontrollable(mixins, set) {

	  return uncontrollable;

	  function uncontrollable(Component, controlledValues) {
	    var methods = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

	    var displayName = Component.displayName || Component.name || 'Component',
	        basePropTypes = utils.getType(Component).propTypes,
	        propTypes;

	    propTypes = utils.uncontrolledPropTypes(controlledValues, basePropTypes, displayName);

	    methods = utils.transform(methods, function (obj, method) {
	      obj[method] = function () {
	        var _refs$inner;

	        return (_refs$inner = this.refs.inner)[method].apply(_refs$inner, arguments);
	      };
	    }, {});

	    var component = _react2['default'].createClass(_extends({

	      displayName: 'Uncontrolled(' + displayName + ')',

	      mixins: mixins,

	      propTypes: propTypes

	    }, methods, {

	      componentWillMount: function componentWillMount() {
	        var props = this.props,
	            keys = Object.keys(controlledValues);

	        this._values = utils.transform(keys, function (values, key) {
	          values[key] = props[utils.defaultKey(key)];
	        }, {});
	      },

	      /**
	       * If a prop switches from controlled to Uncontrolled
	       * reset its value to the defaultValue
	       */
	      componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        var _this = this;

	        var props = this.props,
	            keys = Object.keys(controlledValues);

	        keys.forEach(function (key) {
	          if (utils.getValue(nextProps, key) === undefined && utils.getValue(props, key) !== undefined) {
	            _this._values[key] = nextProps[utils.defaultKey(key)];
	          }
	        });
	      },

	      render: function render() {
	        var _this2 = this;

	        var newProps = {};
	        var _props = this.props;
	        var valueLink = _props.valueLink;
	        var checkedLink = _props.checkedLink;

	        var props = _objectWithoutProperties(_props, ['valueLink', 'checkedLink']);

	        utils.each(controlledValues, function (handle, propName) {
	          var linkPropName = utils.getLinkName(propName),
	              prop = _this2.props[propName];

	          if (linkPropName && !isProp(_this2.props, propName) && isProp(_this2.props, linkPropName)) {
	            prop = _this2.props[linkPropName].value;
	          }

	          newProps[propName] = prop !== undefined ? prop : _this2._values[propName];

	          newProps[handle] = setAndNotify.bind(_this2, propName);
	        });

	        newProps = _extends({}, props, newProps, { ref: 'inner' });

	        return _react2['default'].createElement(Component, newProps);
	      }

	    }));

	    component.ControlledComponent = Component;

	    return component;

	    function setAndNotify(propName, value) {
	      var linkName = utils.getLinkName(propName),
	          handler = this.props[controlledValues[propName]];

	      if (linkName && isProp(this.props, linkName) && !handler) {
	        handler = this.props[linkName].requestChange;
	      }

	      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	        args[_key - 2] = arguments[_key];
	      }

	      set(this, propName, handler, value, args);
	    }

	    function isProp(props, prop) {
	      return props[prop] !== undefined;
	    }
	  }
	}

	module.exports = exports['default'];

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;
	exports.customPropType = customPropType;
	exports.uncontrolledPropTypes = uncontrolledPropTypes;
	exports.getType = getType;
	exports.getValue = getValue;
	exports.getLinkName = getLinkName;
	exports.defaultKey = defaultKey;
	exports.chain = chain;
	exports.transform = transform;
	exports.each = each;
	exports.has = has;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _invariant = __webpack_require__(170);

	var _invariant2 = _interopRequireDefault(_invariant);

	function customPropType(handler, propType, name) {

	  return function (props, propName) {

	    if (props[propName] !== undefined) {
	      if (!props[handler]) {
	        return new Error('You have provided a `' + propName + '` prop to ' + '`' + name + '` without an `' + handler + '` handler. This will render a read-only field. ' + 'If the field should be mutable use `' + defaultKey(propName) + '`. Otherwise, set `' + handler + '`');
	      }

	      return propType && propType(props, propName, name);
	    }
	  };
	}

	function uncontrolledPropTypes(controlledValues, basePropTypes, displayName) {
	  var propTypes = {};

	  if (process.env.NODE_ENV !== 'production' && basePropTypes) {
	    transform(controlledValues, function (obj, handler, prop) {
	      var type = basePropTypes[prop];

	      _invariant2['default'](typeof handler === 'string' && handler.trim().length, 'Uncontrollable - [%s]: the prop `%s` needs a valid handler key name in order to make it uncontrollable', displayName, prop);

	      obj[prop] = customPropType(handler, type, displayName);

	      if (type !== undefined) obj[defaultKey(prop)] = type;
	    }, propTypes);
	  }

	  return propTypes;
	}

	var version = _react2['default'].version.split('.').map(parseFloat);

	exports.version = version;

	function getType(component) {
	  if (version[0] === 0 && version[1] >= 13) return component;

	  return component.type;
	}

	function getValue(props, name) {
	  var linkPropName = getLinkName(name);

	  if (linkPropName && !isProp(props, name) && isProp(props, linkPropName)) return props[linkPropName].value;

	  return props[name];
	}

	function isProp(props, prop) {
	  return props[prop] !== undefined;
	}

	function getLinkName(name) {
	  return name === 'value' ? 'valueLink' : name === 'checked' ? 'checkedLink' : null;
	}

	function defaultKey(key) {
	  return 'default' + key.charAt(0).toUpperCase() + key.substr(1);
	}

	function chain(thisArg, a, b) {
	  return function chainedFunction() {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    a && a.call.apply(a, [thisArg].concat(args));
	    b && b.call.apply(b, [thisArg].concat(args));
	  };
	}

	function transform(obj, cb, seed) {
	  each(obj, cb.bind(null, seed = seed || (Array.isArray(obj) ? [] : {})));
	  return seed;
	}

	function each(obj, cb, thisArg) {
	  if (Array.isArray(obj)) return obj.forEach(cb, thisArg);

	  for (var key in obj) if (has(obj, key)) cb.call(thisArg, obj[key], key, obj);
	}

	function has(o, k) {
	  return o ? Object.prototype.hasOwnProperty.call(o, k) : false;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(72)))

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        'Invariant Violation: ' +
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(72)))

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _BootstrapMixin = __webpack_require__(74);

	var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

	var _reactPropTypesLibAll = __webpack_require__(165);

	var _reactPropTypesLibAll2 = _interopRequireDefault(_reactPropTypesLibAll);

	var ButtonGroup = _react2['default'].createClass({
	  displayName: 'ButtonGroup',

	  mixins: [_BootstrapMixin2['default']],

	  propTypes: {
	    vertical: _react2['default'].PropTypes.bool,
	    justified: _react2['default'].PropTypes.bool,
	    /**
	     * Display block buttons, only useful when used with the "vertical" prop.
	     * @type {bool}
	     */
	    block: _reactPropTypesLibAll2['default'](_react2['default'].PropTypes.bool, function (props) {
	      if (props.block && !props.vertical) {
	        return new Error('The block property requires the vertical property to be set to have any effect');
	      }
	    })
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      block: false,
	      bsClass: 'button-group',
	      justified: false,
	      vertical: false
	    };
	  },

	  render: function render() {
	    var classes = this.getBsClassSet();
	    classes['btn-group'] = !this.props.vertical;
	    classes['btn-group-vertical'] = this.props.vertical;
	    classes['btn-group-justified'] = this.props.justified;
	    classes['btn-block'] = this.props.block;

	    return _react2['default'].createElement(
	      'div',
	      _extends({}, this.props, {
	        className: _classnames2['default'](this.props.className, classes) }),
	      this.props.children
	    );
	  }
	});

	exports['default'] = ButtonGroup;
	module.exports = exports['default'];

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inherits = __webpack_require__(56)['default'];

	var _classCallCheck = __webpack_require__(66)['default'];

	var _objectWithoutProperties = __webpack_require__(27)['default'];

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _keycode = __webpack_require__(96);

	var _keycode2 = _interopRequireDefault(_keycode);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _reactOverlaysLibRootCloseWrapper = __webpack_require__(173);

	var _reactOverlaysLibRootCloseWrapper2 = _interopRequireDefault(_reactOverlaysLibRootCloseWrapper);

	var _utilsValidComponentChildren = __webpack_require__(90);

	var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

	var _utilsCreateChainedFunction = __webpack_require__(45);

	var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

	var DropdownMenu = (function (_React$Component) {
	  _inherits(DropdownMenu, _React$Component);

	  function DropdownMenu(props) {
	    _classCallCheck(this, DropdownMenu);

	    _React$Component.call(this, props);

	    this.focusNext = this.focusNext.bind(this);
	    this.focusPrevious = this.focusPrevious.bind(this);
	    this.getFocusableMenuItems = this.getFocusableMenuItems.bind(this);
	    this.getItemsAndActiveIndex = this.getItemsAndActiveIndex.bind(this);

	    this.handleKeyDown = this.handleKeyDown.bind(this);
	  }

	  DropdownMenu.prototype.handleKeyDown = function handleKeyDown(event) {
	    switch (event.keyCode) {
	      case _keycode2['default'].codes.down:
	        this.focusNext();
	        event.preventDefault();
	        break;
	      case _keycode2['default'].codes.up:
	        this.focusPrevious();
	        event.preventDefault();
	        break;
	      case _keycode2['default'].codes.esc:
	      case _keycode2['default'].codes.tab:
	        this.props.onClose(event);
	        break;
	      default:
	    }
	  };

	  DropdownMenu.prototype.focusNext = function focusNext() {
	    var _getItemsAndActiveIndex = this.getItemsAndActiveIndex();

	    var items = _getItemsAndActiveIndex.items;
	    var activeItemIndex = _getItemsAndActiveIndex.activeItemIndex;

	    if (items.length === 0) {
	      return;
	    }

	    if (activeItemIndex === items.length - 1) {
	      items[0].focus();
	      return;
	    }

	    items[activeItemIndex + 1].focus();
	  };

	  DropdownMenu.prototype.focusPrevious = function focusPrevious() {
	    var _getItemsAndActiveIndex2 = this.getItemsAndActiveIndex();

	    var items = _getItemsAndActiveIndex2.items;
	    var activeItemIndex = _getItemsAndActiveIndex2.activeItemIndex;

	    if (activeItemIndex === 0) {
	      items[items.length - 1].focus();
	      return;
	    }

	    items[activeItemIndex - 1].focus();
	  };

	  DropdownMenu.prototype.getItemsAndActiveIndex = function getItemsAndActiveIndex() {
	    var items = this.getFocusableMenuItems();
	    var activeElement = document.activeElement;
	    var activeItemIndex = items.indexOf(activeElement);

	    return { items: items, activeItemIndex: activeItemIndex };
	  };

	  DropdownMenu.prototype.getFocusableMenuItems = function getFocusableMenuItems() {
	    var menuNode = _reactDom2['default'].findDOMNode(this);

	    if (menuNode === undefined) {
	      return [];
	    }

	    return [].slice.call(menuNode.querySelectorAll('[tabIndex="-1"]'), 0);
	  };

	  DropdownMenu.prototype.render = function render() {
	    var _this = this;

	    var _props = this.props;
	    var children = _props.children;
	    var onSelect = _props.onSelect;
	    var pullRight = _props.pullRight;
	    var className = _props.className;
	    var labelledBy = _props.labelledBy;
	    var open = _props.open;
	    var onClose = _props.onClose;

	    var props = _objectWithoutProperties(_props, ['children', 'onSelect', 'pullRight', 'className', 'labelledBy', 'open', 'onClose']);

	    var items = _utilsValidComponentChildren2['default'].map(children, function (child) {
	      var childProps = child.props || {};

	      return _react2['default'].cloneElement(child, {
	        onKeyDown: _utilsCreateChainedFunction2['default'](childProps.onKeyDown, _this.handleKeyDown),
	        onSelect: _utilsCreateChainedFunction2['default'](childProps.onSelect, onSelect)
	      }, childProps.children);
	    });

	    var classes = {
	      'dropdown-menu': true,
	      'dropdown-menu-right': pullRight
	    };

	    var list = _react2['default'].createElement(
	      'ul',
	      _extends({
	        className: _classnames2['default'](className, classes),
	        role: 'menu',
	        'aria-labelledby': labelledBy
	      }, props),
	      items
	    );

	    if (open) {
	      list = _react2['default'].createElement(
	        _reactOverlaysLibRootCloseWrapper2['default'],
	        { noWrap: true, onRootClose: onClose },
	        list
	      );
	    }

	    return list;
	  };

	  return DropdownMenu;
	})(_react2['default'].Component);

	DropdownMenu.defaultProps = {
	  bsRole: 'menu',
	  pullRight: false
	};

	DropdownMenu.propTypes = {
	  open: _react2['default'].PropTypes.bool,
	  pullRight: _react2['default'].PropTypes.bool,
	  onClose: _react2['default'].PropTypes.func,
	  labelledBy: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
	  onSelect: _react2['default'].PropTypes.func
	};

	exports['default'] = DropdownMenu;
	module.exports = exports['default'];

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _utilsAddEventListener = __webpack_require__(174);

	var _utilsAddEventListener2 = _interopRequireDefault(_utilsAddEventListener);

	var _utilsCreateChainedFunction = __webpack_require__(176);

	var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

	var _utilsOwnerDocument = __webpack_require__(53);

	var _utilsOwnerDocument2 = _interopRequireDefault(_utilsOwnerDocument);

	// TODO: Consider using an ES6 symbol here, once we use babel-runtime.
	var CLICK_WAS_INSIDE = '__click_was_inside';

	var counter = 0;

	function getSuppressRootClose() {
	  var id = CLICK_WAS_INSIDE + '_' + counter++;
	  return {
	    id: id,
	    suppressRootClose: function suppressRootClose(event) {
	      // Tag the native event to prevent the root close logic on document click.
	      // This seems safer than using event.nativeEvent.stopImmediatePropagation(),
	      // which is only supported in IE >= 9.
	      event.nativeEvent[id] = true;
	    }
	  };
	}

	var RootCloseWrapper = (function (_React$Component) {
	  function RootCloseWrapper(props) {
	    _classCallCheck(this, RootCloseWrapper);

	    _React$Component.call(this, props);

	    this.handleDocumentClick = this.handleDocumentClick.bind(this);
	    this.handleDocumentKeyUp = this.handleDocumentKeyUp.bind(this);

	    var _getSuppressRootClose = getSuppressRootClose();

	    var id = _getSuppressRootClose.id;
	    var suppressRootClose = _getSuppressRootClose.suppressRootClose;

	    this._suppressRootId = id;

	    this._suppressRootCloseHandler = suppressRootClose;
	  }

	  _inherits(RootCloseWrapper, _React$Component);

	  RootCloseWrapper.prototype.bindRootCloseHandlers = function bindRootCloseHandlers() {
	    var doc = _utilsOwnerDocument2['default'](this);

	    this._onDocumentClickListener = _utilsAddEventListener2['default'](doc, 'click', this.handleDocumentClick);

	    this._onDocumentKeyupListener = _utilsAddEventListener2['default'](doc, 'keyup', this.handleDocumentKeyUp);
	  };

	  RootCloseWrapper.prototype.handleDocumentClick = function handleDocumentClick(e) {
	    // This is now the native event.
	    if (e[this._suppressRootId]) {
	      return;
	    }

	    this.props.onRootClose();
	  };

	  RootCloseWrapper.prototype.handleDocumentKeyUp = function handleDocumentKeyUp(e) {
	    if (e.keyCode === 27) {
	      this.props.onRootClose();
	    }
	  };

	  RootCloseWrapper.prototype.unbindRootCloseHandlers = function unbindRootCloseHandlers() {
	    if (this._onDocumentClickListener) {
	      this._onDocumentClickListener.remove();
	    }

	    if (this._onDocumentKeyupListener) {
	      this._onDocumentKeyupListener.remove();
	    }
	  };

	  RootCloseWrapper.prototype.componentDidMount = function componentDidMount() {
	    this.bindRootCloseHandlers();
	  };

	  RootCloseWrapper.prototype.render = function render() {
	    var _props = this.props;
	    var noWrap = _props.noWrap;
	    var children = _props.children;

	    var child = _react2['default'].Children.only(children);

	    if (noWrap) {
	      return _react2['default'].cloneElement(child, {
	        onClick: _utilsCreateChainedFunction2['default'](this._suppressRootCloseHandler, child.props.onClick)
	      });
	    }

	    // Wrap the child in a new element, so the child won't have to handle
	    // potentially combining multiple onClick listeners.
	    return _react2['default'].createElement(
	      'div',
	      { onClick: this._suppressRootCloseHandler },
	      child
	    );
	  };

	  RootCloseWrapper.prototype.getWrappedDOMNode = function getWrappedDOMNode() {
	    // We can't use a ref to identify the wrapped child, since we might be
	    // stealing the ref from the owner, but we know exactly the DOM structure
	    // that will be rendered, so we can just do this to get the child's DOM
	    // node for doing size calculations in OverlayMixin.
	    var node = _reactDom2['default'].findDOMNode(this);
	    return this.props.noWrap ? node : node.firstChild;
	  };

	  RootCloseWrapper.prototype.componentWillUnmount = function componentWillUnmount() {
	    this.unbindRootCloseHandlers();
	  };

	  return RootCloseWrapper;
	})(_react2['default'].Component);

	exports['default'] = RootCloseWrapper;

	RootCloseWrapper.displayName = 'RootCloseWrapper';

	RootCloseWrapper.propTypes = {
	  onRootClose: _react2['default'].PropTypes.func.isRequired,

	  /**
	   * Passes the suppress click handler directly to the child component instead
	   * of placing it on a wrapping div. Only use when you can be sure the child
	   * properly handle the click event.
	   */
	  noWrap: _react2['default'].PropTypes.bool
	};
	module.exports = exports['default'];

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _domHelpersEventsOn = __webpack_require__(69);

	var _domHelpersEventsOn2 = _interopRequireDefault(_domHelpersEventsOn);

	var _domHelpersEventsOff = __webpack_require__(175);

	var _domHelpersEventsOff2 = _interopRequireDefault(_domHelpersEventsOff);

	exports['default'] = function (node, event, handler) {
	  _domHelpersEventsOn2['default'](node, event, handler);
	  return {
	    remove: function remove() {
	      _domHelpersEventsOff2['default'](node, event, handler);
	    }
	  };
	};

	module.exports = exports['default'];

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var canUseDOM = __webpack_require__(43);
	var off = function off() {};

	if (canUseDOM) {

	  off = (function () {

	    if (document.addEventListener) return function (node, eventName, handler, capture) {
	      return node.removeEventListener(eventName, handler, capture || false);
	    };else if (document.attachEvent) return function (node, eventName, handler) {
	      return node.detachEvent('on' + eventName, handler);
	    };
	  })();
	}

	module.exports = off;

/***/ },
/* 176 */
/***/ function(module, exports) {

	/**
	 * Safe chained function
	 *
	 * Will only create a new function if needed,
	 * otherwise will pass back existing functions or null.
	 *
	 * @param {function} functions to chain
	 * @returns {function|null}
	 */
	'use strict';

	exports.__esModule = true;
	function createChainedFunction() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }

	  return funcs.filter(function (f) {
	    return f != null;
	  }).reduce(function (acc, f) {
	    if (typeof f !== 'function') {
	      throw new Error('Invalid Argument Type, must only provide functions, undefined, or null.');
	    }

	    if (acc === null) {
	      return f;
	    }

	    return function chainedFunction() {
	      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      acc.apply(this, args);
	      f.apply(this, args);
	    };
	  }, null);
	}

	exports['default'] = createChainedFunction;
	module.exports = exports['default'];

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inherits = __webpack_require__(56)['default'];

	var _classCallCheck = __webpack_require__(66)['default'];

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _Button = __webpack_require__(81);

	var _Button2 = _interopRequireDefault(_Button);

	var _SafeAnchor = __webpack_require__(178);

	var _SafeAnchor2 = _interopRequireDefault(_SafeAnchor);

	var CARET = _react2['default'].createElement(
	  'span',
	  null,
	  ' ',
	  _react2['default'].createElement('span', { className: 'caret' })
	);

	var DropdownToggle = (function (_React$Component) {
	  _inherits(DropdownToggle, _React$Component);

	  function DropdownToggle() {
	    _classCallCheck(this, DropdownToggle);

	    _React$Component.apply(this, arguments);
	  }

	  DropdownToggle.prototype.render = function render() {
	    var caret = this.props.noCaret ? null : CARET;

	    var classes = {
	      'dropdown-toggle': true
	    };

	    var Component = this.props.useAnchor ? _SafeAnchor2['default'] : _Button2['default'];

	    return _react2['default'].createElement(
	      Component,
	      _extends({}, this.props, {
	        className: _classnames2['default'](classes, this.props.className),
	        type: 'button',
	        'aria-haspopup': true,
	        'aria-expanded': this.props.open }),
	      this.props.children || this.props.title,
	      caret
	    );
	  };

	  return DropdownToggle;
	})(_react2['default'].Component);

	exports['default'] = DropdownToggle;

	DropdownToggle.defaultProps = {
	  open: false,
	  useAnchor: false,
	  bsRole: 'toggle'
	};

	DropdownToggle.propTypes = {
	  bsRole: _react2['default'].PropTypes.string,
	  noCaret: _react2['default'].PropTypes.bool,
	  open: _react2['default'].PropTypes.bool,
	  title: _react2['default'].PropTypes.string,
	  useAnchor: _react2['default'].PropTypes.bool
	};

	DropdownToggle.isToggle = true;
	DropdownToggle.titleProp = 'title';
	DropdownToggle.onClickProp = 'onClick';
	module.exports = exports['default'];

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inherits = __webpack_require__(56)['default'];

	var _classCallCheck = __webpack_require__(66)['default'];

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _utilsCreateChainedFunction = __webpack_require__(45);

	var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

	/**
	 * Note: This is intended as a stop-gap for accessibility concerns that the
	 * Bootstrap CSS does not address as they have styled anchors and not buttons
	 * in many cases.
	 */

	var SafeAnchor = (function (_React$Component) {
	  _inherits(SafeAnchor, _React$Component);

	  function SafeAnchor(props) {
	    _classCallCheck(this, SafeAnchor);

	    _React$Component.call(this, props);

	    this.handleClick = this.handleClick.bind(this);
	  }

	  SafeAnchor.prototype.handleClick = function handleClick(event) {
	    if (this.props.href === undefined) {
	      event.preventDefault();
	    }
	  };

	  SafeAnchor.prototype.render = function render() {
	    return _react2['default'].createElement('a', _extends({ role: this.props.href ? undefined : 'button'
	    }, this.props, {
	      onClick: _utilsCreateChainedFunction2['default'](this.props.onClick, this.handleClick),
	      href: this.props.href || '' }));
	  };

	  return SafeAnchor;
	})(_react2['default'].Component);

	exports['default'] = SafeAnchor;

	SafeAnchor.propTypes = {
	  href: _react2['default'].PropTypes.string,
	  onClick: _react2['default'].PropTypes.func
	};
	module.exports = exports['default'];

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _reactPropTypesLibCommon = __webpack_require__(47);

	var _childrenToArray = __webpack_require__(180);

	var _childrenToArray2 = _interopRequireDefault(_childrenToArray);

	exports['default'] = {

	  requiredRoles: function requiredRoles() {
	    for (var _len = arguments.length, roles = Array(_len), _key = 0; _key < _len; _key++) {
	      roles[_key] = arguments[_key];
	    }

	    return _reactPropTypesLibCommon.createChainableTypeChecker(function requiredRolesValidator(props, propName, component) {
	      var missing = undefined;
	      var children = _childrenToArray2['default'](props.children);

	      var inRole = function inRole(role, child) {
	        return role === child.props.bsRole;
	      };

	      roles.every(function (role) {
	        if (!children.some(function (child) {
	          return inRole(role, child);
	        })) {
	          missing = role;
	          return false;
	        }
	        return true;
	      });

	      if (missing) {
	        return new Error('(children) ' + component + ' - Missing a required child with bsRole: ' + missing + '. ' + (component + ' must have at least one child of each of the following bsRoles: ' + roles.join(', ')));
	      }
	    });
	  },

	  exclusiveRoles: function exclusiveRoles() {
	    for (var _len2 = arguments.length, roles = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      roles[_key2] = arguments[_key2];
	    }

	    return _reactPropTypesLibCommon.createChainableTypeChecker(function exclusiveRolesValidator(props, propName, component) {
	      var children = _childrenToArray2['default'](props.children);
	      var duplicate = undefined;

	      roles.every(function (role) {
	        var childrenWithRole = children.filter(function (child) {
	          return child.props.bsRole === role;
	        });

	        if (childrenWithRole.length > 1) {
	          duplicate = role;
	          return false;
	        }
	        return true;
	      });

	      if (duplicate) {
	        return new Error('(children) ' + component + ' - Duplicate children detected of bsRole: ' + duplicate + '. ' + ('Only one child each allowed with the following bsRoles: ' + roles.join(', ')));
	      }
	    });
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;
	exports['default'] = childrenAsArray;

	var _ValidComponentChildren = __webpack_require__(90);

	var _ValidComponentChildren2 = _interopRequireDefault(_ValidComponentChildren);

	function childrenAsArray(children) {
	  var result = [];

	  if (children === undefined) {
	    return result;
	  }

	  _ValidComponentChildren2['default'].forEach(children, function (child) {
	    result.push(child);
	  });

	  return result;
	}

	module.exports = exports['default'];

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _inherits = __webpack_require__(56)['default'];

	var _classCallCheck = __webpack_require__(66)['default'];

	var _objectWithoutProperties = __webpack_require__(27)['default'];

	var _extends = __webpack_require__(13)['default'];

	var _interopRequireDefault = __webpack_require__(36)['default'];

	exports.__esModule = true;

	var _classnames = __webpack_require__(37);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactPropTypesLibAll = __webpack_require__(165);

	var _reactPropTypesLibAll2 = _interopRequireDefault(_reactPropTypesLibAll);

	var _SafeAnchor = __webpack_require__(178);

	var _SafeAnchor2 = _interopRequireDefault(_SafeAnchor);

	var _utilsCreateChainedFunction = __webpack_require__(45);

	var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

	var MenuItem = (function (_React$Component) {
	  _inherits(MenuItem, _React$Component);

	  function MenuItem(props) {
	    _classCallCheck(this, MenuItem);

	    _React$Component.call(this, props);

	    this.handleClick = this.handleClick.bind(this);
	  }

	  MenuItem.prototype.handleClick = function handleClick(event) {
	    if (!this.props.href || this.props.disabled) {
	      event.preventDefault();
	    }

	    if (this.props.disabled) {
	      return;
	    }

	    if (this.props.onSelect) {
	      this.props.onSelect(event, this.props.eventKey);
	    }
	  };

	  MenuItem.prototype.render = function render() {
	    if (this.props.divider) {
	      return _react2['default'].createElement('li', { role: 'separator', className: 'divider' });
	    }

	    if (this.props.header) {
	      return _react2['default'].createElement(
	        'li',
	        { role: 'heading', className: 'dropdown-header' },
	        this.props.children
	      );
	    }

	    var _props = this.props;
	    var className = _props.className;
	    var style = _props.style;
	    var onClick = _props.onClick;

	    var props = _objectWithoutProperties(_props, ['className', 'style', 'onClick']);

	    var classes = {
	      disabled: this.props.disabled,
	      active: this.props.active
	    };

	    return _react2['default'].createElement(
	      'li',
	      { role: 'presentation',
	        className: _classnames2['default'](className, classes),
	        style: style
	      },
	      _react2['default'].createElement(_SafeAnchor2['default'], _extends({}, props, {
	        role: 'menuitem',
	        tabIndex: '-1',
	        onClick: _utilsCreateChainedFunction2['default'](onClick, this.handleClick)
	      }))
	    );
	  };

	  return MenuItem;
	})(_react2['default'].Component);

	exports['default'] = MenuItem;

	MenuItem.propTypes = {
	  active: _react2['default'].PropTypes.bool,
	  disabled: _react2['default'].PropTypes.bool,
	  divider: _reactPropTypesLibAll2['default'](_react2['default'].PropTypes.bool, function (props) {
	    if (props.divider && props.children) {
	      return new Error('Children will not be rendered for dividers');
	    }
	  }),
	  eventKey: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.number, _react2['default'].PropTypes.string]),
	  header: _react2['default'].PropTypes.bool,
	  href: _react2['default'].PropTypes.string,
	  target: _react2['default'].PropTypes.string,
	  title: _react2['default'].PropTypes.string,
	  onClick: _react2['default'].PropTypes.func,
	  onKeyDown: _react2['default'].PropTypes.func,
	  onSelect: _react2['default'].PropTypes.func,
	  id: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number])
	};

	MenuItem.defaultProps = {
	  divider: false,
	  disabled: false,
	  header: false
	};
	module.exports = exports['default'];

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var Radium = __webpack_require__(4);

	var Sliders = React.createClass({
	    displayName: 'Sliders',

	    lock: function lock(event) {
	        this.swiper.params.allowSwipeToNext = !this.swiper.params.allowSwipeToNext;
	        this.swiper.params.allowSwipeToPrev = !this.swiper.params.allowSwipeToPrev;
	    },

	    componentDidMount: function componentDidMount() {
	        this.swiper = new Swiper('.swiper-container', {
	            onTouchStart: (function (swiper, event) {
	                this.props.onTouchStart();
	            }).bind(this),
	            onTouchEnd: (function (swiper, event) {
	                this.props.onTouchEnd();
	            }).bind(this)
	        });
	    },

	    render: function render() {
	        return React.createElement(
	            'div',
	            { style: styles.container, className: 'swiper-container' },
	            React.createElement(
	                'div',
	                { className: 'swiper-wrapper' },
	                this.props.children.map(function (child, index) {
	                    return React.createElement(
	                        'div',
	                        { key: index, style: styles.slide, className: 'swiper-slide' },
	                        child
	                    );
	                })
	            )
	        );
	    }
	});

	Sliders.Lock = Radium(React.createClass({

	    getInitialState: function getInitialState() {
	        return {
	            locked: false
	        };
	    },

	    handleClick: function handleClick(event) {
	        this.setState({ locked: !this.state.locked });
	        this.props.onToggle();
	    },

	    render: function render() {
	        var lockState = this.state.locked ? styles.locked : styles.unlocked;

	        return React.createElement('button', {
	            onClick: this.handleClick,
	            style: [styles.lockButton, lockState] });
	    }
	}));

	var styles = {

	    container: {
	        height: '100%',
	        background: '#ddd'
	    },

	    slide: {
	        '@media screen and (orientation:portrait)': {
	            background: '-webkit-linear-gradient(right, rgba(226,226,226,1) 0%,rgba(221,221,221,1) 0%,rgba(255,255,255,1) 30%,rgba(255,255,255,1) 100%)'
	        },
	        '@media screen and (orientation:landscape)': {
	            background: '-webkit-linear-gradient(left, rgba(226,226,226,1) 0%,rgba(221,221,221,1) 0%,rgba(255,255,255,1) 30%,rgba(255,255,255,1) 100%)'
	        }
	    },

	    locked: {
	        backgroundImage: "url('img/locked.png')"
	    },

	    unlocked: {
	        backgroundImage: "url('img/unlocked.png')"
	    },

	    lockButton: {
	        overflow: 'hidden',
	        textAlign: 'center',
	        color: 'rgb(0, 0, 0)',
	        fontFamily: '"Roboto", Arial, sans-serif',
	        WebkitUserSelect: 'none',
	        fontSize: '11px !important',
	        backgroundColor: 'rgb(255, 255, 255)',
	        padding: '1px 6px',
	        borderBottomLeftRadius: '2px',
	        borderTopLeftRadius: '2px',
	        WebkitBackgroundClip: 'padding-box',
	        backgroundClip: 'padding-box',
	        border: '1px solid rgba(0, 0, 0, 0.14902)',
	        WebkitBoxShadow: 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px',
	        boxShadow: 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px',
	        minWidth: '37px',
	        minHeight: '37px',
	        fontWeight: '500',
	        backgroundSize: 'contain',
	        position: 'relative',
	        float: 'right',
	        margin: '10px',
	        outline: 'none'
	    }
	};

	module.exports = Radium(Sliders);

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	var Radium = __webpack_require__(4);

	var JumboMeter = React.createClass({
	    displayName: 'JumboMeter',

	    render: function render() {
	        var value = parseFloat(this.props.value).toFixed(this.props.precision);

	        return React.createElement(
	            'div',
	            { style: styles.container },
	            React.createElement('meter', {
	                style: styles.meter,
	                min: this.props.min,
	                max: this.props.max,
	                low: this.props.low,
	                high: this.props.high,
	                optimum: this.props.optimum,
	                value: this.props.value }),
	            React.createElement(
	                'div',
	                { style: styles.value },
	                value,
	                ' ',
	                this.props.units
	            )
	        );
	    }
	});

	var styles = {

	    container: {
	        height: '100%',
	        position: 'relative'
	    },

	    meter: {
	        background: '#ccc',
	        WebkitAppearance: 'none',
	        appearance: 'none',
	        width: '100%',
	        height: '100%',
	        display: 'block'
	    },

	    value: {
	        fontSize: '5vh',
	        fontWeight: 'bold',
	        position: 'absolute',
	        top: '-1vh',
	        right: '0'
	    }
	};

	module.exports = Radium(JumboMeter);

/***/ },
/* 184 */
/***/ function(module, exports) {

	module.exports = function() {

		function randInt(ceiling) {
			return Math.round(Math.random() * ceiling);
		}

		function randFloat(floor, ceiling, decimals) {
			return parseFloat(Math.random().map(0, 1, floor, ceiling).toFixed(decimals));
		}

		this.temp_mos1 = 0.0;
		this.temp_mos3 = 0.0;
		this.temp_mos2 = 0.0;
		this.temp_mos4 = 0.0;
		this.temp_mos5 = 0.0;
		this.temp_mos6 = 0.0;
		this.temp_pcb = 0.0;
	    this.temp_motor = 0.0;
		this.current_motor = 0.0;
		this.current_in = 0.0;
		this.duty_now = 0.0;
		this.rpm = 0.0;
		this.v_in = 0.0;
		this.amp_hours = 0.0;
		this.amp_hours_charged = 0.0;
		this.watt_hours = 0.0;
		this.watt_hours_charged = 0.0;
		this.tachometer = 0;
		this.tachometer_abs = 0;

		this.temp_battery = 0.0;
	    this.odometer = 0.0;
	    this.speed = 0;
	    this.power = 0;
	    this.throttle_v = 0.0;
		this.fault_code = '';

		this.randomize = function() {
			this.temp_mos1          = randFloat(20, 120, 0);
			this.temp_mos3          = randFloat(20, 120, 0);
			this.temp_mos2          = randFloat(20, 120, 0);
			this.temp_mos4          = randFloat(20, 120, 0);
			this.temp_mos5          = randFloat(20, 120, 0);
			this.temp_mos6          = randFloat(20, 120, 0);
			this.temp_pcb           = randFloat(20, 120, 0);
	        this.temp_motor         = randFloat(20, 120, 0);
			this.current_motor      = randFloat(20, 120, 1);
			this.current_in         = randFloat(0, 100, 1);
			this.duty_now           = randFloat(0, 100, 0);
			this.rpm                = randFloat(0, 1000, 0);
			this.v_in               = randFloat(12.0, 16.8, 1);
			this.amp_hours          = randFloat(0, 20, 1);
			this.amp_hours_charged  = randFloat(0, 20, 1);
			this.watt_hours         = randFloat(0, 500, 1);
			this.watt_hours_charged = randFloat(0, 500, 1);
			this.tachometer         = randInt(1000);
			this.tachometer_abs     = randInt(1000);

			this.temp_battery 		= randFloat(20, 80, 0);
	        this.odometer           = randFloat(0, 100, 1);
	        this.speed              = randFloat(-50, 100, 0);
	        this.power              = randFloat(-1000, 1000, 0);
	        this.throttle_v         = randFloat(0, 5, 1);
		}
	}


/***/ },
/* 185 */
/***/ function(module, exports) {

	module.exports = (function() {
	    var currPacket = [];
	    var data       = {};
	    var listening  = false;

	    var FAULT_CODES = [
	        "FAULT_CODE_NONE",
	        "FAULT_CODE_OVER_VOLTAGE",
	        "FAULT_CODE_UNDER_VOLTAGE",
	        "FAULT_CODE_DRV8302",
	        "FAULT_CODE_ABS_OVER_CURRENT",
	        "FAULT_CODE_OVER_TEMP_FET",
	        "FAULT_CODE_OVER_TEMP_MOTOR"
	    ];

	    var COMM_PACKET_ID = {
	        COMM_FW_VERSION:          0,
	        COMM_JUMP_TO_BOOTLOADER:  1,
	        COMM_ERASE_NEW_APP:       2,
	        COMM_WRITE_NEW_APP_DATA:  3,
	        COMM_GET_VALUES:          4,
	        COMM_SET_DUTY:            5,
	        COMM_SET_CURRENT:         6,
	        COMM_SET_CURRENT_BRAKE:   7,
	        COMM_SET_RPM:             8,
	        COMM_SET_POS:             9,
	        COMM_SET_DETECT:         10,
	        COMM_SET_SERVO_POS:      11,
	        COMM_SET_MCCONF:         12,
	        COMM_GET_MCCONF:         13,
	        COMM_SET_APPCONF:        14,
	        COMM_GET_APPCONF:        15,
	        COMM_SAMPLE_PRINT:       16,
	        COMM_TERMINAL_CMD:       17,
	        COMM_PRINT:              18,
	        COMM_ROTOR_POSITION:     19,
	        COMM_EXPERIMENT_SAMPLE:  20,
	        COMM_DETECT_MOTOR_PARAM: 21,
	        COMM_REBOOT:             22,
	        COMM_ALIVE:              23,
	        COMM_GET_DECODED_PPM:    24,
	        COMM_GET_DECODED_ADC:    25,
	        COMM_GET_DECODED_CHUK:   26,
	        COMM_FORWARD_CAN:        27
	    };

	    function crc16_ccitt(buf) {
	        var table = [0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7, 0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6, 0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de, 0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d, 0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4, 0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc, 0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823, 0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b, 0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a, 0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41, 0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70, 0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78, 0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f, 0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067, 0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e, 0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d, 0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405, 0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634, 0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab, 0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3, 0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a, 0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92, 0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1, 0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8, 0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0];
	        var crc = 0x0;
	        var len = buf.length;
	        for (var i = 0; i < len; i++) {
	            var byte = buf[i];
	            crc = (table[((crc >> 8) ^ byte) & 0xff] ^ (crc << 8)) & 0xffff;
	        }
	        return crc;
	    }

	    function pack(payload) {
	        var msg = new Uint8Array(256);
	        var crc = crc16_ccitt(payload);
	        var len = payload.length;
	        var count = 0;

	        if (len <= 256) {
	            msg[count++] = 2;
	            msg[count++] = len;
	        } else {
	            msg[count++] = 3;
	            msg[count++] = (len >> 8);
	            msg[count++] = (len & 0xFF);
	        }

	        msg.set(payload, count, len);
	        count += len;

	        msg[count++] = (crc >> 8);
	        msg[count++] = (crc & 0xFF);
	        msg[count++] = 3;

	        return msg.subarray(0, count);
	    }

	    function sliceInt16(buf, scale, index) {
	        var res = buf[index] << 8 | buf[index+1];
	        return res/scale;
	    }

	    function sliceInt32(buf, scale, index) {
	        var res = buf[index] << 24 | buf[index+1] << 16 | buf[index+2] << 8 | buf[index+3];
	        return res/scale;
	    }

	    function unpack(packet) {
	        var i = 3;
	        data.temp_mos1          = sliceInt16(packet, 10.0,    i); i += 2;
	        data.temp_mos2          = sliceInt16(packet, 10.0,    i); i += 2;
	        data.temp_mos3          = sliceInt16(packet, 10.0,    i); i += 2;
	        data.temp_mos4          = sliceInt16(packet, 10.0,    i); i += 2;
	        data.temp_mos5          = sliceInt16(packet, 10.0,    i); i += 2;
	        data.temp_mos6          = sliceInt16(packet, 10.0,    i); i += 2;
	        data.temp_pcb           = sliceInt16(packet, 10.0,    i); i += 2;
	        data.current_motor      = sliceInt32(packet, 100.0,   i); i += 4;
	        data.current_in         = sliceInt32(packet, 100.0,   i); i += 4;
	        data.duty_now           = sliceInt16(packet, 1000.0,  i); i += 2;
	        data.rpm                = sliceInt32(packet, 1.0,     i); i += 4;
	        data.v_in               = sliceInt16(packet, 10.0,    i); i += 2;
	        data.amp_hours          = sliceInt32(packet, 10000.0, i); i += 4;
	        data.amp_hours_charged  = sliceInt32(packet, 10000.0, i); i += 4;
	        data.watt_hours         = sliceInt32(packet, 10000.0, i); i += 4;
	        data.watt_hours_charged = sliceInt32(packet, 10000.0, i); i += 4;
	        data.tachometer         = sliceInt32(packet, 1.0,     i); i += 4;
	        data.tachometer_abs     = sliceInt32(packet, 1.0,     i); i += 4;
	        data.fault_code         = packet[i++];
	        data.fault_str          = FAULT_CODES[data.fault_code];
	        //console.log(data);
	    }

	    function onError(error) {
	        console.log(error);
	    }

	    function onDataReady(buf) {
	        var packet = Array.prototype.slice.call(new Uint8Array(buf));
	        var firstByte = packet[0];
	        var lastByte  = packet[packet.length-1];

	        currPacket = (firstByte == 2) ? packet : currPacket.concat(packet);

	        if (lastByte == 3) {
	            unpack(currPacket);
	            //console.log(currPacket);
	        }
	    }

	    return {

	        bindData: function(dataToBind) {
	            data = dataToBind;
	        },

	        startListening: function() {
	            listening = true;
	            bluetoothSerial.subscribeRawData(onDataReady, onError);
	            console.log("Listening for data");
	        },

	        stopListening: function() {
	            listening = false;
	            bluetoothSerial.unsubscribeRawData();
	            console.log("Stopped listening for data");
	        },

	        requestValues: function() {
	            if (!listening) return;
	            var cmd = COMM_PACKET_ID.COMM_GET_VALUES;
	            var msg = pack([cmd]);
	            bluetoothSerial.write(msg);
	            //console.log(msg);
	        }
	    };

	})();

/***/ },
/* 186 */
/***/ function(module, exports) {

	// UI update looper
	Looper = function(fps, onUpdate) {
	  	this.fps = fps;
		this.onUpdate = onUpdate;
		this.paused = true;

		$(window).blur(function() {
			this.stop();
		}.bind(this));

		$(window).focus(function() {
			this.start();
		}.bind(this));

		this.test = function(id) {
		    $("#" + id).dblclick(function() {
		        if (this.paused) this.start();
		        else this.stop();
		    }.bind(this));
		};

		this.update = function() {
			setTimeout(function() {
				if (this.paused) return;
			   	requestAnimationFrame(this.update);
			   	this.onUpdate();
			}.bind(this), 1000 / this.fps);
		}.bind(this);

		this.start = function() {
			this.paused = false;
			this.update();
			//console.log(document.title + " started");
		};

		this.stop = function() {
			this.paused = true;
			//console.log(document.title + " stopped");
		};
	}

	module.exports = Looper;

/***/ },
/* 187 */
/***/ function(module, exports) {

	module.exports = {

		// Cordova device info
		getDeviceInfo: function() {
			return 	{  
				platform:   device.platform,
		    	version:    device.version,
		    	uuid: 	    device.uuid, 
		    	name: 	    device.name,
		    	width: 	    screen.width, 
		    	height:     screen.height, 
		    	colorDepth: screen.colorDepth
		    }
		},

		crc16_ccitt: function(buf) {
			var crc16_tab = [0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7, 0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6, 0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de, 0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d, 0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4, 0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc, 0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823, 0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b, 0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a, 0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41, 0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70, 0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78, 0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f, 0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067, 0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e, 0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d, 0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405, 0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634, 0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab, 0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3, 0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a, 0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92, 0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1, 0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8, 0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0];
			var crc = 0x0;
			for (var i = 0; i < buf.length; i++) {
				var byte = buf[i];
				crc = (crc16_tab[((crc >> 8) ^ byte) & 0xff] ^ (crc << 8)) & 0xffff;
			}
			return crc;
		},

		memcpy: function(dst, dstOffset, src, srcOffset, length) {
			var src = src.subarray || src.slice ? src : src.buffer
			var dst = dst.subarray || dst.slice ? dst : dst.buffer

			src = srcOffset ? src.subarray ?
				src.subarray(srcOffset, length && srcOffset + length) :
				src.slice(srcOffset, length && srcOffset + length) : src

			if (dst.set) {
				dst.set(src, dstOffset)
			} else {
				for (var i=0; i<src.length; i++) {
					dst[i + dstOffset] = src[i]
				}
			}
			return dst
		},

		// Function gets point(x,y) on circle at given angle
		getPointOnCircle: function(r, cx, cy, angle) {
			var x = cx + r * Math.sin(angle * Math.PI/180);
			var y = cy - r * Math.cos(angle * Math.PI/180);
			return { x: x, y: y };	
		},

		randInt: function(ceiling) {
			return Math.round(Math.random() * ceiling);
		},

		randFloat: function(floor, ceiling, decimals) {
			return parseFloat(Math.random().map(0, 1, floor, ceiling).toFixed(decimals));
		},

		setToggleButtonState: function(id, state) {
			var suffix = (state) ? "On" : "Off";
			$("#" + id).attr("class", id + suffix);
		},

		setCycleButtonState: function(id, state) {
			$("#" + id).attr("class", id + state);
		},
	}

	Number.prototype.map = function (in_min, in_max, out_min, out_max ) {
		return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
	}


/***/ }
/******/ ]);