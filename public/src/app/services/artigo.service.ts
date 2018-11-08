import { Injectable } from '@angular/core';
import {BASE_API} from '../app.api';
import {HttpClient} from "@angular/common/http";
import {Artigo} from "../models/Artigo";

@Injectable()
export class ArtigoService {

  constructor(private http: HttpClient) { }

  create(artigo:Artigo){
    console.log('888',artigo)
    return this.http.post(`${BASE_API}/artigo/create`,
        ({artigo:artigo}))
  }

}
