import { AfterElementInitDirective } from './directives/after-element-init.directive';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { DefaultModalComponent } from './components/modals/default-modal/default-modal.component';
import { FormsModule } from '@angular/forms';
import { FuelComponent } from './components/fuel/fuel.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { InputComponent } from './components/input/input.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MenuComponent } from './components/menu/menu.component';
import { ModalCoreComponent } from './components/modals/modal-core/modal-core.component';
import { NgModule } from '@angular/core';
import { StreamCardComponent } from './components/stream-card/stream-card.component';
import { StreamComponent } from './components/stream/stream.component';
import { StreamsComponent } from './components/streams/streams.component';
import { SwitchComponent } from './components/switch/switch.component';

@NgModule({
	declarations: [
		AfterElementInitDirective,
		AppComponent,
		DefaultModalComponent,
		FuelComponent,
		HeaderComponent,
		InputComponent,
		LoaderComponent,
		MenuComponent,
		ModalCoreComponent,
		StreamCardComponent,
		StreamComponent,
		StreamsComponent,
		SwitchComponent,
	],
	imports: [AppRoutingModule, BrowserModule, FormsModule, HttpClientModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
