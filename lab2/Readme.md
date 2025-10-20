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
