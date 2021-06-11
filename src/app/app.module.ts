import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
//import { SquareCellComponent } from './square-cell/square-cell.component';
import { SquareCellComponent } from './squarecell/squarecell.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent /* , SquareCellComponent */],
  bootstrap: [AppComponent]
})
export class AppModule {}
