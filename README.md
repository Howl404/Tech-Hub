# Project "Digital Equipment Store"
RS School eCommerce project - is a team task in which the team needs to develop an eCommerce application.

### Project description
"Digital Equipment Store" is a web application that allows users to browse, select, add to basket and buy various digital appliances. The main goal of the project is to learn how to use frontend technologies and provide a convenient platform for buying equipment.

### Project goals
#### Main goals of the project are:
* Create a user-friendly interface for browsing and selecting products
* Provide a detailed description of every product, including characteristics and users reviews
* Implement a product comparison mechanism
* Implement a payment system
* Ensure a convenient order process and product delivery

### Technology stack
1. Frontend:
   * HTML/CSS/TypeScript
   * React.js - for user interface creation
   * Axios - for HTTP request to the server
2. Backend:
   * commercetools
3. Additional instruments and technologies:
   * Vite - project builder
   * SASS - CSS framework with additional features
   * Prettier - automatic code formatting to a single style
   * ESLint - detecting errors and enforcing a consistent code style
   * Jest - code testing
   * Husky - running certain scripts before commits/pushes
   * Git - for version control and project repository management
   * GitHub - for hosting the repository
   * VS Code - code editor

### Project team
* [Howl](https://github.com/Howl404)
* [Mikhail Ignatovich](https://github.com/academeg1)
* [Rashit Safiev](https://github.com/capapa)

### Scripts for running ESLint, Prettier, Jest, and initializing Husky:
* ESLint - npm run lint to check the code, npm run lint:fix will automatically fix possible errors after the check
* Prettier - npm run format for automatic formatting of the entire codebase
* Jest - npm run test to run tests, npm run test:watch runs tests in watch mode, allowing interaction with Jest and restarting tests on code changes
* Husky - npm run prepare to initialize Husky

### Project Installation and Launch
1. Clone the project repository to your computer: git clone  https://github.com/Howl404/eCommerce-Application.git

2. Install project dependencies with the command: npm install

3. To run the application, execute the command: npm run dev

### Project build
1. Perform steps 1 and 2 from [Project Installation and Launch](#project-installation-and-launch)
   
2. Build the project with the command: npm run build
   
3. Use npm run preview to launch the project

#### Before commits, run the script for [Husky initialization](#scripts-for-running-eslint-prettier-jest-and-initializing-husky)