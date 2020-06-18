import { Component, OnInit } from '@angular/core';
import Swal from'sweetalert2';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  hide = true;
  value = 'Clear me';
  btn = '';
  constructor(private route: ActivatedRoute, private router: Router) { }

  iniciarSesion(){
    this.router.navigate(['/estudiante'], { relativeTo: this.route });
    
  }
  registro(){
    //Regitrar en bd

    Swal.fire({
      icon: 'success',
      title: 'Bienvenido',
      text: 'Tu registro fue exitoso',
      timer: 2500,
      showConfirmButton: false
    });

    //te lleve a tu cuenta
  }

  ngOnInit(): void {
  }
}
