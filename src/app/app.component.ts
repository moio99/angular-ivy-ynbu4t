import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { basicCell } from './app.interface';

@Component({
  selector: 'littlerobot-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'robotin';

  mars: basicCell[][] = [];
  row = 0;
  colum = 0;
  orientation = 's';
  movement = '0,0';
  activeCell: basicCell = {
    isRobot: true,
    row: this.row,
    colum: this.colum,
    img: this.orientation
  };
  results = '';
  fails: string[] = [];
  intructions: string = '';

  ngOnInit(): void {
    for (let i = 0; i < 10; i++) {
      this.mars[i] = [];
      for (var j = 0; j < 10; j++) {
        let newCell: basicCell = {
          isRobot: false,
          row: i,
          colum: j,
          img: this.orientation
        };
        this.mars[i][j] = newCell;
      }
    }

    this.mars[this.row][this.colum] = this.activeCell;
  }

  /**
   * Receive the event of the keys: Enter, Left arrow o Down arrow.
   * @param e Evento que desencadena la llamada a esta función.
   */
  checkKey(e: any) {
    switch (e.keyCode) {
      case 13:
        // Enter: manage instructions.
        this.manageInstructions(this.intructions);
        break;
      case 37:
        // Left arrow: the robot turns left 90 degrees.
        this.leftTurn();
        break;
      case 39:
        // Right arrow: the robot turns right 90 degrees.
        this.rightTurn();
        break;
      case 40:
        // Down arrow. Go Forward.
        this.forward();
        break;
    }
  }

  /**
   * Manage a line of instructions.
   * @param text instructions.
   */
  manageInstructions(text: string) {
    if (text.length > 1) {
      let userInstructions = text.toLowerCase().split(' ');
      userInstructions.forEach(instruction => {
        this.manageInstruction(instruction);
      });
    } else {
      this.manageInstruction(text);
    }

    this.intructions = '';
  }

  /**
   * Manage an instruction of a line.
   * @param instruction only one instruction.
   */
  manageInstruction(instruction: string) {
    switch (instruction) {
      case 'l':
        // Left arrow: the robot turns left 90 degrees.
        this.leftTurn();
        break;
      case 'r':
        // Right arrow: the robot turns right 90 degrees.
        this.rightTurn();
        break;
      case 'f':
        // Down arrow. Go Forward.
        this.forward();
        break;
    }
  }

  /**
   * Turn the robot 90 degrees to the left.
   */
  leftTurn() {
    switch (this.orientation) {
      case 's':
        this.orientation = 'w';
        break;
      case 'w':
        this.orientation = 'n';
        break;
      case 'n':
        this.orientation = 'e';
        break;
      case 'e':
        this.orientation = 's';
        break;
    }
  }

  /**
   * Turn the robot 90 degrees to the right.
   */
  rightTurn() {
    switch (this.orientation) {
      case 's':
        this.orientation = 'e';
        break;
      case 'e':
        this.orientation = 'n';
        break;
      case 'n':
        this.orientation = 'w';
        break;
      case 'w':
        this.orientation = 's';
        break;
    }
  }

  /**
   * Move the robot around the grid, if it falls outside it stores that position so that it can fall back in the same place.
   */
  forward() {
    let tempRow = this.row;
    let tempColum = this.colum;
    switch (this.orientation) {
      case 's':
        tempRow++;
        break;
      case 'e':
        tempColum++;
        break;
      case 'n':
        tempRow--;
        break;
      case 'w':
        tempColum--;
        break;
    }

    const element = this.fails.find(item => item === tempRow + ',' + tempColum);
    if (element == undefined) {
      if (tempRow > 9 || tempRow < 0 || tempColum > 9 || tempColum < 0) {
        this.results = 'FAIL';
        this.fails.push(tempRow + ',' + tempColum);
        this.row = 0;
        this.colum = 0;
        this.orientation = 's';
      } else {
        this.row = tempRow;
        this.colum = tempColum;
      }
      this.movement = this.row + ',' + this.colum;
    }
  }
}
