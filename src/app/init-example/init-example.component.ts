import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-init-example',
  templateUrl: './init-example.component.html',
  styleUrls: ['./init-example.component.scss']
})
export class InitExampleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
