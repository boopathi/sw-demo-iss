var koa = require('koa'),
	app = koa(),
	logger = require('koa-logger'),
	route = require('koa-route'),
	staticDir = require('koa-static'),
	views = require('co-views'),
	request = require('co-request'),
	port = process.env.PORT || 3003;

var render = views('views', {
	map: { html: 'ejs' }
});

//logger
app.use(logger());
app.use(route.get('/', home));
app.use(route.get('/api/:name', api))
app.use(staticDir('build'))
app.use(staticDir('public'))

app.listen(port, function() {
	console.log("Koa server listening on port %s", port);
});

function *home() {
	this.body = yield render('index', {
		API_KEY: "AIzaSyAsNQznL2CUA2wXZ-gy-Non9_6v5-V5SIU"
	})
}

function *api(name) {
	switch(name) {
		case "location":
			var resp = yield request('http://api.open-notify.org/iss-now.json');
			this.body = resp.body;
			break;
		default:
			console.log("Unknown");
			this.body = "[]";
	}
}