import {NgModule} from '@angular/core'
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {Ng2PaginationModule} from 'ng2-pagination';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { ErrorsPipe } from './errors.pipe';
import {rootRouterConfig} from "./app.routes";
import {AppComponent} from "./app.component";
import {HelpComponent} from "./help/help.component";

<% context.firstclassEntities.forEach(function(entity){ %>
import { <%- entity.name %>ListComponent } from './entities/<%- entity.name %>/entity-list/list.component';
import { <%- entity.name %>FormComponent } from './entities/<%- entity.name %>/entity-form/form.component';
import { <%- entity.name %>Service } from './entities/<%- entity.name %>/entity.service'
<% }); %>

@NgModule({
  declarations: [AppComponent,
                 HelpComponent,
                 ErrorsPipe
                 <% context.firstclassEntities.forEach(function(entity){ %>, <%- entity.name %>ListComponent, <%- entity.name %>FormComponent<% }); %>],
  imports     : [BrowserModule,
                 ReactiveFormsModule,
                 NgbModule.forRoot(),
                 HttpModule,
                 RouterModule.forRoot(rootRouterConfig),
                 Ng2PaginationModule],
  providers   : [{provide: LocationStrategy, useClass: HashLocationStrategy} <% context.firstclassEntities.forEach(function(entity){ %>, <%- entity.name %>Service<% }); %>],
  bootstrap   : [AppComponent]
})
export class AppModule {
}
