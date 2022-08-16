import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Todo } from '../models/todo-model';
import { AppState } from '../../app.reducer';
import * as actions from '../todo.actions';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {

  @Input() todo!: Todo;
  @ViewChild('inputFisico') txtInputFisico!: ElementRef;

  completado: boolean = false;

  chkCompletado!: FormControl;
  txtInput!: FormControl;
  editando: boolean = false;

  constructor(  private store: Store<AppState>) { }

  ngOnInit(): void {
    
    // this.completado = this.todo.completado;
    // this.completado = true;
    this.chkCompletado = new FormControl( this.todo.completado );
    this.txtInput = new FormControl( this.todo.text, Validators.required );

    this.chkCompletado.valueChanges.subscribe( valor => {
      console.log(valor);
      this.store.dispatch( actions.toggle({ id: this.todo.id }) );
    });

  }

  editar(){

    this.editando = true;
    this.txtInput.setValue( this.todo.text );

    setTimeout(() => {
      this.txtInputFisico.nativeElement.select();
    }, 1);

  }

  terminarEdicion(){
    this.editando = false;

    if( this.txtInput.invalid ){ return; }
    if( this.txtInput.value === this.todo.text ){ return; }

    this.store.dispatch(
      actions.editar({
        id: this.todo.id,
        texto: this.txtInput.value
      })
    );

  }

  borra(){

    this.store.dispatch( actions.borrar({ id: this.todo.id }));

  }

}
