import {RouterModule, Route} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {NotFoundComponent} from './views/errors/not-found/not-found.component';

import {Dashboard1Component} from './views/dashboards/dashboard1/dashboard1.component';
import {SobreComponent} from "./views/sobre/sobre.component";
import {ArtigoComponent} from "./views/artigo/artigo.component";
import {SearchComponent} from "./views/search/search.component";
import {FormArtigoComponent} from "./views/form-artigo/form-artigo.component";


const routes: Route[] = [
    {path: '', pathMatch: 'full', redirectTo: 'home'},
    {
        path: 'map', children: [
        {path: 'direto/:grupo', component: ArtigoComponent},
        {path: 'associativo/:grupo/:politica', component: ArtigoComponent},
        {path: 'associativo-conjunto/:grupo/:politica/:vias', component: ArtigoComponent},
    ]
    },
    {path: 'home', component: SearchComponent},
    {path: 'sobre', component: SobreComponent},
    {path: 'artigo', component: FormArtigoComponent},
    {
        path: 'dashboards', children: [
        {path: 'v1', component: Dashboard1Component},
    ]
    },

    {path: '**', component: NotFoundComponent},

];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
