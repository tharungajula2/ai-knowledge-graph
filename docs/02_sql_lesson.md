# Lesson 2.0: Relational Database Schemas and Seeding

In this lesson, we will dissect the SQL commands we used to design the VIZIER Learning Academy tables in Supabase. Relational databases are the bedrock of structured, transactional data management.

---

## 1. What is a Relational Database?

### The Analogy: The Spreadsheet Binder
Imagine a physical binder containing multiple spreadsheet pages (called **Tables**).
* Each page/table represents a specific concept (e.g. one page for `lessons`, one page for `dictionary_terms`).
* Instead of typing everything on one massive sheet, we separate them into dedicated tables and link them together using references.

---

## 2. SQL Concepts Dissected

### A. Primary Key (PK)
* **What it is:** A unique ID that identifies each individual row in a table. No two rows can share the same Primary Key.
* **The Analogy:** Your Social Security Number or your student ID card. 
* **In SQL:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` generates a 128-bit globally unique identifier (UUID) automatically.

### B. Foreign Key (FK)
* **What it is:** A column in one table that references the Primary Key of another table, creating a relational link.
* **The Analogy:** A luggage tag. The tag on the bag has a code pointing to the passenger ticket number, linking the bag directly to the passenger.
* **In SQL:** `lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE`. If a lesson is deleted, `ON DELETE CASCADE` automatically cleans up and deletes all exercises linked to that lesson.

### C. Check Constraint
* **What it is:** A rule that checks data before it is written to the database. If the data fails the rule, the database rejects it.
* **The Analogy:** An age gate on a website. If you are under 18, it blocks you from entering.
* **In SQL:** `CHECK (item_type IN ('term', 'lesson', 'exercise'))` ensures no one can write an invalid item type (e.g., 'profile') to that column.

### D. Arrays (`TEXT[]`)
* **What it is:** Storing a list of multiple values inside a single database cell.
* **The Analogy:** A drawer in a cabinet containing multiple labeled file folders instead of just one document.
* **In SQL:** `related_terms TEXT[] DEFAULT '{}'` stores a list of text strings representing terms related to a definition.

### E. Timestamp with Timezone (`TIMESTAMPTZ`)
* **What it is:** A timestamp data type that records date and time, adjusting for different timezones.
* **The Analogy:** A global calendar invite. If you schedule a meeting, it displays at 9:00 AM for you but shows as 5:30 PM for a colleague in India.
* **In SQL:** `created_at TIMESTAMPTZ DEFAULT now()` records the exact moment the row was inserted, normalized to UTC.

---

## 3. Database Indexes

### The Index Page in a Book
If you want to find the word "ReAct" in a 500-page book, you don't read page 1, then page 2, then page 3 (this is called a sequential scan in databases).
Instead, you flip to the **Index** at the back of the book, find "ReAct" under the letter R, see it's on page 342, and flip directly there.

In SQL, we run:
```sql
CREATE INDEX IF NOT EXISTS idx_user_progress_item ON user_progress(item_type, item_id);
```
This tells Postgres to keep an index of item IDs so that looking up user progress remains incredibly fast, even if you have thousands of records.
