import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NologinGuard } from './guards/nologin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'coupet',
    loadChildren: () => import('./pages/coupet/coupet.module').then( m => m.CoupetPageModule)
  },
  {
    path: 'petshop',
    loadChildren: () => import('./pages/petshop/petshop.module').then( m => m.PetshopPageModule)
  },
  {
    path: 'vet',
    loadChildren: () => import('./pages/vet/vet.module').then( m => m.VetPageModule)
  },
  {
    path: 'adopcion',
    loadChildren: () => import('./pages/adopcion/adopcion.module').then( m => m.AdopcionPageModule)
  },
  {
    path: 'perdidos',
    loadChildren: () => import('./pages/perdidos/perdidos.module').then( m => m.PerdidosPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    canActivate : [NologinGuard]
  },
  {
    path: 'registeremp',
    loadChildren: () => import('./pages/registeremp/registeremp.module').then( m => m.RegisterempPageModule),
    canActivate : [NologinGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate : [NologinGuard]
  },
  {
    path: 'chats',
    loadChildren: () => import('./pages/chats/chats.module').then( m => m.ChatsPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'cart/:id',
    loadChildren: () => import('./pages/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'cartmodal',
    loadChildren: () => import('./pages/cartmodal/cartmodal.module').then( m => m.CartmodalPageModule)
  },
  {
    path: 'modal',
    loadChildren: () => import('./pages/modal/modal.module').then( m => m.ModalPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'addmodal',
    loadChildren: () => import('./pages/addmodal/addmodal.module').then( m => m.AddmodalPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'editmodal/:id',
    loadChildren: () => import('./pages/editmodal/editmodal.module').then( m => m.EditmodalPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'mymodals',
    loadChildren: () => import('./pages/mymodals/mymodals.module').then( m => m.MymodalsPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'vetModal',
    loadChildren: () => import('./pages/vet-modal/vet-modal.module').then( m => m.VetModalPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'vetDetail',
    loadChildren: () => import('./pages/vet-detail/vet-detail.module').then( m => m.VetDetailPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'calendar/:id',
    loadChildren: () => import('./pages/calendar/calendar.module').then( m => m.CalendarPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'addVet',
    loadChildren: () => import('./pages/add-vet/add-vet.module').then( m => m.AddVetPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'addProduct',
    loadChildren: () => import('./pages/add-product/add-product.module').then( m => m.AddProductPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'mypublications',
    loadChildren: () => import('./pages/mypublications/mypublications.module').then( m => m.MypublicationsPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'usersAliad',
    loadChildren: () => import('./pages/users-aliad/users-aliad.module').then( m => m.UsersAliadPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'editpublication/:id',
    loadChildren: () => import('./pages/editpublication/editpublication.module').then( m => m.EditpublicationPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'editproducts/:id',
    loadChildren: () => import('./pages/editproducts/editproducts.module').then( m => m.EditproductsPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'edituser/:id',
    loadChildren: () => import('./pages/edituser/edituser.module').then( m => m.EdituserPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'modalProduct',
    loadChildren: () => import('./pages/modal-product/modal-product.module').then( m => m.ModalProductPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'modal-agendar',
    loadChildren: () => import('./pages/modal-agendar/modal-agendar.module').then( m => m.ModalAgendarPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'historial',
    loadChildren: () => import('./pages/historial/historial.module').then( m => m.HistorialPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'userModal',
    loadChildren: () => import('./pages/user-modal/user-modal.module').then( m => m.UserModalPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'recoverPassword',
    loadChildren: () => import('./pages/recover-password/recover-password.module').then( m => m.RecoverPasswordPageModule),
    canActivate : [NologinGuard]
  },
  {
    path: 'editCupos/:id',
    loadChildren: () => import('./pages/edit-cupos/edit-cupos.module').then( m => m.EditCuposPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'editCalendar/:id',
    loadChildren: () => import('./pages/edit-calendar/edit-calendar.module').then( m => m.EditCalendarPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'rate',
    loadChildren: () => import('./pages/rate/rate.module').then( m => m.RatePageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'petdata',
    loadChildren: () => import('./pages/petdata/petdata.module').then( m => m.PetdataPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'analytics',
    loadChildren: () => import('./pages/analytics/analytics.module').then( m => m.AnalyticsPageModule),
    canActivate : [AuthGuard]
  },
  {
    path: 'terminos',
    loadChildren: () => import('./pages/terminos/terminos.module').then( m => m.TerminosPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module').then( m => m.LandingPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
