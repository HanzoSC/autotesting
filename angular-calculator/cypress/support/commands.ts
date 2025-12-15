/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to wait for Angular to be ready
       */
      waitForAngular(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('waitForAngular', () => {
  cy.window().then((win) => {
    // Wait for Angular to be ready
    return new Cypress.Promise((resolve) => {
      if (win.ng) {
        resolve();
      } else {
        setTimeout(() => resolve(), 100);
      }
    });
  });
});

export {};
