import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import * as createBundler from '@bahmutov/cypress-esbuild-preprocessor';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.ts',
    async setupNodeEvents(on, config) {
      const updatedConfig = await addCucumberPreprocessorPlugin(on, config, {
        stepDefinitions: 'cypress/support/step_definitions/**/*.ts',
        messages: {
          enabled: false
        }
      });

      on(
        'file:preprocessor',
        createBundler.default({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      return updatedConfig;
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    chromeWebSecurity: false,
  },
});
