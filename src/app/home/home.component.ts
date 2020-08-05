import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { MultiplosService } from './multiplos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  quote: string | undefined;
  isLoading = false;

  numero: number = 0;
  resulta: string;

  constructor(
    private quoteService: QuoteService,
    public multiplosServ: MultiplosService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.quoteService.getRandomQuote({ category: 'dev' })
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe((quote: string) => { this.quote = quote; });
  }

  // al presionar el botón de ver se ejecuta la siguiente función
  onClickBtn() {
    // Valido que el numero sea mayor a cero y que haya valor en el campo
    if (this.numero <= 0 || this.numero === undefined) {
      this.resulta = 'Escriba un número mayor a 0';
      return;
    }
    // Inicializo la lista para cada nueva interación, despues ejecuto la función de los 
    // múltimplos que está en un servicio especial y grabo el valor en la base de datos
    this.multiplosServ.multiplosList = [];
    this.resulta = `Los múltiplos del número : ${this.numero}`;
    this.multiplosServ.multiplos(this.numero);
    this.multiplosServ.addMultiplo(this.multiplosServ.multiplo).then(() => {
      alert('Se registro el ejercicio en la DB');
    }).catch(err => console.error(err));
  }

}
