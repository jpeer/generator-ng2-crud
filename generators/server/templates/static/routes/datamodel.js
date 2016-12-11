var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

<%- context.mongooseGenerator.generateMongooseModel(context) %>

module.exports = {
  <%  context.firstclassEntities.forEach(function(entity) { %>
        <%- entity.name -%> : <%- entity.name -%>Model,
  <%  }); %>
};
