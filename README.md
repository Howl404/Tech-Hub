# Project "Digital Equipment Store"
RS School eCommerce project - это командное задание, в ходе выполнения которого необходимо разработать приложение eCommerce. 

### Описание проекта
Проект "Магазин цифровой техники" представляет собой веб-приложение, которое позволяет пользователям просматривать, выбирать, добавлять в корзину и покупать различную цифровую технику. Основная цель проекта - научиться использовать frontend-технологии и предоставить удобную платформу для покупки техники.

### Цели проекта
#### Основные цели проекта состоят в следующем:
* Создать удобный интерфейс для просмотра и выбора товаров
* Предоставить детальную информацию о каждом товаре, включая характеристики и отзывы пользователей
* Реализовать механизм сравнения товаров
* Разработать систему онлайн-платежей
* Обеспечить удобный процесс оформления заказа и доставку товара

### Используемый стек технологий
1. Фронтенд:
   * HTML/CSS/TypeScript
   * React.js - для создания пользовательского интерфейса
   * Axios - для выполнения HTTP-запросов к серверу
2. Бэкенд:
   * commercetools
3. Дополнительные инструменты и технологии:
   * Vite - сборка проекта
   * SASS - расширенные возможностей для CSS
   * Prettier - автоматическое форматирование кода по единому стилю
   * ESLint - обнаружение ошибок и поддержка одного стиля кода
   * Jest - тестирования кода
   * Husky - выполнение определенных скриптов перед коммитами\пушами
   * Git - для контроля версий и управления репозиторием проекта
   * GitHub - для хостинга репозитория
   * VS Code - редактор кода

### Команда проекта
* [Howl](https://github.com/Howl404)
* [Mikhail Ignatovich](https://github.com/academeg1)
* [Rashit Safiev](https://github.com/capapa)

### Скрипты для запуска ESLint, Prettier, Jest и инициализации Husky
* ESLint - npm run lint для проверки кода, npm run lint:fix автоматически исправит возможные ошибки после проверки
* Prettier - npm run format для автоматического форматирование всего кода
* Jest - npm run test для запуска тестов, npm run test:watch запускает тесты в режиме наблюдателя, позволяя взаимодействовать с Jest и перезапускает их при изменении кода.
* Husky - npm run prepare для инициализации Husky.

### Установка и запуск проекта
1. Склонируйте репозиторий проекта на свой компьютер: git clone https://github.com/Howl404/eCommerce-Application.git

2. Установите зависимости для проекта командой npm install

3. Для запуска приложения выполните команду npm run dev

### Сборка проекта
1. Выполните 1 и 2 шаг из [Установка и запуск проекта](#установка-и-запуск-проекта)
   
2. Соберите проект командой npm run build
   
3. Используйте npm run preview для запуска проекта

#### Перед коммитами выполните скрипт для [инициализации Husky](#скрипты-для-запуска-eslint-prettier-jest-и-инициализации-husky)