basePath = '../../';

files = [
    ANGULAR_SCENARIO,
    ANGULAR_SCENARIO_ADAPTER,
    'public/js/lib/angular/angular.min.js',
    'public/js/lib/jquery/jquery-2.0.0.min.js',
    'public/js/lib/bootstrap/bootstrap.min.js',
    'public/js/lib/ui-bootstrap-tpls-0.2.0.js',
    'public/js/*.js',
    'test/e2e/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];//PhantomJS, Safari, Firefox

singleRun = false;

proxies = {
    '/':'http://localhost:3000/'
};

junitReporter = {
    outputFile:'test_out/e2e.xml',
    suite:'e2e'
};

urlRoot = '/tests/';
