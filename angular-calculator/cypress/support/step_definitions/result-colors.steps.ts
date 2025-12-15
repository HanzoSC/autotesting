import { Then } from '@badeball/cypress-cucumber-preprocessor';
import { CalculatorPage } from '../page-objects/calculator.page';

const calculatorPage = new CalculatorPage();

// Шаг для значений из таблицы Examples (без кавычек)
Then('результат должен отображаться цветом {word}', (color: string) => {
  // Ждем появления результата
  cy.get('.result', { timeout: 5000 }).should('be.visible');
  
  const colorMap: Record<string, 'red' | 'black' | 'green'> = {
    'green': 'green',
    'red': 'red',
    'black': 'black'
  };
  calculatorPage.verifyResultColor(colorMap[color] || 'black');
});

// Шаг для значений в кавычках (если понадобится)
Then('результат должен отображаться цветом {string}', (color: string) => {
  // Ждем появления результата
  cy.get('.result', { timeout: 5000 }).should('be.visible');
  
  const colorMap: Record<string, 'red' | 'black' | 'green'> = {
    'green': 'green',
    'red': 'red',
    'black': 'black'
  };
  calculatorPage.verifyResultColor(colorMap[color] || 'black');
});
