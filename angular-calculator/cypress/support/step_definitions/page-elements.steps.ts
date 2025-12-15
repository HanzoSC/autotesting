import { Then } from '@badeball/cypress-cucumber-preprocessor';
import { CalculatorPage } from '../page-objects/calculator.page';

const calculatorPage = new CalculatorPage();

Then('я должен видеть поле для ввода первого числа', () => {
  calculatorPage.verifyPageElements();
  cy.get('app-number-input').first().find('input').should('exist');
});

Then('я должен видеть поле для ввода второго числа', () => {
  cy.get('app-number-input').last().find('input').should('exist');
});

Then('я должен видеть выпадающий список операций', () => {
  cy.get('select.form-control:last-of-type').should('exist');
});

Then('я должен видеть выпадающий список систем счисления', () => {
  cy.get('select:first').should('exist');
});

Then('я должен видеть кнопку для вычисления результата', () => {
  cy.get('button').contains('Вычислить').should('exist');
});
