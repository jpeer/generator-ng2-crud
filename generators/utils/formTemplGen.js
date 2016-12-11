/* helpers for creating html template code for 'form' components of the ng2 frontend */

'use strict';

var generateValidationCode = function(controlBinding) {
    var result = '';
    result += '<div *ngIf="'+controlBinding+'.dirty && '+controlBinding+'.invalid">';
    result += '    <p class="bg-danger">{{'+controlBinding+'.errors | errors}}</p>';
    result += '</div>';
    return result;
}

var generateSelectBoxCode = function(typeInfo, controlBinding, required, context) {
    var requiredStr = required ? ' required' : '';

    var labelTemplate = context.templateUtils.generateReferenceLabel(typeInfo, 'opt', context);

    console.log('labelTemplate=', labelTemplate);

    var result = '';
    result += '<select class="form-control" [formControl]="' + controlBinding + '" ' + requiredStr + '>';
    result += '<option *ngFor="let opt of refData[\'' + typeInfo.refType + '\']" [value]="opt._id">';
    result += labelTemplate;
    result += '</option>';
    result += '</select>';
    return result;
}


var generateSingleInput = function(typeInfo, controlBinding, required, context) {
    var result = '';
    var requiredStr = required ? ' required' : '';
    var propType= typeInfo.type;
    if(propType === 'reference') {
        result += '     ' + generateSelectBoxCode(typeInfo, controlBinding, required, context) + '\n';
    } else if(propType === 'boolean') {
        result += '    <input type="checkbox" class="form-control" [formControl]="' + controlBinding + '" ' + requiredStr + '>\n';
    } else if(propType === 'date') {
        /* waiting for bootstrap datepicker getting expanded to reactie forms*/
        result += '    <input type="date" class="form-control" [formControl]="' + controlBinding + '"' +requiredStr+'>\n';
    } else if(propType === 'text') {
        result += '    <textarea class="form-control" [formControl]="' + controlBinding + '"' +requiredStr+'></textarea>\n';
    } else {
        result += '    <input type="text" class="form-control" [formControl]="' + controlBinding + '"' +requiredStr+'>\n';
    }

    result += generateValidationCode(controlBinding);

    return result;
}

var generateTemplateInternal = function(entity, context, path, compAccess) {
    var result = '';

    entity.properties.forEach(function(prop) {

        var fullPropName = path !== '' ? path + '.' + prop.name :  prop.name;
        var fullCompAcccess = compAccess + ".controls['"+ prop.name+"']";

        if(context.datatypes.isSingleValued(prop.typeInfo.type)) {

            result += '    <label>'+prop.name+'</label>\n';
            var controlBinding = fullCompAcccess;
            result += generateSingleInput(prop.typeInfo, controlBinding, prop.required, context);

        } else if (prop.typeInfo.type === 'object') {
            result += '    <label>'+prop.name+'</label>\n';
            result += '    <div class="form-group" formGroupName="'+prop.name+'">\n';
            var nestedEntity = context.entityMap[prop.typeInfo.refType];
            result += generateTemplateInternal(nestedEntity, context, '', fullCompAcccess);
            result += '    </div>';
        } else if (prop.typeInfo.type === 'array') {

            var uniqueName = fullPropName.replace('.', '_');
            var addArrElemMethod = "add_arr_elem_" + uniqueName;

            result += '    <label>'+ prop.name+'</label>\n';
            result += '    <div formArrayName="' + prop.name+'">';
            result += '      <div *ngFor="let obj of '+fullCompAcccess+'.controls; let i=index" class="card">';
            result += '        <div class="card-header">';
            result += '          <span>'+prop.name+' {{i + 1}}</span>';
            result += '          <span (click)="'+fullCompAcccess+'.removeAt(i)"><i class="fa fa-times" aria-hidden="true"></i></span>';
            result += '        </div>';
            result += '        <div class="card-block">';

            var compType = prop.typeInfo.componentType.type;
            if(context.datatypes.isSingleValued(compType)) {
                var controlBinding = fullCompAcccess+'.controls[i]';
                result += generateSingleInput(prop.typeInfo.componentType, controlBinding, prop.required, context);

            } else {
                var nestedEntity = context.entityMap[prop.typeInfo.componentType.refType];
                result += '<div [formGroupName]="i">';
                result += generateTemplateInternal(nestedEntity, context, '', fullCompAcccess + ".controls[i]");
                result += '</div>';
            }
            result += '        </div>';
            result += '      </div>';
            result += '    <i class="fa fa-plus" aria-hidden="true" (click)="'+addArrElemMethod+'('+fullCompAcccess+')"></i>';
            result += '    </div>';
        }
    });

    return result;

}

var generateTemplate = function(entity, context) {

    var result = '';

    result += '<form [formGroup]="formGroup" novalidate (ngSubmit)="onSubmit()">\n';
    result += '    <input type="hidden" formControlName="_id">\n';
    result += generateTemplateInternal(entity, context, '', 'formGroup');

    result += '  <button type="submit" class="btn btn-primary" [disabled]="!formGroup.valid">Submit</button>\n'
    result += '</form>\n';

    return result;
}


module.exports = { generateTemplate : generateTemplate }