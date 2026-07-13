# Lesson 1.0: HTTP, REST, CORS, and the Client-Server Dance

In this lesson, we will dissect how the Next.js frontend and the FastAPI backend communicate across the network. Let's explore the basic building blocks of modern web communication.

---

## 1. What is HTTP?

### The Analogy: The Restaurant
* **HTTP (Hypertext Transfer Protocol)** is the language spoken between the customer (the **Client** / frontend) and the kitchen (the **Server** / backend).
* The **Client** makes a request (looks at the menu and orders), and the **Server** responds (cooks the food and delivers it).

### HTTP Methods (Verb Types)
When ordering from our kitchen, we use specific verbs:
1. `GET` (Fetch): "Please bring me the status of the server." (Read-only, no side effects).
2. `POST` (Create): "Create a new draft email for me." (Creates new data).
3. `PUT` / `PATCH` (Update): "Update my settings profile."
4. `DELETE` (Destroy): "Remove this database entry."

---

## 2. Ports and `localhost`

Every computer has an address called its IP address (on your own machine, this is `127.0.0.1` or simply `localhost`).
However, one server might run multiple applications at the same time. To keep their traffic separated, the operating system uses **Ports**.

### The Analogy: Apartment Numbers
* If `localhost` is the street address of the building (e.g. 100 Main St), then **Ports** are individual apartment numbers (e.g. Apt 3000, Apt 8000).
* **Port 3000:** Next.js development server runs here.
* **Port 8000:** FastAPI backend server runs here.

When Next.js wants to talk to FastAPI, it sends a request specifically to `http://localhost:8000`.

---

## 3. What is JSON?

### The Universal Language
**JSON (JavaScript Object Notation)** is a lightweight format for sharing data. It is easily readable by humans and easily parsed by computers. In Python, JSON maps directly to a dictionary, and in JavaScript, it maps directly to an object.

Example JSON representation:
```json
{
  "status": "ok",
  "service": "vizier"
}
```

---

## 4. What is CORS and why does the browser block requests?

### The Security Guard
**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism. 

Imagine you visit a malicious website, `evil-website.com`. Without CORS, the scripts on `evil-website.com` could make requests in the background to `bank.com` or your local `localhost:8000` API, stealing your private data or invoking local scripts.

To prevent this:
1. When a browser makes a request from one origin (`localhost:3000`) to another origin (`localhost:8000`), it first checks if the target server permits it.
2. The server (`localhost:8000`) must return a header: `Access-Control-Allow-Origin: http://localhost:3000`.
3. If the header is missing, the browser **blocks** the response from being read by the client application.

In `backend/app/main.py`, we configured this safety net using FastAPI's `CORSMiddleware`.

---

## 5. What is Uvicorn?

### The Delivery Driver
FastAPI is just Python code—it describes *what* to do when a request arrives, but it doesn't actually listen to network sockets.

**Uvicorn** is an **ASGI (Asynchronous Server Gateway Interface)** web server implementation for Python. Uvicorn sits on Port 8000, listens to incoming network packets, translates them into Python objects, feeds them into FastAPI, takes FastAPI's return values, and sends them back over the network to the browser.
