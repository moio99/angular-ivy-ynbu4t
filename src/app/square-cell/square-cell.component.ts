import { Component, OnInit, Input } from '@angular/core';
import { basicCell } from '../app.interface';

@Component({
  selector: 'littlerobot-square-cell',
  templateUrl: './square-cell.component.html',
  styleUrls: ['./square-cell.component.css']
})
export class SquareCellComponent {
  rotation = 0;

  @Input() myCell: basicCell = {
    isRobot: false,
    isMineral: false,
    isWagon: false,
    row: 0,
    colum: 0,
    img: 's'
  };
  @Input()
  set robotOrientation(data: string) {
    switch (data) {
      case 'n':
        this.rotation = 180;
        break;
      case 'w':
        this.rotation = 90;
        break;
      case 'e':
        this.rotation = 270;
        break;
      default:
        this.rotation = 0;
        break;
    }
  }
  @Input()
  set robotMovement(data: string) {
    if (
      data != undefined &&
      data == this.myCell.row + ',' + this.myCell.colum
    ) {
      this.myCell.isRobot = true;
    } else {
      this.myCell.isRobot = false;
    }
  }
  @Input()
  set mineral(data: string) {
    if (
      data != undefined &&
      data == this.myCell.row + ',' + this.myCell.colum
    ) {
      this.myCell.isMineral = true;
    } else {
      this.myCell.isMineral = false;
    }
  }
  @Input()
  set wagons(data: string[]) {
    let isWagon = false;
    data.forEach(wagon => {
      if (wagon == this.myCell.row + ',' + this.myCell.colum) {
        isWagon = true;
      }
    });
    this.myCell.isWagon = isWagon;
  }
}
