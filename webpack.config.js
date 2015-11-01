module.exports = {
    entry: './www/src/app.jsx',

    output: {
        filename: 'bundle.js', 
        path: './www/js',
        publicPath: '/js/'
    },

    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            }
        ]
    },

    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react-bootstrap': 'ReactBootstrap',
        'radium': 'Radium'
    },

    resolve: {
        extensions: ['', '.js', '.jsx']
    }
}
