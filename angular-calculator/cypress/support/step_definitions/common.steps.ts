import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CalculatorPage } from '../page-objects/calculator.page';

const calculatorPage = new CalculatorPage();

Given('я открыл страницу калькулятора', () => {
  calculatorPage.visit();
});

When('я нажимаю кнопку вычисления', () => {
  // Устанавливаем перехват ДО нажатия кнопки (важно для корректной работы)
  calculatorPage.setupCalculateIntercept();
  
  // Нажимаем кнопку (внутри метода есть проверка, что кнопка активна)
  calculatorPage.clickCalculate();
  
  // Ждем завершения запроса
  calculatorPage.waitForCalculateRequest();
});
