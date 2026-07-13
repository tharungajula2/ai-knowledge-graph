# Lesson 3.0: React, Next.js, and Supabase PostgREST

In this lesson, we will dissect how the VIZIER Academy UI is constructed and how Next.js talks directly to Supabase PostgreSQL using web service requests.

---

## 1. Core React Concepts

React is a library for building user interfaces out of individual bricks called **Components**.

### A. Components
* **What it is:** A reusable function that returns a piece of the user interface (written in JSX, which looks like HTML in JavaScript).
* **The Analogy:** A LEGO brick. You build a castle (the app) by joining different bricks (Navbar component, Card component, Badge component) together.

### B. Props (Properties)
* **What it is:** Read-only inputs passed from a parent component down to a child component.
* **The Analogy:** The customization settings of a brick. If you buy a lego window, the color you choose for the frame is a prop.
* **Code Example:**
  ```tsx
  // Child component receives 'present' as a prop
  function StatusBadge({ present }: { present: boolean }) {
    return <span>{present ? "Configured" : "Missing"}</span>;
  }
  ```

### C. State
* **What it is:** Memory internal to a component that can change over time. When state changes, React automatically updates (re-renders) the UI to display the new data.
* **The Analogy:** The water level in a glass. It can go up or down based on actions (drinking/pouring), and looking at the glass instantly tells you the current volume.
* **Code Example:**
  ```tsx
  const [selectedTerm, setSelectedTerm] = useState(null);
  ```

---

## 2. Next.js: Server vs. Client Components

Next.js is a framework built on top of React. By default, it splits components into two types to optimize speed and interactivity.

### A. Server Components
* **Where they run:** They compile entirely on the server (on your machine, or in the cloud). The browser receives static, ready-to-render HTML.
* **When to use:** For static layouts, reading files directly, or fetching initial database tables.

### B. Client Components
* **Where they run:** They send JavaScript code to the browser, allowing the user's browser to execute code dynamically.
* **When to use:** When you need interactive elements (clicks, forms, typing in search bars) or need hooks like `useState` and `useEffect`.
* **How to declare:** You must write `"use client";` at the very top of the file.

---

## 3. How Supabase talks to Postgres (PostgREST)

When you write this in your JavaScript code:
```typescript
const { data, error } = await supabase
  .from("dictionary_terms")
  .select("*")
  .order("term");
```

What actually happens under the hood?

### The Analogy: The Translator
* The **Supabase Client Library** doesn't open a direct database socket connection (like SQL clients do) from the browser. Browsers cannot open raw database sockets.
* Instead, it makes a standard **HTTP GET request** to the Supabase API Gateway.
* Sitting on the Supabase gateway is a tool called **PostgREST**. PostgREST reads the HTTP request, translates the query parameters (e.g. `select=*&order=term`) into an actual SQL query (`SELECT * FROM dictionary_terms ORDER BY term ASC;`), executes it on the Postgres database, formats the rows into JSON, and returns them to your browser over HTTP.

This architecture enables you to safely and quickly query Postgres tables directly from client-side JavaScript apps using secure, scalable API endpoints!
