var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;
var dm = require('./datamodel');

<%
var modelName = 'dm.' + context.entity.name;
%>

router.get('/', function (req, res, next) {
    console.log('GET / called')
    <%- modelName %>.find(function (err, lst) {
        if (err) return (next(err));
        res.json(lst);
    });
});


router.get('/populated', function (req, res, next) {
    console.log('GET / called');
    <%- modelName -%>.find()
    <% context.entity.properties.filter(function(prop){ return prop.typeInfo.type === 'reference'; }).forEach(function(prop) { %>
       .populate('<%- prop.name -%>')
    <% }); %>
    .exec(function (err, lst) {
        if (err) return (next(err));
        res.json(lst);
    });
});


router.get('/:id', function (req, res, next) {
    console.log('GET /:id called');
    var id = req.params.id;
    console.log('id: ', id);
    <%- modelName %>.findOne({'_id': id}, function (err, entity) {
        if (err) return (next(err));
        console.log('ok found:', entity);
        res.json(entity);
    });
});


router.post('/', function (req, res, next) {
    console.log('POST: ', req.body);

    var obj = new <%- modelName %>(req.body);

    obj.save(function (err, obj) {
        if (err) {
            console.error(err);
            return next(err);
        }
        res.json(obj);
    })
});

router.put('/:id', function (req, res, next) {
    console.log('PUT /:id called', req.body);

    <%- modelName %>.findOneAndUpdate({ "_id" : mongoose.Types.ObjectId(req.params.id) },
        req.body,
        function (err, obj) {
        if (err) { console.log('error:', err); return next(err); }
        res.json(obj);
    });
});


router.delete('/:id', function (req, res, next) {
    console.log('DELETE /:id called', req.body);

    <%- modelName %>.remove({'_id': req.params.id}, function (err, obj) {
            if (err) {
                res.statuscode = 400;
                return next(err);
            }
            res.json({});
        }
    );
});

module.exports = router;
