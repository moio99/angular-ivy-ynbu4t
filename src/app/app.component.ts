import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { basicCell } from './app.interface';

@Component({
  selector: 'littlerobot-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Snake Morty';

  mars: basicCell[][] = [];
  row = 0;
  colum = 0;
  orientation = 's';
  movement = '0,0';
  mineral = '0,0';
  mineralNewPosition = true;
  secondsToNewMineralPosition = 10;
  nextTime = new Date();
  activeCell: basicCell = {
    isRobot: true,
    isMineral: false,
    isWagon: false,
    row: this.row,
    colum: this.colum,
    img: this.orientation
  };
  results: string[] = [];
  wagons: string[] = [];
  lastWagonMovement = '0,0';
  intructions = '';

  async ngOnInit(): Promise<void> {
    for (let i = 0; i < 10; i++) {
      this.mars[i] = [];
      for (let j = 0; j < 10; j++) {
        const newCell: basicCell = {
          isRobot: false,
          isMineral: false,
          isWagon: false,
          row: i,
          colum: j,
          img: this.orientation
        };
        this.mars[i][j] = newCell;
      }
    }
    this.mars[this.row][this.colum] = this.activeCell;

    this.setRandomMineral();
    let now = new Date();
    this.nextTime = new Date();
    while (this.wagons.length < 99) {
      now = new Date();
      console.log(now);

      if (this.mineralNewPosition || now > this.nextTime) {
        this.setRandomMineral();
        this.mineralNewPosition = false;
        this.nextTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes(),
          now.getSeconds() + this.secondsToNewMineralPosition
        );
      }

      await this.delay(500);
    }

    this.mineral = ''; // Hiden the mineral.
    this.results.push('You caught ' + this.wagons.length) + '!!!!!!!!!!!!!';
  }

  /**
   * Take a break from the time that passes.
   * @param ms Time in miliseconds.
   */
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Set a random value to place the mineral.
   */
  setRandomMineral() {
    let newPosition = this.mineral;
    while (this.isCellInUse(newPosition)) {
      newPosition = `${this.getRandomMineral(1, 9)},${this.getRandomMineral(
        0,
        9
      )}`;
    }
    this.mineral = newPosition;
  }

  /**
   * Set a random value to place the mineral.
   * @param min Minimal value for random.
   * @param max Maximum value for random.
   * @returns Value between min and max.
   */
  getRandomMineral(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * Check if an opposition is already occupied.
   * @param newPosition New position to be verified.
   * @returns True if already occupied.
   */
  isCellInUse(newPosition: string): boolean {
    let cellInUse = false;
    if (newPosition === this.mineral) {
      cellInUse = true;
    } else {
      this.wagons.forEach(wagon => {
        if (newPosition === wagon) {
          cellInUse = true;
        }
      });
    }
    return cellInUse;
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
      const userInstructions = text.toLowerCase().split(' ');
      userInstructions.forEach(instruction => {
        this.manageInstruction(instruction);
      });
    } else {
      this.manageInstruction(text);
    }

    this.intructions = '';
  }

  /**
   *
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

    const element = this.results.find(
      item => item === tempRow + ',' + tempColum
    );
    if (element == undefined) {
      if (
        tempRow > 9 ||
        tempRow < 0 ||
        tempColum > 9 ||
        tempColum < 0 ||
        this.isCollision(tempRow + ',' + tempColum)
      ) {
        // Falls off the board.
        this.removeOldestResult();
        this.results.push(tempRow + ',' + tempColum + ' FAIL');
        this.row = 0;
        this.colum = 0;
        this.orientation = 's';
        this.wagons = [];
      } else {
        // Mineral obtained.
        if (tempRow + ',' + tempColum === this.mineral) {
          this.mineral = ''; // Hiden the mineral.
          this.removeOldestResult();
          this.results.push(tempRow + ',' + tempColum + ' Mineral obtained');
          this.addWagon();

          this.mineralNewPosition = true;
        } else {
          this.moveWagons();
        }
        this.row = tempRow;
        this.colum = tempColum;
      }
      this.movement = this.row + ',' + this.colum;
    }
  }

  /**
   * If there are 32 results, delete the oldest.
   */
  removeOldestResult() {
    if (this.results.length == 32) {
      const newResults: string[] = [];
      for (let index = 1; index < this.results.length; index++)
        newResults.push(this.results[index]);
      this.results = [];
      newResults.forEach(result => {
        this.results.push(result);
      });
    }
  }

  /**
   * Verify that the robot does not step on one of the wagons.
   * @param newPosition New position to be verified.
   * @returns True if already occupied.
   */
  isCollision(newPosition: string): boolean {
    let cellInUse = false;

    this.wagons.forEach(wagon => {
      if (newPosition === wagon) {
        cellInUse = true;
      }
    });

    return cellInUse;
  }

  /**
   * Add a wagon, the array is copied so that the change is detectable.
   */
  addWagon() {
    const newWagons: string[] = [];
    this.wagons.forEach(wagon => {
      newWagons.push(wagon);
    });
    newWagons.push(this.movement);

    this.wagons = []; // This is critical for it to be aware of the change.
    newWagons.forEach(wagon => {
      this.wagons.push(wagon);
    });
  }

  /**
   * Move the wagons, you must add the last position of the robot at the end, and remove the first position (the last wagon).
   */
  moveWagons() {
    if (this.wagons.length > 0) {
      const newWagons: string[] = [];
      if (this.wagons.length > 1) {
        for (let index = 1; index < this.wagons.length; index++) {
          newWagons.push(this.wagons[index]);
        }
      }
      this.lastWagonMovement = this.wagons[0];
      newWagons.push(this.movement);

      this.wagons = [];
      newWagons.forEach(wagon => {
        this.wagons.push(wagon);
      });
    } else {
      this.lastWagonMovement = this.movement;
    }
  }
}
