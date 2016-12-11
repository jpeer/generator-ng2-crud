import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';
import { <%- context.entity.name %> } from './entity';

@Injectable()
export class <%- context.entity.name %>Service {

    private baseUrl = 'http://localhost:3000/<%- context.entity.name %>';
    private headers = new Headers({'Content-Type': 'application/json'});
    private options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) {}

    add(obj: <%- context.entity.name %>): Observable<<%- context.entity.name %>> {
        return this.http.post(this.baseUrl, JSON.stringify(obj), this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    update(obj: <%- context.entity.name %>): Observable<<%- context.entity.name %>> {
        return this.http.put(this.baseUrl + '/' + obj._id, JSON.stringify(obj), this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    delete(obj: <%- context.entity.name %>) {
        return this.http.delete(this.baseUrl + '/' + obj._id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    findAll(): Observable<<%- context.entity.name %>[]> {
        return this.http.get(this.baseUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    findAllPopulated(): Observable<any[]> {
        return this.http.get(this.baseUrl + '/populated')
            .map(this.extractData)
            .catch(this.handleError);
    }

    find(id: string): Observable<<%- context.entity.name %>> {
        var url = this.baseUrl + '/' + id;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    private handleError (error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}
