import {Component, HostListener, OnInit} from '@angular/core';
import * as events from "events";

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  public inputValue: string = '';
  public outputValue: string = '0';
  public firstNumber: string = '';
  public secondNumber: string = '';
  public nextNumber: string = '';
  public operation!: any;
  public flagOperations: boolean = false;
  public digit: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '00'];
  public action: string[] = ['-', '+', '/', '*', '√', '%'];
  public math!: any;

  constructor() {
  }

  ngOnInit(): void {
    // console.log('hello')
  }

  sayHello(name: any) {
    return 'Hello' + ' ' + name;
  }

  giveLangCode() {
    return ['ru', 'en', 'ua'];
  }


  onKeyDownNumber(event: any) {
    console.log(event.key);
  }


  clear() {
    this.firstNumber = '';
    this.secondNumber = '';
    this.operation = undefined;
    this.inputValue = '';
    this.outputValue = '0';
  }

  onKeydown(event: any) {
    event.preventDefault();
    if (event.key === "Enter") {
      this.getOperations('=');
      console.log(this.inputValue)
    }
  }

  onKeyClear(event: any) {
    event.preventDefault();
    if (event.key == "Escape") {
      this.clear();
    }
  }

  getOperations(num: string) {

    this.inputValue += num;

    if (this.action.includes(num)) {
      this.operation = num;
    }

    if (this.digit.includes(num)) {
      if (this.firstNumber == '' && this.secondNumber == '' && this.operation == undefined) {
        this.firstNumber = num;
      } else if (this.firstNumber != '' && this.operation == undefined) {
        this.firstNumber += num;
      } else if (this.firstNumber != '' && this.operation != undefined) {
        this.secondNumber += num;
      }
    }

    console.log(this.firstNumber, this.operation, this.secondNumber);

    if (num == '=') {
      this.math = this.getMathHandler();
      this.outputValue = this.firstNumber = this.math(this.inputValue).slice(0, -1);
      this.inputValue = this.outputValue;
      switch (this.operation) {
        case '%' :
          this.firstNumber = this.firstNumber.replace(/\%.*/, '');
          this.outputValue = String(((+this.secondNumber * 100) / +(this.firstNumber)) + '%');
          break;
          return;
      }

      this.secondNumber = '';
      this.firstNumber = this.outputValue;
      this.operation = undefined;
    }

    if (num == '√') {
      this.outputValue = String(+(Math.sqrt(+this.firstNumber)).toFixed(9));
      this.firstNumber = '';
      this.operation = undefined;
      this.inputValue = this.firstNumber = String(this.outputValue)
    }
  }

  getMathHandler() {
    const math = getMathFn();
    let divByZero = false;

    return applyMath;

    function applyMath(math_str: string) {
      divByZero = false;
      throwUnmatchedScopes(math_str);

      math_str = deepRemoveScopes(math_str);
      math_str = autoCorrect(math_str);

      let result = parseLinearMath(math_str);
      return divByZero ? "Ошибка!" : result;
    }


    function deepRemoveScopes(str: string): any {
      str = autoCorrect(str);

      let index = str.indexOf("(");
      if (index === -1) return parseLinearMath(str);

      let scope = "(";
      let open = 1;

      for (let i = index + 1; i <= 100000; i++) {

        scope += str[i];

        if (str[i] === "(") {
          open++;
        } else if (str[i] === ")") {
          open--;
        }

        if (open === 0) {
          return deepRemoveScopes(str.replace(scope, deepRemoveScopes(scope.slice(1, -1))));
        }
      }
    }

    function parseLinearMath(math_str: string) { /* уже точно нет скобок */
      math_str = autoCorrect(math_str);
      math_str = mul_div(math_str);
      math_str = plus_minus(math_str);

      return math_str;

      function mul_div(math_str: string) {
        let length = (math_str.match(/\/|\*/g) || []).length;
        if (!length) return math_str;

        for (let i = 0; i < length; i++) {
          math_str = math_str.replace(
            /(\d+(?:\.\d+)?)(\/|\*)(-?\d+(?:\.\d+)?)/,
            function (_, a, oper, b) {
              return math(a, oper, b);
            }
          );

          math_str = autoCorrect(math_str);
        }

        return math_str;
      }

      function plus_minus(math_str: string) {
        let length = (math_str.match(/\+|-/g) || []).length;
        if (!length) return math_str;

        for (let i = 0; i < length; i++) {
          math_str = math_str.replace(
            /((?:^-)?\d+(?:\.\d+)?)(\+|-)(\d+(?:\.\d+)?)/,
            function (_, a, oper, b) {
              return math(a, oper, b);
            }
          );

          math_str = autoCorrect(math_str);
        }

        return math_str;
      }
    }

    function autoCorrect(math_str: string) {
      return (math_str               // Замены:
          .replace(/\s/g, "")          // Удалить все пробелы
          .replace(/\(\)/g, "")        // Убрать пустые скобки
          .replace(/--/g, "+")         // Два минуса подряд → Плюс
          .replace(/(\+\+|\*\*|\/\/)/g, (_, oper) => oper[0])
          // Двойные плюсы, умножения и пр → на один
          .replace(/\+-|-\+/g, "-")    // Плюс после минуса и наоборот → на минус
          .replace(/\)\(/g, ")*(")     // Две скобки подряд → вставить умножение
          .replace(/(\d)\(/g, "$1*(")  // Число и сразу скобка → умножение
          .replace(/\)(\d)/g, ")*$1")  // Скобка и сразу число → умножение
          .replace(/(\/|\*)\+/g, "$1") // *+ или /+ → убрать плюс
      );
    }

    function throwUnmatchedScopes(math_str: string) {
      let scopes_open = (math_str.match(/\(/g) || []).length;
      let scopes_close = (math_str.match(/\)/g) || []).length;

      if (scopes_open !== scopes_close) {
        throw new Error("Unmatched parenthesis at " + math_str);
      }
    }

    function getMathFn() {
      let local_math: any = {
        "+": (a: any, b: any) => Number(a) + Number(b),
        "-": (a: any, b: any) => a - b,
        "*": (a: any, b: any) => a * b,
        "/": (a: any, b: any) => {
          if (b === "0") {
            divByZero = true;
          }

          return (a / b);
        },
      };

      return function math(a: any, operation: any, b: any) {
        return local_math[operation](a, b);
      }
    }
  }

}
