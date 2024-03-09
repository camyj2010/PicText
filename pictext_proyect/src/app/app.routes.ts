import { Routes } from '@angular/router';
import { PicTextComponent } from './pic-text/pic-text.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
	{
		path: 'pic-text', component: PicTextComponent
	},
	{
		path: 'home', component: HomeComponent
	},
	{
		path: 'register', component: RegisterComponent
	},
	{
		path: 'login', component: LoginComponent
	}
];
