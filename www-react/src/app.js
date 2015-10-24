var React = require('react');
var ReactDOM = require('react-dom');
var EasySlider = require("./layouts/easy.slider/easy.slider.jsx");

var BldcApp = React.createFactory(EasySlider);

ReactDOM.render(
    BldcApp({ title: "BLDC.App" }), 
    document.getElementById('app')
);
