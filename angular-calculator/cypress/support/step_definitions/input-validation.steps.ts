import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CalculatorPage } from '../page-objects/calculator.page';

const calculatorPage = new CalculatorPage();

Given('я выбрал десятичную систему счисления', () => {
  calculatorPage.selectNumberBase(10);
});

When('я выбираю систему счисления {int}', (base: number) => {
  calculatorPage.selectNumberBase(base);
});

When('я пытаюсь ввести буквы в поле ввода', () => {
  cy.get('app-number-input').first().find('input').clear().type('abc');
});

Then('буквы не должны быть введены', () => {
  cy.get('app-number-input').first().find('input').should('not.have.value', 'abc');
});

Then('я могу вводить только цифры от 0 до 9', () => {
  // Проверяем, что можно ввести цифры
  cy.get('app-number-input').first().find('input').clear().type('123');
  cy.get('app-number-input').first().find('input').should('have.value', '123');
  
  // Проверяем, что буквы не вводятся
  cy.get('app-number-input').first().find('input').clear().type('abc');
  cy.get('app-number-input').first().find('input').should('not.contain.value', 'abc');
});

// Используем регулярное выражение для более гибкого сопоставления
Then(/^я могу вводить только символы (.+)$/, (validChars: string) => {
  // Парсим строку допустимых символов (например, "0-1", "0-7", "0-9", "0-9, A-F")
  const input = cy.get('app-number-input').first().find('input');
  
  if (validChars.includes('0-1')) {
    // Для двоичной системы: можно вводить 0 и 1
    input.clear().type('01');
    input.should('have.value', '01');
    input.clear().type('10');
    input.should('have.value', '10');
  } else if (validChars.includes('0-7')) {
    // Для восьмеричной системы: можно вводить 0-7
    input.clear().type('01234567');
    input.should('have.value', '01234567');
  } else if (validChars.includes('0-9') && !validChars.includes('A-F')) {
    // Для десятичной системы: можно вводить 0-9
    input.clear().type('0123456789');
    input.should('have.value', '0123456789');
  } else if (validChars.includes('0-9') && validChars.includes('A-F')) {
    // Для шестнадцатеричной системы: можно вводить 0-9 и A-F
    input.clear().type('0123456789ABCDEF');
    input.should('have.value', '0123456789ABCDEF');
  }
});

// Используем регулярное выражение для более гибкого сопоставления
Then(/^я не могу вводить символы (.+)$/, (invalidChars: string) => {
  const input = cy.get('app-number-input').first().find('input');
  
  if (invalidChars.includes('2-9')) {
    // Для двоичной системы: нельзя вводить 2-9
    input.clear();
    input.type('2');
    input.should('not.have.value', '2');
    input.clear();
    input.type('9');
    input.should('not.have.value', '9');
  } else if (invalidChars.includes('8-9')) {
    // Для восьмеричной системы: нельзя вводить 8-9
    input.clear();
    input.type('8');
    input.should('not.have.value', '8');
    input.clear();
    input.type('9');
    input.should('not.have.value', '9');
  }
  
  if (invalidChars.includes('A-Z')) {
    // Нельзя вводить буквы (или определенные буквы)
    if (invalidChars.includes('G-Z')) {
      // Для шестнадцатеричной: нельзя вводить G-Z
      input.clear();
      input.type('G');
      input.should('not.have.value', 'G');
      input.clear();
      input.type('Z');
      input.should('not.have.value', 'Z');
    } else {
      // Для других систем: нельзя вводить A-Z
      input.clear();
      input.type('A');
      input.should('not.have.value', 'A');
      input.clear();
      input.type('Z');
      input.should('not.have.value', 'Z');
    }
  }
  
  if (invalidChars.includes('!@#')) {
    // Нельзя вводить специальные символы
    input.clear();
    input.type('!@#');
    input.should('not.have.value', '!@#');
  }
});
