import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router }   from '@angular/router';
import {forEach} from '@angular/router/src/utils/collection';
import {FormBuilder, FormGroup, FormControl, FormArray, Validators,} from '@angular/forms';

<%  context.getDepsForEntity(context.entity).forEach(function(e) {
var ent = context.entityMap[e]; %>
import { <%- ent.name -%> } from '../entity';
<% }); %>
import { <%- context.entity.name %>Service } from '../entity.service';
<% var foreignServices = context.determineForeignServices(context.entity);
foreignServices.forEach(function(s) { %>
import { <%- s %>Service } from '../../<%- s %>/entity.service';
<% }); %>


@Component({
    selector: '<%- context.entity.name %>-form',
    templateUrl: 'form.component.html',
    styleUrls: ['form.component.css']
})
export class <%- context.entity.name %>FormComponent implements OnInit {

    private formGroup: FormGroup;
    private errorMessage: string = null;
    private isUpdate: boolean;
    private refData = {};

    constructor(private fb: FormBuilder, private service: <%- context.entity.name %>Service <% foreignServices.forEach(function(s) {%>, private <%- s %>Service: <%- s %>Service <%}) %>,
        private route: ActivatedRoute, private router: Router) {
    }

    setValueToForm(value: <%- context.entity.name %>)
    {
        console.log('trying to set value: ', JSON.stringify(value, null, 2));
        this.formGroup = <%- context.formCompGen.generateFormGroup(context.entity, context, '') -%>;
    }

    <%- context.formCompGen.generateArrayMethods(context.entity, context, '') -%>

    ngOnInit() {
        this.isUpdate = false;
        this.setValueToForm(new <%- context.entity.name %>());
        this.errorMessage = null;

        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            if(id != undefined) {
                console.log('this is an update!');
                this.isUpdate = true;
                this.service.find(id)
                    .subscribe(obj=> {console.log('pos1, ', obj); this.setValueToForm(obj); console.log('pos2!');}, err => console.log(err));
            } else {
                console.log('this is NOT an update!');
                this.isUpdate = false;
            }
        });
        this.fetchReferredData();
    }

    /* fetch data pointed to by references, to allow us build selectboxes */
    fetchReferredData() {
        <% foreignServices.forEach(function(s) {%>
            this.<%- s %>Service.findAll().
            subscribe(data => {this.refData['<%- s %>'] = data; console.log(data)}, err => console.log(err));
            <% });%>
    }

    get diagnostic(): string {
        return JSON.stringify(this.formGroup.value);
    }

    closeAlert() {
        this.errorMessage = null;
    }

    onSubmit() {
        console.log('ok, we are submitting: ', this.diagnostic);
        this.errorMessage = null;

        if(!this.isUpdate) {
            this.service.add(this.formGroup.value)
                .subscribe(
                    obj => { console.log(obj); this.router.navigate(['/<%- context.entity.name %>list']); },
                    error => { this.errorMessage = <any>error; });
        } else {
            this.service.update(this.formGroup.value)
                .subscribe(
                    obj => { console.log(obj); this.router.navigate(['/<%- context.entity.name %>list']); },
                    error => { this.errorMessage = <any>error; });
        }

    }
}
