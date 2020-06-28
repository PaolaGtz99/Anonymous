import { UsuarioModel } from './../modelos/usuario.model';
import { SessionService } from './../services/session.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';
import { UsuarioMaterialModel } from '../modelos/usuario-materia.model';
import { MateriaModel } from '../modelos/materia.model';

firebase.initializeApp(environment.firebaseConfig);

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css']
})
export class EstudianteComponent implements OnInit {
  db = firebase.firestore();

  materias: any = {};

  numMaterias = 0;
  materiasusuario: UsuarioMaterialModel[];

  user: UsuarioModel;

  prom: number;

  constructor(
    private sessionService: SessionService,
    private storeService: FirestoreService
  ) {}

  fnGetMaterias(count: number = 0) {
    this.user = this.sessionService.fnGetLoged();
    if (!this.user.uid && count < 1000){
      setTimeout(() => {
        this.fnGetMaterias(count + 1);
      }, 10);
      return;
    }else if (!this.user.uid){
      // redirigir
    }
    this.materiasusuario = [];
    this.numMaterias = 0;
    this.materias = {};
    this.prom = 0;
    this.storeService.fnGetElementById('usuario-materia', 'idUsuario', this.user.uid)
    .then((data: any) => {
      data.forEach((doc) => {
        this.numMaterias++;
        const aux: UsuarioMaterialModel =  doc.data();
        if (!this.materias[aux.idMateria]) {
          this.fnGetMateria(aux.idMateria);
        }
        this.prom = this.prom + parseFloat('' + aux.nota);
        console.log(this.prom);
        this.materiasusuario.push(aux);
      });
      this.prom = parseFloat((this.prom / (this.numMaterias)).toFixed(2));
    });
  }

  fnGetMateria(id: string){
    this.materias[id] = true;
    this.storeService.fnGetElementById('materias', 'uid', id)
    .then((data: any) => {
      data.forEach((doc) => {
        const materia: MateriaModel = doc.data();
        this.materias[materia.uid] = materia.nombre;
        console.log(this.materias);
      });
    });
  }

  ngOnInit(): void {
    this.fnGetMaterias();
    /*
    const tabla = document.getElementById('tabla');
    const prom = document.getElementById('prom');
    this.db.collection('materias').onSnapshot((querySnapshot) => {
      tabla.innerHTML = '';
      prom.innerHTML = '';
      let x = 0;
      let y = 0;
      querySnapshot.forEach((doc) => {
        tabla.innerHTML += `
          <tr>
            <th scope="row">${doc.id}</th>
            <td>${doc.data().title}</td>
            <td>${doc.data().grade}</td>
          </tr>
          `;
        x += doc.data().grade;
        y++;
      });
      x = x / y;
      prom.innerHTML = `${x}`;
    });*/
  }
}
