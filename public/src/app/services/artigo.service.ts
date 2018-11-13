import { Injectable } from '@angular/core';
import {BASE_API} from '../app.api';
import {HttpClient} from "@angular/common/http";
import {Artigo} from "../models/Artigo";

@Injectable()
export class ArtigoService {

  constructor(private http: HttpClient) { }

  create(artigo:Artigo){
    return this.http.post(`${BASE_API}/artigo/create`,
        ({artigo:artigo}))
  }

  search(consulta){
    return this.http.post(`${BASE_API}/artigo/search`,
        ({consulta:consulta}))
  }

  suggest(){
    return this.http.get(`${BASE_API}/artigo/suggest`)
  }

}
