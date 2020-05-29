import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'gif-search',
    loadChildren: () => import('./gif-search/gif-search.module').then(m => m.GifSearchModule),
  },
  {
    path: '**',
    redirectTo: 'gif-search',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
