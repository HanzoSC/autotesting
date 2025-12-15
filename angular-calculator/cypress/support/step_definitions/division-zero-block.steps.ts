import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CalculatorPage } from '../page-objects/calculator.page';

const calculatorPage = new CalculatorPage();

When('я пытаюсь ввести {string} во второе поле ввода', (value: string) => {
  cy.get('app-number-input').last().find('input').clear();
  cy.get('app-number-input').last().find('input').type(value);
});

Then('ввод нуля должен быть заблокирован', () => {
  // После попытки ввести 0, поле должно остаться пустым или значение должно быть удалено
  cy.get('app-number-input').last().find('input').should('not.have.value', '0');
});

Then('кнопка вычисления должна быть неактивна', () => {
  calculatorPage.verifyCalculateButtonDisabled();
});
