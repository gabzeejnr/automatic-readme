# Nuxt-test




## 🌐 Live Demo

https://example.com


## 🚀 Tech Stack

- Vue.js
- Nuxt.js
## Authors
- [Gabriel Dodowei](https://github.com/gabzeejnr)

## 📍 Routes

- `/`
- `/authors`


## 🔌 API Routes


```http
  DELETE /api/authors/[id]
```

```http
  DELETE /api/books/[id]
```

```http
  GET /api/authors
```

```http
  GET /api/books
```

```http
  POST /api/authors/create
```

```http
  POST /api/books/create
```

```http
  PUT /api/authors/[id]
```

```http
  PUT /api/books/[id]
```


| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

## 🛠️ Scripts

- `build`: `nuxt build`
- `dev`: `nuxt dev`
- `dev:clean`: `rm -rf node_modules package-lock.json && npm i --force && nuxt dev`
- `generate`: `nuxt generate`
- `preview`: `nuxt preview`
- `postinstall`: `nuxt prepare`
