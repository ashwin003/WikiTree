import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { INode } from '../models/node';

@Injectable({
  providedIn: 'root'
})
export class WikiService {

  constructor(private httpClient: HttpClient) { }

  getNextNode(slug: string): Observable<INode> {
    const url = environment.serviceUri + 'node/' + slug;
    return this.httpClient.get<INode>(url);
  }
}
