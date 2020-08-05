import { Injectable } from '@angular/core';
import { Multiplo, Multiplos } from './multiplos.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MultiplosService {

  multiplo: Multiplo;
  multiplosList: Multiplos[] = [];

  regCollection = 'multiplos';

  constructor(
    private afStore: AngularFirestore
  ) { }

  // función que determina si es el número es multiplo de un valor dado
  esMultiplo(valor: number, multiplo: number) {
    let residuo = valor % multiplo;
    if (valor == 0) {
      return false;
    }
    if (residuo == 0) {
      return true;
    } else {
      return false;
    }
  }

  // Esta función es la que recorre desde el 0 hasta el número dado y establece que múltiplo aplica,
  // esto llena un arreglo que despues paso para grabar en la DB, este lo obtengo del modelo Multiplos
  multiplos(numero: number) {
    for (let i = 0; i <= numero; i++) {
      if (this.esMultiplo(i, 3) && this.esMultiplo(i, 5) && this.esMultiplo(i, 7)) {
        this.multiplosList.push({numero: i, clase: 'verde', mults: '[3, 5 y 7]'});
      } else {
        if (this.esMultiplo(i, 3) && this.esMultiplo(i, 5)) {
          this.multiplosList.push({numero: i, clase: 'verde', mults: '[3 y 5]'});
        } else if (this.esMultiplo(i, 3) && this.esMultiplo(i, 7)) {
          this.multiplosList.push({numero: i, clase: 'verde', mults: '[3 y 7]'});
        } else if (this.esMultiplo(i, 5) && this.esMultiplo(i, 7)) {
          this.multiplosList.push({numero: i, clase: 'rojo', mults: '[5 y 7]'});
        } else {
          if (this.esMultiplo(i, 3)) {
            this.multiplosList.push({numero: i, clase: 'verde', mults: '[3]'});
          } else if (this.esMultiplo(i, 5)) {
            this.multiplosList.push({numero: i, clase: 'rojo', mults: '[5]'});
          } else if (this.esMultiplo(i, 7)) {
            this.multiplosList.push({numero: i, clase: 'azul', mults: '[7]'});
          } else {
            this.multiplosList.push({numero: i, clase: 'nada', mults: ''});
          }
        }
      }
    }
    // Una ves que lleno la lista de los números y sus múltiplos, lo cargo al modelo principal que se grabará
    this.multiplo = {input: numero, multis: this.multiplosList};
  }

  // Función para grabar en la base de datos de firebase
  addMultiplo(registro: Multiplo) {
    const id = btoa(escape(JSON.stringify('reg' + Date.now().toString())));
    return this.afStore.collection(this.regCollection).doc(id).set(registro);
  }

}
