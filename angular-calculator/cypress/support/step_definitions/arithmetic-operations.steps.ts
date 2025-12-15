import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CalculatorPage } from '../page-objects/calculator.page';

const calculatorPage = new CalculatorPage();

When('я ввожу первое число {string}', (number: string) => {
  calculatorPage.enterFirstNumber(number);
});

When('я ввожу второе число {string}', (number: string) => {
  calculatorPage.enterSecondNumber(number);
});

When('я выбираю операцию {string}', (operation: string) => {
  const operationMap: Record<string, 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE'> = {
    'Сложить': 'ADD',
    'Вычесть': 'SUBTRACT',
    'Умножить': 'MULTIPLY',
    'Разделить': 'DIVIDE'
  };
  calculatorPage.selectOperation(operationMap[operation]);
});

Then('результат должен быть {string}', (expectedResult: string) => {
  calculatorPage.verifyResult(expectedResult);
});
