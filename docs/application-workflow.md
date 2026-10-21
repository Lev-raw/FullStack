# Application, CMS, API, and data workflows

These diagrams describe the current implementation. The Vite proxy shown is
for local development; in production, `/api` and `/uploads` must be routed to
the Express backend by the hosting setup.

For a short visual introduction, see the [beginner-friendly workflow PDF](../pdf/application-workflow.pdf).
The [HTML source](./application-workflow.html) can be opened in a browser or
printed again.

## Application architecture

```mermaid
flowchart LR
  Visitor["Visitor / content editor"]

  subgraph Browser["React application (Vite, React Router)"]
    Public["Public pages<br/>Home, Showtime, About, Pulse & Page"]
    Cms["CMS routes<br/>/admin/about<br/>/admin/pulse<br/>/admin/sections/:key"]
    Auth["Login / Signup<br/>Account pages"]
    Booking["Show booking<br/>/booking/:showId"]
    Checkout["Demo checkout<br/>/checkout"]
    BrowserStorage[("Browser localStorage<br/>CMS fallback, profile, addresses, bookings")]
  end

  subgraph Backend["Express CMS backend :5001"]
    Proxy["Vite dev proxy<br/>/api and /uploads"]
    Api["API routes and controllers<br/>/api/about<br/>/api/pulse<br/>/api/sections<br/>/api/uploads"]
    Memory[("In-process memory fallback<br/>About, Pulse, site sections")]
    Uploads[("Backend disk<br/>backend/uploads")]
  end

  Mongo[("MongoDB<br/>AboutSection, PulsePost,<br/>SiteSection collections")]
  Firebase["Firebase Authentication"]

  Visitor --> Public
  Visitor --> Cms
  Visitor --> Auth
  Visitor --> Booking

  Public -->|"GET content"| Proxy
  Cms -->|"read / write content"| Proxy
  Proxy --> Api
  Api -->|"Mongo connected"| Mongo
  Api -->|"Mongo unavailable"| Memory
  Api -->|"upload image/video"| Uploads
  Public -->|"fetch error fallback"| BrowserStorage
  Cms -->|"API unavailable fallback"| BrowserStorage
  Api -->|"uploaded media URL"| Cms
  Public -->|"GET /uploads/:filename"| Proxy
  Proxy --> Uploads

  Auth -->|"sign up, sign in, observe session"| Firebase
  Auth --> BrowserStorage
  Booking -->|"seat selection in page state"| Checkout
  Checkout -->|"save demo booking"| BrowserStorage
```

## CMS content and media traversal

```mermaid
flowchart TD
  Editor["Editor opens /admin"]
  Select{"Choose CMS area"}
  About["About & INTABCAPA Saga editor"]
  Pulse["Pulse & Page editor"]
  Section["Hero, Showtime, Performance Spaces,<br/>Legacy Library, or Culinary Experience editor"]
  Load["Editor loads current content"]
  ClientApi["Frontend API helper<br/>fetch /api/about, /api/pulse,<br/>or /api/sections/:key"]
  Proxy["Vite development proxy<br/>localhost:5173 → localhost:5001"]
  Express["Express route → controller"]
  DbChoice{"MongoDB connected?"}
  Mongo[("MongoDB collections<br/>AboutSection / PulsePost / SiteSection")]
  Memory[("Backend in-memory data<br/>lost when backend restarts")]
  Fallback["If API is unreachable:<br/>use browser localStorage fallback"]
  Edit["Edit fields and choose media"]
  Upload{"Image/video selected?"}
  Multipart["POST multipart/form-data<br/>/api/uploads/image or /api/uploads/video"]
  Multer["Multer checks type and size;<br/>backend verifies file signature"]
  Disk[("backend/uploads on disk")]
  Url["Backend returns /uploads/:filename"]
  Save["Save content"]
  WriteApi["POST/PUT content API<br/>JSON request"]
  Validate["Controller validates and normalizes content"]
  WriteDb{"MongoDB connected?"}
  SaveMongo[("Write MongoDB document")]
  SaveMemory[("Update in-memory content")]
  LocalSave["If API is unreachable:<br/>save editor content in browser localStorage"]
  Public["Public page requests content through the same API helpers"]
  Render["Render text, links, images, and video"]

  Editor --> Select
  Select --> About
  Select --> Pulse
  Select --> Section
  About --> Load
  Pulse --> Load
  Section --> Load
  Load --> ClientApi
  ClientApi --> Proxy --> Express --> DbChoice
  DbChoice -->|"Yes"| Mongo
  DbChoice -->|"No"| Memory
  ClientApi -. "network failure" .-> Fallback
  Mongo --> Edit
  Memory --> Edit
  Fallback --> Edit
  Edit --> Upload
  Upload -->|"Yes"| Multipart --> Proxy --> Multer --> Disk --> Url --> Save
  Upload -->|"No"| Save
  Save --> WriteApi --> Proxy --> Validate --> WriteDb
  WriteDb -->|"Yes"| SaveMongo
  WriteDb -->|"No"| SaveMemory
  WriteApi -. "network failure" .-> LocalSave
  SaveMongo --> Public
  SaveMemory --> Public
  LocalSave -. "same browser only" .-> Public
  Public --> Render
  Disk -->|"static GET /uploads/:filename"| Render
```

