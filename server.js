var restify = require("restify");
var GitHubApi = require("github");
var request = require('request');
var Registry = require('npm-registry');
var server = restify.createServer();
var npm = new Registry();
var NUM_PACKAGES_TO_SHOW = 10;
var port = process.env.PORT;
var npmTopPackagesUrl = "https://raw.githubusercontent.com/nexdrew/all-stars/master/packages.json";
var numProcessed = 0;
server.use(restify.bodyParser());
server.get("/contributors/:repo", function (req, res, next) {
    var github = new GitHubApi({
        version: "3.0.0"
    });
    npm.packages.get(req.params.repo, function (err, packageDetails) {
        var gitHubInfo = packageDetails[0].github;
        github.repos.getContributors({
            user: gitHubInfo.user,
            repo: gitHubInfo.repo,
            per_page: 10
        }, function (err, response) {
            res.send(response);
        });
    });
    next();
});
server.get("/repos", function (req, res, next) {
    request(npmTopPackagesUrl, function (error, response, body) {
        numProcessed = 0;
        var packages = JSON.parse(body);
        var packageNames = Object.keys(packages).slice(0, NUM_PACKAGES_TO_SHOW);
        var payload = [];
        var num_processed = 0;
        packageNames.forEach(function (name) {
            payload.push({
                name: name,
                rank: packages[name].rank,
                favorite: false
            });
        });
        res.send(payload);
        next();
    });
});
server.get(/.*/, restify.serveStatic({
    directory: __dirname,
    default: 'decoded.html'
}));
server.listen(port, function () {
    console.log("Listening for requests");
});
