import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LayoutComponent } from './layout/layout/layout.component';

const routes: Routes = [
  {
    path: 'auth/register',
    component: RegisterPageComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home', // Ruta hija por defecto
        pathMatch: 'full', // Asegura una redirección solo en la URL raíz vacía.
      },
      {
        path: 'home',
        component: HomePageComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '', // Redirecciona rutas no válidas a la URL raíz
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
