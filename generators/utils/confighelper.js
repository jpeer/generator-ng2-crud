/* functions for working with configs that are out of scope for config parser */

'use strict';

var firstClassEntities = function(lst, predicate) {
    return lst.filter(function(e) {
        if(e.firstclass === undefined) {
            throw "firstclass attribute undefined!";
        }
        return e.firstclass === predicate });
}


module.exports = { firstClassEntities : firstClassEntities };