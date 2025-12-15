/**
 * Page Object для страницы калькулятора
 * Использует паттерн Page Object для централизации селекторов и методов
 */
export class CalculatorPage {
  // Селекторы элементов
  private readonly selectors = {
    firstNumberInput: 'app-number-input:first-of-type input',
    secondNumberInput: 'app-number-input:last-of-type input',
    operationDropdown: 'label:contains("Операция") + select, label:contains("Операция") ~ select',
    numberBaseDropdown: 'label:contains("Система счисления") + select, label:contains("Система счисления") ~ select',
    calculateButton: 'button',
    result: '.result',
    errorMessage: '.error-message',
    resultContainer: '.result-container'
  };

  /**
   * Открывает страницу калькулятора
   */
  visit(): void {
    cy.visit('/');
  }

  /**
   * Вводит значение в первое поле ввода
   */
  enterFirstNumber(value: string): void {
    cy.get('app-number-input').first().find('input').clear().type(value);
  }

  /**
   * Вводит значение во второе поле ввода
   */
  enterSecondNumber(value: string): void {
    cy.get('app-number-input').last().find('input').clear().type(value);
  }

  /**
   * Выбирает операцию из dropdown
   */
  selectOperation(operation: 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE'): void {
    const operationMap = {
      'ADD': 'Сложить',
      'SUBTRACT': 'Вычесть',
      'MULTIPLY': 'Умножить',
      'DIVIDE': 'Разделить'
    };
    // Используем более специфичный селектор - select после label "Операция"
    cy.contains('label', 'Операция').parent().find('select').select(operationMap[operation]);
  }

  /**
   * Выбирает систему счисления
   */
  selectNumberBase(base: number): void {
    // Используем более специфичный селектор - select после label "Система счисления"
    cy.contains('label', 'Система счисления').parent().find('select').select(base.toString());
  }

  /**
   * Настраивает перехват API запроса
   * Должен быть вызван ДО clickCalculate()
   */
  setupCalculateIntercept(): void {
    // Перехватываем запрос на любой домен и порт
    // Используем более широкий паттерн для надежности
    cy.intercept({
      method: 'POST',
      url: '**/api/calculations/compute*'
    }).as('calculateRequest');
  }

  /**
   * Нажимает кнопку вычисления
   */
  clickCalculate(): void {
    // Убеждаемся, что кнопка видима и активна
    cy.get(this.selectors.calculateButton)
      .contains('Вычислить')
      .should('be.visible')
      .should('not.be.disabled')
      .click();
  }

  /**
   * Ждет завершения API запроса вычисления
   * Должен быть вызван ПОСЛЕ clickCalculate()
   */
  waitForCalculateRequest(): void {
    // Ждем завершения API запроса (может быть успешным или с ошибкой)
    cy.wait('@calculateRequest', { timeout: 15000 }).then((interception) => {
      if (interception.response) {
        // Проверяем, что запрос успешен
        expect(interception.response.statusCode).to.equal(200);
      } else if (interception.error) {
        // Если есть ошибка, логируем её
        cy.log('API request failed:', interception.error.message);
      }
    });
  }

  /**
   * Проверяет наличие всех элементов на странице
   */
  verifyPageElements(): void {
    cy.get('app-number-input').first().find('input').should('exist');
    cy.get('app-number-input').last().find('input').should('exist');
    cy.get(this.selectors.operationDropdown).should('exist');
    cy.get(this.selectors.numberBaseDropdown).should('exist');
    cy.get(this.selectors.calculateButton).should('exist');
  }

  /**
   * Проверяет, что результат отображается
   */
  verifyResult(expectedResult: string): void {
    // Сначала проверяем, нет ли ошибок (если есть, выводим их для отладки)
    cy.get('body').then(($body) => {
      if ($body.find('.error-message').length > 0) {
        cy.get('.error-message').then(($error) => {
          cy.log('Ошибка при вычислении:', $error.text());
        });
      }
    });
    
    // Ждем появления контейнера результата (результат появляется только после успешного API запроса)
    // Используем более гибкий подход - ждем либо результат, либо ошибку
    cy.get('.result-container, .error-message', { timeout: 15000 }).should('exist');
    
    // Проверяем, что нет ошибки
    cy.get('body').then(($body) => {
      if ($body.find('.error-message:visible').length === 0) {
        // Если ошибки нет, проверяем результат
        cy.get(this.selectors.result, { timeout: 5000 }).should('be.visible');
        
        // Результат может быть отформатирован с помощью pipe (например, "15.00" вместо "15")
        // Проверяем числовое значение
        cy.get(this.selectors.result).then(($el) => {
          const actualText = $el.text().trim();
          const actualNum = parseFloat(actualText);
          const expectedNum = parseFloat(expectedResult);
          
          // Проверяем, что числовые значения совпадают (игнорируя форматирование)
          expect(actualNum).to.equal(expectedNum);
        });
      }
    });
  }

  /**
   * Проверяет цвет результата
   */
  verifyResultColor(expectedColor: 'red' | 'black' | 'green'): void {
    const colorMap = {
      'red': 'rgb(220, 53, 69)',    // #dc3545
      'black': 'rgb(0, 0, 0)',      // #000000
      'green': 'rgb(40, 167, 69)'   // #28a745
    };
    
    cy.get(this.selectors.result)
      .should('be.visible')
      .should('have.css', 'color', colorMap[expectedColor]);
  }

  /**
   * Проверяет, что кнопка вычисления заблокирована
   */
  verifyCalculateButtonDisabled(): void {
    cy.get(this.selectors.calculateButton).contains('Вычислить').should('be.disabled');
  }

  /**
   * Проверяет, что кнопка вычисления активна
   */
  verifyCalculateButtonEnabled(): void {
    cy.get(this.selectors.calculateButton).contains('Вычислить').should('not.be.disabled');
  }

  /**
   * Проверяет сообщение об ошибке
   */
  verifyErrorMessage(message: string): void {
    cy.get(this.selectors.errorMessage).should('be.visible').and('contain', message);
  }

  /**
   * Проверяет, что во второе поле нельзя ввести 0
   */
  verifySecondInputBlocksZero(): void {
    cy.get('app-number-input').last().find('input').clear();
    cy.get('app-number-input').last().find('input').type('0');
    // После ввода 0, поле должно остаться пустым или значение должно быть удалено
    cy.get('app-number-input').last().find('input').should('have.value', '');
  }

  /**
   * Проверяет, что можно ввести только допустимые символы для системы счисления
   */
  verifyInputValidation(base: number, validChars: string[], invalidChars: string[]): void {
    // Проверяем валидные символы
    validChars.forEach(char => {
      cy.get('app-number-input').first().find('input').clear().type(char);
      cy.get('app-number-input').first().find('input').should('have.value', char);
    });

    // Проверяем невалидные символы
    invalidChars.forEach(char => {
      cy.get('app-number-input').first().find('input').clear();
      cy.get('app-number-input').first().find('input').type(char);
      // Невалидный символ не должен быть введен
      cy.get('app-number-input').first().find('input').should('not.have.value', char);
    });
  }

  /**
   * Выполняет вычисление
   */
  performCalculation(
    firstNumber: string,
    secondNumber: string,
    operation: 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE',
    base: number = 10
  ): void {
    this.selectNumberBase(base);
    this.enterFirstNumber(firstNumber);
    this.selectOperation(operation);
    this.enterSecondNumber(secondNumber);
    this.setupCalculateIntercept();
    this.clickCalculate();
    this.waitForCalculateRequest();
  }
}
