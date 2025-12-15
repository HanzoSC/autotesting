import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CalculatorPage } from '../page-objects/calculator.page';

const calculatorPage = new CalculatorPage();

When('я выбираю шестнадцатеричную систему счисления', () => {
  calculatorPage.selectNumberBase(16);
});

Then('я могу вводить цифры от 0 до 9', () => {
  cy.get('app-number-input').first().find('input').clear().type('123');
  cy.get('app-number-input').first().find('input').should('have.value', '123');
});

Then('я могу вводить буквы от A до F', () => {
  cy.get('app-number-input').first().find('input').clear().type('ABC');
  cy.get('app-number-input').first().find('input').should('have.value', 'ABC');
  
  cy.get('app-number-input').first().find('input').clear().type('DEF');
  cy.get('app-number-input').first().find('input').should('have.value', 'DEF');
});

Then('я не могу вводить буквы после F', () => {
  cy.get('app-number-input').first().find('input').clear();
  cy.get('app-number-input').first().find('input').type('G');
  cy.get('app-number-input').first().find('input').should('not.have.value', 'G');
  
  cy.get('app-number-input').first().find('input').clear();
  cy.get('app-number-input').first().find('input').type('Z');
  cy.get('app-number-input').first().find('input').should('not.have.value', 'Z');
});

Then('я не могу вводить другие символы', () => {
  cy.get('app-number-input').first().find('input').clear();
  cy.get('app-number-input').first().find('input').type('!@#');
  cy.get('app-number-input').first().find('input').should('not.have.value', '!@#');
});
