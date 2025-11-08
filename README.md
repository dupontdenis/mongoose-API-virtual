# 📦 Blog Posts API (HTML + JSON)

This project serves blog posts two ways:

1. Traditional server-rendered HTML pages (SSR)
2. A clean JSON API you can consume with `fetch()` from any frontend

The goal: show the difference between an "application" that returns HTML and an "API" that returns raw data — and let you easily build your own client.

---

## 🔍 Application vs. API (Key Differences)

| Aspect      | Server-Rendered Application                     | JSON API                                         |
| ----------- | ----------------------------------------------- | ------------------------------------------------ |
| Response    | HTML (already formatted)                        | JSON (raw data)                                  |
| Client work | Minimal (browser just displays)                 | Client decides layout/UI                         |
| Reusability | Tied to one UI                                  | Can power many UIs (web, mobile, other services) |
| Evolution   | Harder to change design without touching server | Frontend can evolve independently                |
| Typical Use | Direct user navigation                          | Programmatic access (fetch, axios, mobile SDKs)  |

An API decouples presentation from data. Same data, multiple consumers.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# (Optional) seed example posts
npm run populate

# Start server (defaults to http://localhost:3000)
npm run server
```

Visit the HTML list: `http://localhost:3000/`

Hit the JSON endpoint: `http://localhost:3000/api/posts`

---

## 🔗 API Endpoints

| Method | Endpoint         | Description                                                 |
| ------ | ---------------- | ----------------------------------------------------------- |
| GET    | `/api/posts`     | List all posts → `{ data: [...], count }`                   |
| GET    | `/api/posts/:id` | Single post → `{ data: { id, title, body, url, summary } }` |

### Example Responses

`GET /api/posts` (abbreviated):

```json
{
  "data": [
    {
      "id": "65f...",
      "title": "First Post",
      "body": "Full body text...",
      "url": "/blog/post/65f...",
      "summary": "Full body text truncated..."
    }
  ],
  "count": 1
}
```

`GET /api/posts/:id`:

```json
{
  "data": {
    "id": "65f...",
    "title": "First Post",
    "body": "Full body text...",
    "url": "/blog/post/65f...",
    "summary": "Full body text truncated..."
  }
}
```

---

## 🌐 CORS

By default, CORS is now permissive (allows all origins) to make local testing easy from any static host or tool.

If you want to restrict CORS in certain environments, set:

```
RESTRICT_CORS=true
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4200
```

With `RESTRICT_CORS=true`, only origins listed in `ALLOWED_ORIGINS` will be allowed.

---

## 🧪 Consuming the API (Plain HTML Example)

Create any static `index.html` and use:

```html
<ul id="posts"></ul>
<script>
  async function load() {
    const res = await fetch("http://localhost:3000/api/posts");
    const json = await res.json();
    document.getElementById("posts").innerHTML = json.data
      .map((p) => `<li><strong>${p.title}</strong><p>${p.summary}</p></li>`)
      .join("");
  }
  load();
</script>
```

Or open the built-in demo: `http://localhost:3000/api-demo.html` (see `public/api-demo.html`).

---

## � Test the API using files in `public/` (Live Server or any static host)

You can test the API without the server-rendered pages by opening the static files in `public/` with Live Server (or any static web server). These pages call the JSON API on port 3000 and render results in the browser.

1. Start the API server

```bash
# Do not use: npm run server.js
npm run server
```

