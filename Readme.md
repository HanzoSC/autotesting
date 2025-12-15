Главная ветка  
6232-020402D  
Лазарев М.Ю.  
Дьяконов А.В.  
IDE - VS Code  
Backend - Java (Spring)  
Frontend - Javascript (Angular)  
  
**Лабораторная работа 1**  
Консольное приложение-калькулятор на Java с использованием Maven для вычисления в 4х системах счисления и реализация вычитания, деления, умножения и сложение отдельными классами. Компиляция и тестирование произведены в IDE VS Code.  
Структура проекта:  
src\main\java\calc\Calculator.java - реализация классов и основная логика вычислений на Java.  
src\main\java\calc\Main.java - основной файл с реализацией логики выбора вычисления.  
src\test\resources\operations.csv - CSV-таблица с тестовыми данными для динамических и параметризованых тестов.  
src\test\java\calc\CalculatorTest.java - параметризованые тесты на JUnit 5.  
src\test\java\calc\DynamicCalculatorTest.java - динамические тесты на JUnit 5.  
pom.xml - опции под Maven-проект.  
  
**Лабораторная работа 2**  
Spring приложение-калькулятор на Java с использованием Maven для вычисления в 4х системах счисления и реализация вычитания, деления, умножения и сложение отдельными классами. Компиляция и тестирование произведены в IDE VS Code  
Структура Spring-проекта:  
start.bat - запуск приложения  
Calculator API.postman_collection.json - коллекция Postman для проведения ручного тестирования  
src\main\java\calc\domain\Calculation.java - JPA сущность для хранения вычислений  
src\main\java\calc\repo\CalculationRepository.java - репозиторий для работы с БД (H2)  
src\main\java\calc\service\CalculationService.java - сервис с основной логикой вычислений  
src\main\java\calc\web\CalculationController.java - REST контроллер для API проекта  
src\main\java\calc\Application.java - точка входа Spring приложения  
src\main\db\migration\V1__create_calculations_table.sql - flyway-миграция для создания таблицы  
src\test\java\calc\it\CalculationIntegrationTest.java - интеграционные тесты testcontainers (postgres)  
src\test\resources\fixtures - json-файлы с тестовыми данными для интеграционных тестов  
seed-calculations.json - содержит непосредственно данные для теста  
expected-....json - ожидаемые результаты  
src\test\resources\application-test.yml - настройка автотестирования  
src\main\resources\application.yml - настройка Spring-проекта  
pom.xml - опции под Maven-проект  
  
Основная инструкция  
1. Запустить start.bat  
2. Импортировать коллекцию в Postman для проверки API методом ручного тестирования  
3. Запустить интеграционные автотесты в IDE.  
  
**Лабораторная работа 3**  
Расширение структуры:  
src\test\resources\calc\bdd\calculator.feature - Gherkin-файл для тестового сценария  
src\test\java\calc\bdd\CalculatorStepDefs.java - реализация шагов тестового сценария под Cucumber  
src\test\java\calc\bdd\CucumberSpringConfig.java - конфигурация Cucumber для Spring  
src\test\java\calc\bdd\Hooks.java - хуки для подготовки и очистки данных  
src\test\java\calc\bdd\RunCucumberIT.java - интеграционный тест для запуска Cucumber  
  
Основная инструкция  
1. Запустить start.bat  
2. Запустить автотесты в IDE.  
  
**Лабораторная работа 4**  
Расширение структуры:  
Тесты производительности на Jmeter (\jmeter\...)  
calculator_compute_test.jmx - тест POST-запросов  
calculator_search_test.jmx - тест GET-запросов  
calculator_full_test.jmx - комбинированный тест GET+ POST  
run_single_user.bat - тест на 1 пользователя  
run_high_load.bat - тест на 1000 пользователей  
run_max_users.bat - тест максимальной нагрузки на 500, 1000, 5000 пользователей  
\jmeter\results\... - результаты для каждого теста производительности  
Readme.md - summary report по результатам тестов  
  
Основная инструкция  
1. Запустить start.bat.  
2. Загрузить standalone-версию Apache Jmeter и указать в bat-файлах полную директорию для set JMETER_HOME.  
3. Запустить в jmeter автотесты производительности при помощи bat-файлов для каждого теста.  
4. Просмотреть результаты тестов в jmeter\results.  
  
**Лабораторная работа 5**  
Расширение структуры:  
postman содержит:  
CalcAPICollection.json - Коллекция запросов согласно ТЗ  
dev-environment.json - Environment для dev сервера  
local-environment.json - Environment для локального сервера  
  
Основная инструкция:  
1. Импортируем коллекцию и enviroment в Postman.  
2. Изучить postman\Readme.md.  
2. Выполнить запросы согласно ТЗ.  
  
**Лабораторная работа 6 и 7**  
  
Расширение структуры:  
angular-calculator - Angular-приложение для реализации frontend калькулятора согласно ТЗ.  
angular-calculator\src\app\directives - директива для окрашивания результата вычисления (красный < 0, черный = 0, зеленый > 0)  
angular-calculator\src\app\pipes - pipe-фильтр для принятия значений после запятой  
angular-calculator\src\app\services - сервис для реализации вычислений  
angular-calculator\src\app\components\number-input  - компонент для входных значений  
Unit тестирование реализовано с помощью Karma (Jasmine).  
End2End тестирование реализовано с помощью Cypress (структура и описание E2E теста в angular-calculator\cypress\README.md).  
  
1. Запустить backend start.bat  
2. Изучить angular-calculator\README.md.  
3. Запустить frontend из angular-calculator.  
4. Провести Unit тестирование согласно ТЗ.  
5. Провести E2E тестирование согласно ТЗ.  