### CMS API surface

| Resource | Requests | Stored data |
| --- | --- | --- |
| About | `GET /api/about`, `POST /api/about`, `PUT /api/about/:id`, `DELETE /api/about/:id` | `AboutSection` MongoDB collection, backend memory fallback, or browser localStorage when the API cannot be reached |
| Pulse & Page | `GET /api/pulse`, `GET /api/pulse/:id`, `POST /api/pulse`, `PUT /api/pulse/:id`, `DELETE /api/pulse/:id` | `PulsePost` MongoDB collection, backend memory fallback, or browser localStorage when the API cannot be reached |
| Site sections | `GET /api/sections/:key`, `PUT /api/sections/:key` | `SiteSection` MongoDB collection, backend memory fallback, or browser localStorage when the API cannot be reached |
| Media uploads | `POST /api/uploads/image`, `POST /api/uploads/video`; static reads from `/uploads/:filename` | Files on the Express server in `backend/uploads`; content records store the returned URL |

On initial reads, the backend seeds missing site sections and About content from
their defaults. The first Pulse read seeds the MongoDB collection with sample
posts when it is empty. The MongoDB URI is `MONGO_URI`; without it, the backend
uses `mongodb://127.0.0.1:27017/pulse-page`.

## Authentication, account, and booking data

```mermaid
flowchart TD
  User["Visitor"]
  Login["/login or /signup"]
  Firebase["Firebase Authentication<br/>email/password account and session"]
  Account["/account/profile, /account/bookings,<br/>/account/addresses"]
  AccountData[("Browser localStorage<br/>intab:account:<uid>:<section>")]
  Show["/showtime → choose a show"]
  Seats["/booking/:showId<br/>select seats from local auditorium layout"]
  Checkout["/checkout<br/>show, seats, and prices arrive in router state"]
  Form["Enter contact details and demo card fields"]
  Save["Save booking after demo form submission"]
  BookingData[("Browser localStorage<br/>intab:bookings:<normalized-email>")]
  ThankYou["Thank-you confirmation<br/>shows the booking email"]
  Return["Back to Home"]
  Newsletter["Insider signup<br/>currently updates UI only;<br/>no API or database write"]

  User --> Login --> Firebase
  Firebase -->|"session observed"| Account
  Account -->|"profile and addresses"| AccountData
  Account -->|"read bookings by email"| BookingData
  User --> Show --> Seats --> Checkout --> Form --> Save --> BookingData
  Save -->|"save succeeds"| ThankYou --> Return
  User --> Newsletter
```

Bookings and account profile/address data are not stored in MongoDB. Checkout is
a demo flow: it saves the booking in localStorage, does not process a payment,
and displays the confirmation screen only after the local save succeeds. When a
user is signed in, checkout associates the booking with the Firebase account
email; otherwise it uses the email entered on the checkout form.

## Operational notes

- `/admin` is a client-side CMS route; the current route tree does not add an
  authentication gate for CMS pages.
- Browser localStorage fallbacks are browser- and origin-specific. They do not
  synchronize with MongoDB or between users/devices.
- Backend in-memory fallbacks are process-local and are lost when the backend
  restarts.
- Uploaded media is stored on the backend filesystem, not in MongoDB or
  Firebase Storage.
- The Insider signup form currently has no persistence or mailing-list API.
