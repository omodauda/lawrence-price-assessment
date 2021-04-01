[![Build Status](https://travis-ci.com/omodauda/lawrence-price-assessment.svg?token=M9un7ja3pnsag2jxkeQp&branch=master)](https://travis-ci.com/omodauda/lawrence-price-assessment)

- API LIVE URL: `https://lawrence-price-assessment.herokuapp.com`
- API DOC: `https://lawrence-price-assessment.herokuapp.com/api/v1/docs`
#

### :rocket: How to get started

- Make sure to have Git and Node.js installed on your computer
- You can use this link to clone the project: `https://github.com/omodauda/lawrence-price-assessment.git`
- cd into the project and run `npm install`
- create a `.env` file and update it with the contents in the .env.sample file.
- Run `npm run build:watch` to compile the code and watch for file changes. Note: Do not terminate this process while still working on this project.
- In a separate terminal:
- Run `npx sequelize db:create` to create the database locally.
- Run `npx sequelize db:migrate` to create tables for models in the database.
- Run `npm run dev` to start the development server.
