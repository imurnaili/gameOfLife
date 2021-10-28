import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  uiSize = 10;

  title = 'gameOfLife';
  private frame = 0;
  wrapping = true;
  paused = true;
  intervallId: number | null = null;

  private input: Array<Array<boolean>> = [];
  board: Array<Array<boolean>> = [];

  constructor(){

  }

  ngOnInit(){
    //initialize promise Recursion
    this.resize(10);
  }

  togglePause(){
    if (!this.paused) {
      clearInterval(this.intervallId ?? NaN)
    } else {
      this.intervallId = setInterval(()=>{this.step.apply(this)}, 100);
    }
    console.log(this.paused);
    this.paused = !this.paused;
  }

  reset(){
    this.board = this.input;
    this.frame = 0;
    clearInterval(this.intervallId ?? NaN)
    this.paused = true;
  }

  step(){
    if(this.frame === 0){
      this.input = this.coppyMatrix(this.board);
    }
    let coppy = this.coppyMatrix(this.board);
    this.solve(coppy, this.board);
    this.frame++;
  }

  coppyMatrix(matrix: Array<Array<boolean>>){
    return matrix.map((e) => e.slice());
  }

  // try if edge cases work
  solve(input: Array<Array<boolean>>, output: Array<Array<boolean>>){
    for (let i = 0; i < input.length; i++) {
      for (let j = 0; j < input.length; j++) {
        let summ = 0;

        // i - 1
        let _i = (i > 0)
          ? i - 1
          : ((this.wrapping) ? input.length - 1 : -1);
        // i + 1
        let i_ = (i < input.length - 1)
          ? i + 1
          : ((this.wrapping) ? 0 : -1);
        // j - 1
        let _j = (j > 0)
          ? j - 1
          : ((this.wrapping) ? input.length - 1 : -1);
        // j + 1
        let j_ = (j < input.length - 1)
          ? j + 1
          : ((this.wrapping) ? 0 : -1);

        summ += +(input[i_]?.[j_] ?? false);
        summ += +(input[i_]?.[_j] ?? false);
        summ += +(input[i_]?.[j] ?? false);

        summ += +(input[_i]?.[j_] ?? false);
        summ += +(input[_i]?.[_j] ?? false);
        summ += +(input[_i]?.[j] ?? false);

        summ += +(input[i]?.[j_] ?? false);
        summ += +(input[i]?.[_j] ?? false);

        if(input[i][j]){
          output[i][j] = summ === 3 || summ === 2;
        } else {
          output[i][j] = summ === 3;
        }
      }
    }
  }

  resize(size: number){
    if (size >= this.input.length) {
      this.input = this.expandMatix(this.input, size);
      this.board = this.expandMatix(this.board, size);
    }
    else {
      this.input = this.reduceMatrix(this.input, size);
      this.board = this.reduceMatrix(this.board, size);
    }
  }

  expandMatix(matrix: Array<Array<boolean>>, size: number): Array<Array<boolean>> {

    if(matrix.length > size)
      throw new Error("size smaler than length");
    // Extens Existing Arrays
    // example: old 1 new 3
    // [
    //  [true]
    // ]
      // =>
    // [
    //  [true, false, false]
    // ]
    let tmp = matrix.map(e => {
      return e.concat(Array(size - matrix.length).fill(false));
    });

    // Ads new Arrays
    // [
    //  [true, false, false]
    // ]
      // =>
    // [
    //  [true, false, false],
    //  [false, false, false],
    //  [false, false, false]
    // ]
    return tmp.concat(Array.from({length: size - tmp.length}, e => Array(size).fill(false)));
  }

  reduceMatrix(matrix: Array<Array<boolean>>, size: number): Array<Array<boolean>>{

    if(matrix.length < size)
      throw new Error("size greater than length");

      if(0 > size)
      throw new Error("size less than 0");

    //reduce outer array
    let tmp = matrix.slice(0, size);
    tmp = tmp.map((e) => {
      return e.slice(0, size);
    });

    return tmp;
  }
}
