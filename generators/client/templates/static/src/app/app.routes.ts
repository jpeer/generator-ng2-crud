import {Routes} from '@angular/router';
import {HelpComponent} from './help/help.component';
<% context.firstclassEntities.forEach(function(entity){ %>
import {<%- entity.name %>ListComponent} from './entities/<%- entity.name %>/entity-list/list.component';
import {<%- entity.name %>FormComponent} from './entities/<%- entity.name %>/entity-form/form.component';
<% }); %>


export const rootRouterConfig: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'help', component: HelpComponent},
<% context.firstclassEntities.forEach(function(entity){ %>
  {path: '<%- entity.name %>list', component: <%- entity.name %>ListComponent},
  {path: '<%- entity.name %>form', component: <%- entity.name %>FormComponent},
  {path: '<%- entity.name %>/:id', component: <%- entity.name %>FormComponent},
<% }); %>
];
