import {Component, OnInit} from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-example',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss']
})
export class ExamplesComponent implements OnInit {

  pattern = new RegExp(/^(?=.*?[äöüÄÖÜß])/);

  constructor() {
  }

  ngOnInit() {
  }

  onStrengthChanged(strength: number) {
    console.log('password strength = ', strength);
  }

}
