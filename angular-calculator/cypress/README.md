**Структура**  
e2e\features - реализация тест-кейсов в Gherkin-сценарии для автотестирования  
support\page-objects\calculator.page.ts - реализация паттерна для обращения к элементам страницы  
support\step_definitions - реализация шагов на Cypress для прохождения тест-кейсов  
**Сценарии**  
arithmetic-operations - арифметические действия  
division-zero-block - деление на 0  
hexadecimal-input - ввод букв в шестнадцатеричной системе  
input-validation - проверка ввода чисел  
number-bases-validation - проверка ввода согласно системе счисления  
page-elements - существование элементов страницы (input, dropdown, button)  
result-colors - цвет результат в зависимости от знака  