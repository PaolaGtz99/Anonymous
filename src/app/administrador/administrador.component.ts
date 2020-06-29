import { SessionService } from './../services/session.service';
import { UsuarioModel } from './../modelos/usuario.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ClauseModel } from '../modelos/clause.model';
import { UsuarioMaterialModel } from '../modelos/usuario-materia.model';
import { MateriaModel } from '../modelos/materia.model';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {


  materias: any = {};
  EncontroAl = '';
  numMaterias = 0;
  materiasusuario: UsuarioMaterialModel[];
  encuentraAl:boolean = false;
  prom: number;
  aux:UsuarioModel;
  value = '';
  user:Observable<UsuarioModel>;

  constructor(
    private sessionService: SessionService,
    private storageService: FirestoreService
  ) {
    this.user = this.sessionService._user;
  }
  buscarMaestro = 'Nombre';
  nuevoM = 'false';
  buscarAlumno = 'Nombre';

  buscar(tipo,nombre){
    let clauses:ClauseModel[] = [
      {key:'nombre',condition:'==',value: nombre} as ClauseModel,
      {key:'tipoUsuario',condition:'==',value:tipo} as ClauseModel
    ];
    this.EncontroAl = '';
    this.encuentraAl = false;
    this.storageService.fnFindByMultipleClauses('usuario',clauses)
    .then((data:any)=>{
      this.aux = null;
      data.forEach(element => {
        this.aux= element.data();
        if(tipo == 'estudiante'){
          this.fnGetMaterias(this.aux.uid);
        }
      });
      console.log("esto",this.aux);
      if(this.aux == null){
        this.EncontroAl = 'No se encontro alumno'
        setTimeout(() => {
          this.EncontroAl = ''
        }, 2000);
        
      }
      else{
        this.encuentraAl = true;
      }
    })
    //console.log(this.storageService.fnGetElementById('usuario','nombre',this.buscarAlumno));
  }

  fnGetMaterias(uid) {
    this.materiasusuario = [];
    this.numMaterias = 0;
    this.materias = {};
    this.prom = 0;
    this.storageService.fnGetElementById('usuario-materia', 'idUsuario', uid)
    .then((data: any) => {
      data.forEach((doc) => {
        this.numMaterias++;
        const aux: UsuarioMaterialModel =  doc.data();
        if (!this.materias[aux.idMateria]) {
          this.fnGetMateria(aux.idMateria);
        }
        this.prom = this.prom + parseFloat('' + aux.nota);
        this.materiasusuario.push(aux);
      });
      
      this.prom = parseFloat((this.prom / (this.numMaterias)).toFixed(2));
      console.log(this.prom,this.materiasusuario)
    });
  }

  fnGetMateria(id: string){
    this.materias[id] = true;
    this.storageService.fnGetElementById('materias', 'uid', id)
    .then((data: any) => {
      data.forEach((doc) => {
        const materia: MateriaModel = doc.data();
        this.materias[materia.uid] = materia.nombre;
        console.log('materias del alumno',this.materias);
      });
    });
  }

  mostrarNM(){
    if (this.nuevoM === 'false') { this.nuevoM = 'true'; }
    else { this.nuevoM = 'false'; }
  }
 
  ngOnInit(): void {
    this.fnGetUsuarioByType('maestro').then((list:any)=>{this.maestroTable = list});
    this.fnGetUsuarioByType('estudiante').then((list:any)=>{this.alumnoTable = list});
  }

  alumnoTable:UsuarioModel[] = [];
  maestroTable:UsuarioModel[] = [];

  fnGetUsuarioByType(type:string){
    return new Promise(resolve=>{
      let list = [];
      this.storageService.fnGetElementById('usuario','tipoUsuario',type)
      .then((data:any)=>{
        data.forEach((doc) => {
          list.push(doc.data());
        });
        resolve(list);
      });
      
    });
    
  }

}