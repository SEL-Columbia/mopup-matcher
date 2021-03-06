var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api');

var app = module.exports = express();

//db init


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API

app.get('/api/facilities/:type/:id/:sector', api.facilities);
app.get('/api/download/:type/:id/:sector', api.download);
app.get('/api/summaries/baseline/lga', api.summaries('matched_totals_nmis_by_lga'));
app.get('/api/summaries/baseline/state', api.summaries('matched_totals_nmis_by_state'));
app.get('/api/summaries/facility_list/lga', api.summaries('matched_totals_lga_by_lga'));
app.get('/api/summaries/facility_list/state', api.summaries('matched_totals_lga_by_state'));
app.post('/api/matching/:sector/create', api.matching_create);
app.post('/api/matching/:sector/delete', api.matching_delete);
app.post('/api/matching/:sector/reject', api.matching_reject);
app.post('/api/matching/:sector/clearreject', api.matching_clearreject);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function(){
  console.log("serving on port %d in %s mode", this.address().port, app.settings.env);
});
