import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPostComponent } from './add-post/add-post.component';
import { CatalogComponent } from './catalog/catalog.component';

const routes: Routes = [
{
    path: 'add-item',
    component: AddPostComponent,
    // canActivate: [AuthActivate],
},
    {
      path: 'catalog',
      component: CatalogComponent,
  //     // canActivate: [AuthActivate],
    },
  // //   {
  // //     path: 'profile',
  // //     component: ProfileComponent,
  // //     // canActivate: [AuthActivate],
  // //   },
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule],
})
export class PostRoutingModule {}