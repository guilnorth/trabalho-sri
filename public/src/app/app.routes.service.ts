import {RouterModule, Route} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {NotFoundComponent} from './views/errors/not-found/not-found.component';

import {Dashboard1Component} from './views/dashboards/dashboard1/dashboard1.component';
import {SobreComponent} from "./views/sobre/sobre.component";
import {ArtigoComponent} from "./views/artigo/artigo.component";
import {SearchComponent} from "./views/search/search.component";
import {FormArtigoComponent} from "./views/form-artigo/form-artigo.component";


const routes: Route[] = [
    {path: '', pathMatch: 'full', redirectTo: 'pesquisa'},
    {
        path: 'pesquisa', children: [
        {path: '', component: SearchComponent},
        {path: 'detalhes/:termo', component: ArtigoComponent},
    ]
    },
    {path: 'sobre', component: SobreComponent},
    {path: 'importar-artigo', component: FormArtigoComponent},
    {
        path: 'dashboards', children: [
        {path: 'v1', component: Dashboard1Component},
    ]
    },

    {path: '**', component: NotFoundComponent},

];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes,{ useHash: true });
