import { Component, OnInit } from '@angular/core';
import {ArtigoService} from "../../services/artigo.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public listArtigos:any = [];
  constructor(private artigoService:ArtigoService ) { }

  ngOnInit() {
  }

  buscar(busca){
    if(busca)
      this.artigoService.search(busca).subscribe((res)=>{
        if(res) {
          console.log(res);
          this.listArtigos = res;
        }

      })
  }
}
