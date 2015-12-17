import restify = require("restify");
import GitHubApi = require("github");
import request = require('request');
import Registry = require('npm-registry');
import mongo = require('mongodb');

var server = restify.createServer();
var npm = new Registry();
var mongoServer = mongo.MongoClient;

var NUM_PACKAGES_TO_SHOW = 10;
var port = process.env.PORT;
var npmTopPackagesUrl = "https://raw.githubusercontent.com/nexdrew/all-stars/master/packages.json";
var numProcessed = 0;
var mongoUser = process.env.DECODED_MONGO_USER;
var mongoPassword = process.env.DECODED_MONGO_PASSWORD;
var mongoServerUri = process.env.DECODED_MONGO_SERVER;
var mongoUri = "mongodb://" + mongoUser + ":" + mongoPassword + "@" + mongoServerUri;

server.use(restify.bodyParser());

server.get("/contributors/:pkg", function(req, res, next) {
	var github = new GitHubApi({
		version: "3.0.0"
	});
	npm.packages.get(req.params.pkg, function(err, packageDetails) {
		var gitHubInfo = packageDetails[0].github;
		github.repos.getContributors(
			{
				user: gitHubInfo.user,
				repo: gitHubInfo.repo,
				per_page: 10
			}, function(err, response) {
				res.send(response);
			}
		);
	});
	next();
});

server.get("/packages", function(req, res, next) {
	request(npmTopPackagesUrl, function(error, response, body) {
		numProcessed = 0;
		var packages = JSON.parse(body);
		var packageNames = Object.keys(packages).slice(0, NUM_PACKAGES_TO_SHOW);
		var payload = [];
		var num_processed = 0;
		mongoServer.connect(mongoUri, function(err, db) {
			var favorites = db.collection('favorites');
			packageNames.forEach(function(name) {
				
				var objToFind = {
					repo: name,
					userid: null,
					tenantid: null
				};
				var userid = req.header("userid");
				var tenantid = req.header("tenantid");
				if(userid != null && tenantid != null) {
					objToFind.userid = userid;
					objToFind.tenantid = tenantid;
				}
				favorites.findOne(objToFind, function(err, doc) {
					var item = {name: name, rank: packages[name].rank, favorite: false};
					if(doc !== null) {
						item.favorite = true;
					}
					// Repo marked, push it to the payload
					payload.push(item);
					numProcessed++;
					// If we have enough to show, terminate connection to Mongo, sort the results, and send back to the client
					if(numProcessed === NUM_PACKAGES_TO_SHOW) {
						db.close();
						payload.sort(function(a, b) {
							if(a.rank < b.rank) {
								return -1;
							}
							if(a.rank > b.rank) {
								return 1;
							}
							return 0;
						});
						res.send(payload);
						next();
					}
				});
			});
		});
	});
});

server.post("/favorite/:repo", function(req, res, next) {
	mongoServer.connect(mongoUri, function(err, db) {
		var favorites = db.collection('favorites');
		var userid = req.header("userid");
		var tenantid = req.header("tenantid");
		var favDoc = {
			repo: req.params.repo,
			userid: userid,
			tenantid: tenantid
		};
		
		var isFavorite = req.params.isFavorite;
		if(isFavorite) {
			favorites.insertOne(favDoc, function(err, result) {
				if(err != null) {
					console.log(err);
				}
				db.close();
				res.send("OK");
			});
		} else {
			favorites.findOneAndDelete(favDoc, null, function(err, result) {
				if(err != null) {
					console.log(err);
				}
				db.close();
				res.send("OK");
			});
		}
	});
});

server.get(/.*/, restify.serveStatic({
	directory: __dirname,
	default: 'decoded.html'
}));
	
server.listen(port, () => { 
 	console.log("Listening for requests"); 
});
