import { Component, OnInit } from '@angular/core';
import {ArtigoService} from "../../services/artigo.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public listArtigos:any = [];
  public palavrasSugeridas:any = [];
  constructor(private artigoService:ArtigoService ) { }

  ngOnInit() {
  }

  /** Buscar Sugestões **/
  getSuggest(){
    this.artigoService.suggest().subscribe((result)=>{
      this.palavrasSugeridas = result;
    });
  }

  buscar(busca){
    if(busca)
      this.artigoService.search(busca).subscribe((res:any)=>{
          if(res && res.length){
            console.log(res);
            this.listArtigos = res;
          }else{
            this.listArtigos = [];
            this.getSuggest();
          }
      })
  }
}
