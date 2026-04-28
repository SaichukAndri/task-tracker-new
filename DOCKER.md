# Запуск проєкту через Docker

## Вимоги

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Запуск усього стеку

У корені проєкту виконайте:

```bash
docker compose up --build
```

Або у фоновому режимі (detached):

```bash
docker compose up --build -d
```

## Що запускається

| Сервіс       | Порт | Опис                    |
|-------------|------|-------------------------|
| Frontend    | 80   | http://localhost        |
| Backend API | 3000 | http://localhost:3000   |
| MongoDB     | 27017| база даних              |
| Mongo Express | 8081 | http://localhost:8081 (UI для БД) |

## Корисні команди

- Зупинити: `docker compose down`
- Зупинити і видалити томи (дані БД): `docker compose down -v`
- Переглянути логи: `docker compose logs -f`
- Перебілдити образи: `docker compose build --no-cache`

## Зміна коду

Після змін у backend або frontend потрібно перебілдити та перезапустити:

```bash
docker compose up --build -d
```
