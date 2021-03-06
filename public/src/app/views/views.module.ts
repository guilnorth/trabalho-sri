import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';

//import { CalendarModule } from 'angular-calendar';

import { SharedModule } from '../shared/shared.module';

import { FooterComponent } from '../main-layout/footer/footer.component';
import { BasicTableComponent } from './tables/basic-table/basic-table.component';
import { TypographyComponent } from './css/typography/typography.component';
import { IconsComponent } from './css/icons/icons.component';
import { Dashboard1Component } from './dashboards/dashboard1/dashboard1.component';
import { GridComponent } from './css/grid/grid.component';
import { MediaObjectComponent } from './css/media-object/media-object.component';
import { UtilitiesComponent } from './css/utilities/utilities.component';
import { ImagesComponent } from './css/images/images.component';
import { ColorsComponent } from './css/colors/colors.component';
import { ShadowComponent } from './css/shadow/shadow.component';

import { SobreComponent } from './sobre/sobre.component';
import { ArtigoComponent } from './artigo/artigo.component';
import { SearchComponent } from './search/search.component';
import { FormArtigoComponent } from './form-artigo/form-artigo.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AgmCoreModule.forRoot({
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en#key
      apiKey: ''
    }),
    //CalendarModule.forRoot()
  ],
  declarations: [
    FooterComponent,
    BasicTableComponent,
    TypographyComponent,
    IconsComponent,
    Dashboard1Component,
    GridComponent,
    MediaObjectComponent,
    UtilitiesComponent,
    ImagesComponent,
    ColorsComponent,
    ShadowComponent,
    SobreComponent,
    ArtigoComponent,
    SearchComponent,
    FormArtigoComponent,

  ],
  exports: [
    FooterComponent,
    BasicTableComponent,
    TypographyComponent,
    IconsComponent,
    Dashboard1Component,
    GridComponent,
    MediaObjectComponent,
    UtilitiesComponent,
    ImagesComponent,
    ColorsComponent,
    ShadowComponent,

  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ViewsModule { }
