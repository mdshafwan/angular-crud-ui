import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MetalListComponent } from './metal/metal-list/metal-list.component';
import { PurityListComponent } from './purity/purity-list/purity-list.component';
import { MetalRateComponent } from './metal-rate/metal-rate-list/metal-rate-list.component';
import { UserListComponent } from './user/user-list/user-list.component'; 




const routes: Routes = [
  { path: '', redirectTo: 'metals', pathMatch: 'full' }, 
  { path: 'metals', component: MetalListComponent },
  { path: 'purity', component: PurityListComponent },
  { path: 'metal-rates', component: MetalRateComponent },
  { path: 'users', component: UserListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}