2. Open one of these URLs from Live Server (commonly at http://127.0.0.1:5500):

- List (static): `http://127.0.0.1:5500/public/posts-simple.html`

  - Shows all posts by fetching `GET http://localhost:3000/api/posts`
  - When running from Express (port 3000) instead, you can also open `http://localhost:3000/posts-simple.html`

- Detail (static): `http://127.0.0.1:5500/public/post.html?id=<POST_ID>`

  - Reads `?id=` from the URL and fetches `GET http://localhost:3000/api/posts/:id`
  - Example: `http://127.0.0.1:5500/public/post.html?id=690effb61b2bcebbe920fe61`

- API demo (static): `http://127.0.0.1:5500/public/api-demo.html`
  - Another minimal page that lists posts using the JSON API

3. Important routing note

- The server-rendered route `/blog/post/:id` only exists on the Express app (port 3000).
- If you’re on Live Server (port 5500), opening `http://127.0.0.1:5500/blog/post/<id>` will 404.
- Use the static viewer instead: `public/post.html?id=<id>`.

4. How the static pages locate the API

Static pages detect whether they are running on port 3000. If not, they call back to the API on port 3000 automatically:

```js
const SAME_PORT = location.port === "3000";
const API_BASE = SAME_PORT
  ? ""
  : `${location.protocol}//${location.hostname}:3000`;
const URL = `${API_BASE}/api/posts`; // or /api/posts/:id
```

If you change the API port, adjust `:3000` in those lines inside `public/posts-simple.html`, `public/post.html`, and `public/api-demo.html`.

---

## �🧱 Project Structure (Relevant Parts)

```
controllers/      # Request handlers (HTML + JSON)
routes/           # Route definitions
views/            # EJS templates for HTML pages
public/           # Static assets + api-demo.html
server.mjs        # Express setup + CORS + route mounting
```

You only need `/api/posts` and `/api/posts/:id` if you're consuming data; you can ignore `views/` entirely for pure API use.

---

## 🛠 Frontend Patterns

| Pattern                | How to use                                                                              |
| ---------------------- | --------------------------------------------------------------------------------------- |
| Vanilla JS             | `fetch('/api/posts').then(r => r.json())`                                               |
| React Query            | `useQuery({ queryKey:['posts'], queryFn:() => fetch('/api/posts').then(r=>r.json()) })` |
| SSG (Next.js)          | Fetch in `getStaticProps` at build time for static generation                           |
| Mobile (Flutter/Swift) | Perform HTTP GET to the same endpoints                                                  |

---

## 🚧 Error Handling

| Condition       | Status | JSON Body                                               |
| --------------- | ------ | ------------------------------------------------------- |
| Post not found  | 404    | `{ "error": "Post not found" }`                         |
| Server/db error | 500    | `{ "error": "Error fetching posts", "message": "..." }` |

Handle non-`ok` responses in clients:

```javascript
const res = await fetch("/api/posts/DOES_NOT_EXIST");
if (!res.ok) {
  const err = await res.json();
  console.error(err.error);
}
```

---

## ➕ Extending the API (Ideas)

1. Add POST `/api/posts` to create new posts.
2. Add DELETE `/api/posts/:id` to remove posts.
3. Add pagination: `/api/posts?page=2&limit=10`.
4. Add filtering/search: `/api/posts?q=keyword`.
5. Version endpoints: `/api/v1/posts`.
6. Add authentication (JWT) for write operations.

---

## 🏁 Summary

The project now acts as both:

- A simple HTML blog interface (SSR) for direct browsing.
- A reusable JSON API exposing post data for any client.

Use the API endpoints if you just need data; ignore the views completely. That's the separation between an application and an API.

---

## 📄 License / Usage

Use freely for learning or as a starter template. No warranty.

---

Happy building! 🚀

---

## 🧰 Troubleshooting (short)

- 404 on Live Server for `/blog/post/:id`

  - Live Server is static; that route only exists on the Express app.
  - Use `http://localhost:3000/blog/post/<id>` (server-rendered), or the static page:
    `http://127.0.0.1:5500/public/post.html?id=<id>`.

- Wrong start command

  - Use `npm run server` (there is no `server.js` script).

- CORS error when fetching from Live Server

  - Ensure the API is running on port 3000.
  - The server allows `http://127.0.0.1:5500` and `http://localhost:5500` by default.
  - To add more, set env var (comma-separated):
    ```
    CORS_ORIGINS=http://localhost:5173,http://localhost:4200
    ```

- Fetch calling the wrong origin (5500 instead of 3000)

  - Use the provided static pages in `public/` which auto-target port 3000.
  - If writing your own page, call the full URL: `http://localhost:3000/api/posts`.

- 500 errors or "Error fetching posts"

  - Make sure your database and API server are up and reachable.
  - Seed sample data (optional): `npm run populate`.

- Changed API port
  - Update `:3000` in `public/posts-simple.html`, `public/post.html`, and `public/api-demo.html` where the base URL is computed.
