import { SessionService } from './../../services/session.service';
import { UsuarioModel } from './../../modelos/usuario.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as firebase from 'firebase';
import { ErrorStateMatcher } from '@angular/material/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Observable } from 'rxjs';
/*import { SpeechService } from 'src/app/services/speech.service'*/

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  //db = firebase.firestore();

  nombre:string;
  hide = true;
  hide2 = true;
  btn = '';
  contraDif = '';
  campos = '';
  contraMin = '';
  errMail = '';
  tipo='hola';
  muroTipo:String;

  currentUser:Observable<UsuarioModel>

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  

  constructor(
    private sessionService:SessionService,
    private storeService:FirestoreService,
    private feedback:FeedbackService,
    private authSvc: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentUser = this.sessionService._user;
    console.log(this.currentUser)
  }

  fnLogout(){
    
    firebase.auth().signOut()
    this.feedback.fnSimple();
  }

  
  async iniciarSesion() {
    
    const email = (document.getElementById('emailLogin') as HTMLInputElement)
      .value;
    const pass = (document.getElementById('passLogin') as HTMLInputElement)
      .value;
    /*try {
      const user = this.authSvc.login(email, pass);
      console.log(user);
      if (user) {
        this.router.navigate(['/estudiante']);
      }
    } catch (error) {
      console.log(error);
    }*/
    this.authSvc.fnFirebaseLogin(email, pass)
      .then(success => {
        if (success) {
          
            setTimeout(() => {
              this.feedback.fnSuccess('Bienvenido',this.sessionService.fnGetLoged().nombre);
              this.muroTipo = this.sessionService.fnGetLoged().tipoUsuario;
              this.router.navigate([`/${this.muroTipo}`]);
              
            }, 2000);
          
          //this.router.navigate(['/estudiante'];
          
        } else {
          this.feedback.fnError('Error',' Usuario o Contraseña incorrectos')
        }
      })
  }

  Perfil(){
    this.router.navigate([`/${this.sessionService.fnGetLoged().tipoUsuario}`]);
  }

  validacion(pass: string, confirm: string, email: string, nom: string) {
    this.contraDif = '';
    this.campos = '';
    this.contraMin = '';
    var bien = true;

    // contraseñas iguales
    if (pass != confirm) {
      this.contraDif = 'Las contraseñas no coinciden';
      bien = false;
    }
    // contraseñas mas de 5 caract
    if (pass.length < 6) {
      this.contraMin = 'Minimo de 6 caracteres';
      bien = false;
    }
    // campos vacios
    if (pass === '' || email === '' || nom === '') {
      this.campos = 'Campos Incompletos';
      bien = false;
    }

    return bien;
  }

  async registro() {
    // Regitrar en bd
    console.log(this.tipo);
    const email = (document.getElementById('emailLogin') as HTMLInputElement)
      .value;
    const pass = (document.getElementById('passLogin') as HTMLInputElement)
      .value;
    const confirm = (document.getElementById('passLoginConfirm') as HTMLInputElement)
      .value;
    const name = (document.getElementById('nameLogin') as HTMLInputElement)
      .value;
    if (this.validacion(pass, confirm, email, name)) {
      try {
        this.authSvc.fnRegister(email, pass)
          .then((uid) => {
            //Si no obtenemos un uid (error en el alta)
            if (!uid) {
              this.feedback.fnError('Ups','Error en el email');
              return;
            }
            
            //Guardamos en db refrencia del usuario
            let obj = {
              email: email,
                nombre: name,
                uid: uid,
                tipoUsuario: 'estudiante'
            }
            this.storeService.fnAddCollection('usuario',obj)
            .then(success=>{
              if(!success){
                //En caso de error al guar en db 
                this.feedback.fnError('Ups','Estamos teniendo algunos problemas intenta mas tarde');
              } else {
                //en caso de exito (proceso terminado correctamente)
                this.feedback.fnSuccess('Bienvenido','Tu registro fue exitoso')
              }
            })
                      });
      } catch (error) {
        console.log(error);
      }
    }

    // te lleve a tu cuenta
  }

  index: number;
  v: number = this.getVolume();
  speechData: any;
  
  ngOnInit(){
    console.log('onInit');
  }


  start(html){
    this.spk.start(html); 
  }
  pause(){
    this.spk.pause();
  }
  resume(){
    this.spk.resume();
  }

  getSpeechData(){    
    this.speechData = this.spk.speechData;
    //this.index = this.speechData.findIndex();
    console.log(this.speechData);
  }

  setVolume(v){
    this.spk.setVolume(v);
  }

  getVolume(){
    return this.spk.getVolume();
  }

  changeVoice(){
    this,this.speechData=this.spk.getSpeechData();
  }

  setLanguage(lang){
    this.spk.setLanguage(lang);
  }
}
