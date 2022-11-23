import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './components/button/button.component';
import { FuelComponent } from './components/fuel/fuel.component';
import { HeaderComponent } from './components/header/header.component';
import { InputComponent } from './components/input/input.component';
import { CentralizedLayoutComponent } from './components/layouts/centralized-layout/centralized-layout.component';
import { StreamsLayoutComponent } from './components/layouts/streams-layout/streams-layout.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MenuComponent } from './components/menu/menu.component';
import { ModalCoreComponent } from './components/modals/modal-core/modal-core.component';
import { StreamTitleModalComponent } from './components/modals/stream-title-modal/stream-title-modal.component';
import { StreamCardComponent } from './components/stream-card/stream-card.component';
import { StreamComponent } from './components/stream/stream.component';
import { StreamsComponent } from './components/streams/streams.component';
import { SwitchComponent } from './components/switch/switch.component';
import { AfterViewInitDirective } from './directives/after-element-init.directive';
import { OnDestroyDirective } from './directives/on-destroy.directive';

@NgModule({
	declarations: [
		AfterViewInitDirective,
		AppComponent,
		ButtonComponent,
		CentralizedLayoutComponent,
		FuelComponent,
		HeaderComponent,
		InputComponent,
		LoaderComponent,
		MenuComponent,
		ModalCoreComponent,
		StreamCardComponent,
		StreamComponent,
		StreamTitleModalComponent,
		StreamsComponent,
		StreamsLayoutComponent,
		SwitchComponent,
		OnDestroyDirective,
	],
	imports: [AppRoutingModule, BrowserModule, FormsModule, HttpClientModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
