var restify = require("restify");
var server = restify.createServer();
server.get("/hello", function (req, res, next) {
    res.send({
        message: "Hello World",
        value: 1
    });
});
server.listen(3000, function () {
    console.log("Listening for requests");
});
