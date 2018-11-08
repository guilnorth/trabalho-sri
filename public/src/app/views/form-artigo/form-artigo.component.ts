import { Component, OnInit } from '@angular/core';
import {Artigo} from "../../models/Artigo";
import {ArtigoService} from "../../services/artigo.service";

@Component({
  selector: 'app-form-artigo',
  templateUrl: './form-artigo.component.html',
  styleUrls: ['./form-artigo.component.scss']
})
export class FormArtigoComponent implements OnInit {

  public artigo = new Artigo();
  constructor(private artigoService:ArtigoService) { }

  ngOnInit() {
  }
  create(){
    this.artigoService.create(this.artigo).subscribe((res)=>{
      console.log(res);
    })
  }

}
