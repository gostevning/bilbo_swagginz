var express = require('express');
var router = express.Router();

var AWS = require('aws-sdk');

AWS.config = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'eu-west-1'
};

router.get('/', function (req, res) {
    var apiGateway = new AWS.APIGateway();
    var items = [];

    apiGateway.getRestApis(function (error, data) {
        data.items.forEach(function (item) {
            items.push({id: item.id, name: item.name});
        });

        res.render('index', {title: 'Bilbo Swagginz', items: items, account: maskedAccount(AWS.config.accessKeyId, 2)});
    });

});

router.get('/:id', function (req, res) {
    var id = req.params.id;

    var params = {
        exportType: 'swagger',
        restApiId: id,
        stageName: 'dev'
    };

    var apiGateway = new AWS.APIGateway();

    apiGateway.getExport(params, function (error, data) {
        res.send(data.body);
    });
});

function maskedAccount(account, unmasked) {
    var slice = account.length - unmasked;

    var first = account.slice(0, slice).replace(/./g, "*");
    var second = account.slice(slice);

    return first + second;
}

module.exports = router;
