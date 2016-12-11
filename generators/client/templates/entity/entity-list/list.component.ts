import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {<%- context.entity.name %>} from '../entity';
import {<%- context.entity.name %>Service} from '../entity.service';


@Component({
    selector: 'app-<%- context.entity.name %>-list',
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.css']
})
export class <%- context.entity.name %>ListComponent implements OnInit {

    constructor(private service: <%- context.entity.name %>Service, private router: Router) {
    }

    private data: any[];

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.service.findAllPopulated().subscribe(data => this.data = data, err => console.log(err));
    }

    onDelete(obj: <%- context.entity.name %>) {
        this.service.delete(obj).subscribe(() => {
                this.loadData();
            }
        );
    }

    onEdit(obj: <%- context.entity.name %>) {
        this.router.navigate(['<%- context.entity.name %>', obj._id]);
    }

}
