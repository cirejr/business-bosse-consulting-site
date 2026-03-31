# 📄 Product Requirements Document (PRD)

## Project Summary
A modern, premium consulting website and CMS for blog management for Business and Bosse Consulting (B&BC), an African management consulting and IT solutions firm operating in Senegal and Côte d’Ivoire. The site focuses on a sleek, minimalist professional aesthetic with a strong emphasis on trust and local expertise.

---

## 1. 🎯 Overview

This project consists of building a ***consulting website and custom CMS (Content Management System)** using **Next.js** to manage blog content for a client migrating from WordPress.

The CMS will allow administrators to:

* Create and manage articles
* Organize content using categories and tags
* Upload and manage media (images)
* Control publication (draft/published)
* Import and manage existing WordPress content
* And display them on the public site

The system is designed to be **simple, fast, and tailored to low-volume publishing (~10 posts/month)**.

---

## 2. 🧩 Goals

### Primary Goals

* Replace WordPress with a **lightweight, custom CMS**
* Provide a **clean editorial experience**
* Ensure **fast performance and SEO-friendly output**
* Enable **easy content updates without technical knowledge**

### Secondary Goals

* Maintain flexibility for future features
* Keep infrastructure cost minimal (ideally 0 FCFA initially)
* Enable smooth migration from WordPress

---

## 3. 👥 Users

### Admin (Primary User)

* Creates and edits articles
* Uploads images
* Organizes content
* Publishes/unpublishes posts

### (Optional Future)

* Editor role (restricted permissions)

---

## 4. 🗺️ Application Structure (Pages & Navigation)

### Dashboard

* Overview stats:

  * Total articles
  * Published vs drafts
  * Recent articles

---

### Articles

#### Articles List Page

* Table view:

  * Title
  * Status (Draft / Published)
  * Date
  * Categories
* Features:

  * Search
  * Filter (status, category)
  * Pagination
  * Actions:

    * Edit
    * Delete
    * Publish/Unpublish

---

#### Create / Edit Article Page

**Fields:**

* Title
* Slug (auto-generated, editable)
* Content (rich text editor or markdown)
* Excerpt / Summary
* Cover Image
* Categories (multi-select)
* Tags (optional)
* Status (Draft / Published)
* Publish date

**Features:**

* Auto-save (optional)
* Preview mode
* Slug validation (unique)

---

### Categories

#### Categories Page

* List of categories
* Create / Edit / Delete
* Fields:

  * Name
  * Slug

---

### Tags (Optional but recommended)

#### Tags Page

* Same behavior as categories
* Lightweight management

---

### Media Library

#### Media Page

* Upload images
* View uploaded files
* Copy URL
* Delete media

**Features:**

* Drag & drop upload
* Image preview
* Storage via cloud provider (e.g. UploadThing)

---

### Settings (Optional V1.1)

* Site name
* SEO defaults
* Social sharing image

---

## 5. 🧱 Data Model

### Articles

* id
* title
* slug (unique)
* content
* excerpt
* cover_image_url
* status (draft / published)
* published_at
* created_at
* updated_at

---

### Categories

* id
* name
* slug

---

### Tags

* id
* name
* slug

---

### Relationships

#### article_categories

* article_id
* category_id

#### article_tags

* article_id
* tag_id

---

## 6. 🔄 WordPress Migration

for initial database schema read the `docs/bbcons-wp-db-dump.sql` to extract the existing data from previous wp db in order to construct the necessary and compatible schema for the custom CMS

### Data to import

* Articles (published + optionally drafts)
* Categories
* Tags (optional)

### Migration Process

1. Extract data from WordPress SQL dump
2. Transform data:

   * Clean HTML content
   * Normalize slugs
3. Insert into new database
4. Map relationships (categories/tags)

### Notes

* Ignore unnecessary WordPress tables
* Skip plugins, users, comments (unless needed)
* Validate content before import

---

## 7. ✍️ Content Editor

### Requirements

* Rich text editor OR markdown editor
* Support:

  * Headings
  * Paragraphs
  * Lists
  * Images
  * Links

### Recommendation

* Use a lightweight editor (TipTap / Editor.js)

---

## 8. 🖼️ Media Handling

### Requirements

* Upload images
* Store externally (cloud storage)
* Return accessible URL

### Behavior

* Images inserted into content via URL
* Optional:

  * Auto-optimization
  * Compression

---

## 9. 🔐 Authentication

### Minimum (V1)

* Single admin login

### Features

* Email + password login
* Protected admin routes

---

## 10. ⚙️ Technical Stack

### Frontend / Backend

* Next.js (App Router)

### Database

* PostgreSQL (e.g. Neon)

### ORM

* Drizzle ORM

### Storage

* UploadThing or equivalent

### Deployment

* Netlify (frontend)
* Serverless / API routes

---

## 11. 🚀 Performance & SEO

### Requirements

* Server-side rendering (SSR) or static generation (SSG)
* Clean URLs (slug-based)
* Meta tags per article
* Fast page load

---

## 12. 📊 Constraints

* Minimal infrastructure cost
* Simple UX (non-technical user)

---

## 13. 🧠 Future Enhancements

* Multi-user roles
* Scheduled publishing
* Analytics dashboard
* Comments system
* AI-assisted content writing
* SEO scoring

---

## 14. ✅ Success Criteria

* Admin can create and publish articles easily
* Articles display correctly on frontend
* Migration from WordPress completed successfully
* No dependency on WordPress remains
* System remains fast and stable under expected usage

---

## 15. 🧭 Development Priorities (Suggested Order)

1. Database schema
2. Authentication
3. Articles CRUD
4. Categories
5. Media upload
6. Editor integration
7. WordPress migration script
8. UI polish

---

## 🧩 Final Note

The system should remain **intentionally simple**. Avoid over-engineering.
This CMS is a **focused tool**, not a generic platform like WordPress.

---
