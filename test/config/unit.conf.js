basePath = '../../';

files = [
    JASMINE,
    JASMINE_ADAPTER,
    'public/js/lib/angular/angular.min.js',
    'public/js/lib/jquery/jquery-2.0.0.min.js',
    'public/js/lib/bootstrap/bootstrap.min.js',
    'public/js/lib/ui-bootstrap-tpls-0.2.0.js',
    'test/lib/angular/angular-mocks.js',
    'public/js/*.js',
    'test/unit/**/*.js'
];

exclude = [
    'public/js/front.js'
];

autoWatch = false;
singleRun = true;

browsers = ['Chrome'];//PhantomJS, Safari, Firefox

junitReporter = {
    outputFile:'test_out/unit.xml',
    suite:'unit'
};
