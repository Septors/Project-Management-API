# Project Management API

## Проєкт для створення та управління:

- Проєктами

- Задачами

- Відповідями до задач

- Коментарями

- Користувачами

### Забезпечує аутентифікацію та авторизацію через JWT (Bearer Token) та роботу в реальному часі через WebSocket.

## Технології

### Основні:

- NestJS - серверний фреймворк на Node.js

- TypeScript - статична типізація

- PostgreSQL - реляційна база даних

- Prisma ORM - робота з БД

- Redis - кешування, rate limiting, blacklist токенів

- WebSocket (Socket.IO) - реальний час

- Docker & Docker Compose - контейнеризація та оркестрація

- JWT - аутентифікація та авторизація

- Rate limiting - захист від DDoS та спаму

### Безпека та утиліти:

- cors, helmet - захист HTTP-заголовків і CORS

- bcrypt - хешування паролів

- multer - завантаження файлів

- cookie-parser - робота з кукі

- sanitize-html - захист від XSS

- class-validator - валідація DTO

## Запуск проєкту

1. Клонування репозиторію

git clone https://github.com/твій-юзернейм/project-management-api.git

cd project-management-api

2. Встановлення залежностей

npm install

3. Налаштування змінних оточення

Створи файл .env на основі .env.example і заповни власні значення:

DATABASE_URL=postgresql://user:password@localhost:5432/dbname

JWT_SECRET=your_secret

REDIS_URL=redis://localhost:6379

4. Запуск сервера

### Локально у режимі розробки:

npm run start:dev

### Через Docker:

docker-compose up --build

5. Документація API

Відкрий Swagger UI:

http://localhost:<PORT>/api-docs

## Основні ендпоінти

### Аутентифікація

### Метод	Ендпоінт	Опис

POST	/auth/register	Реєстрація користувача

POST	/auth/login	Вхід та отримання токена

POST	/auth/logout	Вихід

POST	/auth/update-token	Оновлення токена

GET	/auth	Інформація про поточного користувача (потрібна авторизація)

### Проєкти

### Метод	Ендпоінт	Опис

POST	/project	Створити проєкт

GET	/project/{projectId}	Отримати проєкт

PATCH	/project/{projectId}	Оновити проєкт

DELETE	/project/{projectId}	Видалити проєкт

POST	/project/{projectId}/users	Додати користувачів

PATCH	/project/{projectId}/user/{userId}	Змінити роль користувача

### Задачі

### Метод	Ендпоінт	Опис

GET	/task/projects/{projectId}	Отримати задачі проєкту

POST	/task/projects/{projectId}	Створити задачу (підтримка файлів)

PATCH	/task/{taskId}/projects/{projectId}	Оновити задачу

DELETE	/task/{taskId}/projects/{projectId}	Видалити задачу

POST	/task/{taskId}/projects/{projectId}/users	Додати користувача до задачі

POST	/task/answers	Створити відповідь

PATCH	/task/{taskId}/answers	Оновити відповідь

### Коментарі

### Метод	Ендпоінт	Опис

GET	/comment/tasks/{taskId}	Отримати коментарі задачі

POST	/comment	Створити коментар

PATCH	/comment/{commentId}	Оновити коментар

DELETE	/comment/{commentId}	Видалити коментар

## Моделі даних (DTO)

CreateTaskDto - дані для створення задачі (title, description, projectId, createrId, file)

ResponseTaskDto - задача з id, коментарями, відповідями, файлами

UserDto - користувач

MemberDto - член проєкту з роллю

ResponseCommentDto - коментар

ResponseAuthPayloadDto - токен та дані користувача після входу

## Авторизація

Всі захищені ендпоінти вимагають передавати JWT токен в заголовку:

Authorization: Bearer <token>

## Завантаження файлів

Використовується multipart/form-data.

Приклади полів форми:

### Поле	Опис

file	Файл у бінарному форматі

title	Назва

description	Опис

## Контакти

Email: savinov.stas2001@gmail.com


GitHub: Septors


