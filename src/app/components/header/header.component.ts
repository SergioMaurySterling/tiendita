import { Component, OnInit, Input } from '@angular/core';
import { Componente } from '../../interfaces/interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() titulo: string;
  @Input() color: string;

  componentes: Componente[] = [];

  constructor() { }

  ngOnInit() {}

}
