import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-control-group',
  templateUrl: './control-group.component.html',
  styleUrls: ['./control-group.component.scss']
})
export class ControlGroupComponent implements OnInit {
  @Input() title = 'Control Group';

  constructor() { }

  ngOnInit() {
  }

}
