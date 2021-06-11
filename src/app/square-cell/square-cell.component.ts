import { Component, OnInit, Input } from '@angular/core';
import { basicCell } from '../app.interface';

@Component({
  selector: 'littlerobot-square-cell',
  templateUrl: './square-cell.component.html',
  styleUrls: ['./square-cell.component.css']
})
export class SquareCellComponent implements OnInit {
  @Input() myCell: basicCell = { isRobot: false, row: 0, colum: 0, img: 's' };
  @Input() robotOrientation: string = 's';
  @Input('robotMovement')
  set setVitalDataRow(data: string) {
    if (
      data != undefined &&
      data == this.myCell.row + ',' + this.myCell.colum
    ) {
      this.myCell.isRobot = true;
    } else {
      this.myCell.isRobot = false;
    }
  }

  constructor() {}

  ngOnInit(): void {}
}
