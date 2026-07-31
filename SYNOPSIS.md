# PROJECT SYNOPSIS

## KokanKisan — A Community Marketplace for Natural Farmers of Kokan

---

## 1. Introduction

India's agricultural sector is predominantly driven by small and marginal farmers who cultivate on less than 2 hectares of land. The Kokan region — spanning Sindhudurg, Ratnagiri, and Raigad districts of Maharashtra — is home to thousands of such farmers who practice natural and organic farming, growing rice, mangoes, cashews, kokum, coconut, spices, and fresh vegetables. However, these farmers face a critical challenge: they lack direct access to urban buyers in cities like Mumbai and Pune, and are heavily dependent on middlemen who exploit them by buying produce at throwaway prices and selling at inflated rates in city markets.

The rise of digital platforms has transformed how goods and services are delivered, yet there is no dedicated, affordable, and community-driven marketplace that connects Kokan's natural farmers directly to conscious urban consumers. Existing e-commerce platforms like BigBasket, Amazon Fresh, and JioMart are designed for large-scale suppliers and do not cater to the hyper-local, trust-based model that small farming communities require. Farmers in Kokan need a platform that understands their culture, respects their farming practices, and provides them with a fair and transparent channel to sell their produce.

KokanKisan addresses this gap by building a zero-cost community marketplace that bridges the distance between Kokan's soil and the consumer's doorstep. The platform is designed to be mobile-first, culturally rooted, and environmentally conscious — combining commerce with community activism through features like the Green Kokan initiative and the Culture Hub. By integrating a Trust Score system, transparent pricing, and creative zero-delivery logistics, KokanKisan aims to empower farmers economically while giving urban buyers access to genuinely pure, chemical-free produce.

---

## 2. Problem Statement

Small-scale natural farmers in the Kokan region lack a dedicated digital platform to sell their produce directly to urban consumers, resulting in exploitation by middlemen, low farmer earnings, and inflated consumer prices. There is no trustworthy, community-driven marketplace that verifies natural farming practices, provides transparent pricing, and offers affordable delivery solutions suited to rural-urban supply chains in the Kokan-Mumbai-Pune corridor. This project intends to solve the problem of market access, trust, and affordability for Kokan's farming community through a web-based platform with integrated trust scoring, zone-based product discovery, and creative zero-delivery logistics.

---

## 3. Objectives

1. To design and develop a community-driven web marketplace that connects natural farmers of Kokan (Sindhudurg, Ratnagiri, Raigad) directly to urban buyers in Mumbai, Pune, and beyond, eliminating middlemen from the supply chain.

2. To implement a transparent Trust Score system that automatically evaluates farmer credibility based on natural farming pledge, peer vouches, buyer ratings, weekly farm video uploads, and community flags — ensuring buyer confidence in product authenticity.

3. To provide zone-based product discovery with taluka-level filtering so that buyers can find and purchase hyper-local produce from specific regions of Kokan, supporting small-scale and seasonal farming.

4. To build a zero-delivery-cost logistics model utilizing pickup points, ST bus parcels, courier integration, and community carriers — eliminating the need for dedicated delivery personnel while ensuring reliable order fulfillment.

5. To create a Culture Hub module that promotes Kokan's festivals, traditional foods, and cultural heritage through manually written blogs with integrated inventory verification — connecting cultural celebration with farm commerce.

6. To develop a Green Kokan environmental activism module with interactive deforestation reporting, petition signing, and plantation drive coordination — empowering the community to protect Kokan's ecology.

7. To ensure mobile-responsive, accessible, and secure platform design with phone OTP authentication, role-based access control, and data protection — suitable for users across rural and urban environments.

---

## 4. Scope of the Project

### Included:

- **Sindhuko Marketplace** — Product listing, browsing by zone/taluka/category, product detail with farmer info, add to cart, checkout with delivery method selection, order placement, order tracking, order history, rating and review system, product flagging (3 flags = auto-hidden), wishlist
- **Farmer Module** — Registration with Aadhar-linked profile, natural farming pledge, product management with inStock/outOfStock toggle, weekly farm video upload via camera capture, trust score dashboard, vouch system, earnings summary
- **Buyer Module** — Phone OTP login, zone-based product discovery, cart and checkout, order tracking, review and rating, product flagging, farmer profile viewing
- **Admin Module** — Dashboard with platform analytics, farmer approval queue, flagged listings management, zone/taluka management, blog creation (Culture Hub), Green Kokan report management
- **Trust Score System** — Automatic score calculation (Pledge + Vouches + Rating + Videos - Flags), badge display (Green/Amber/Red), auto-hiding of low-score listings
- **Culture Hub** — Festival blog creation, inventory verification against farmer products, farmer requirement system, product priority scoring, yearly blog reuse
- **Green Kokan** — Deforestation report with map pin and photo, report status tracking, petition signing, plantation drive listings, volunteer registration, Green Warriors leaderboard
- **Delivery System** — Pickup point, ST bus parcel, courier with auto-label, community carrier options
- **Payment** — Razorpay integration (UPI, cards, netbanking), 7% commission, convenience fee, courier fee
- **Notifications** — Firebase Cloud Messaging push notifications, SMS alerts via MSG91/Twilio, WhatsApp share buttons

### Excluded:

- Native mobile application (Android/iOS) — web-only in current scope
- Multi-language support beyond English UI with Marathi Unicode text
- Video calling or live streaming between farmer and buyer
- International shipping or cross-border delivery
- AI-based product recommendation engine
- Farmer loan or credit facility integration
- Government subsidy or scheme integration
- Warehouse or cold storage management

---

## 5. Existing System and Proposed System

### Existing System:

Currently, farmers in the Kokan region rely on traditional middlemen (known locally as "agents" or "aadtiyas") who purchase produce at farm-gate prices and transport it to wholesale markets in Mumbai, Pune, and other cities. The farmer receives only 30-40% of the final retail price, while the middleman earns the majority of the margin. Buyers in cities have no way to verify whether the produce they purchase is genuinely natural or chemical-free, as there is no transparency in the supply chain. Farmers also lack digital literacy and access to e-commerce platforms, making it difficult for them to sell independently. Some farmers use WhatsApp groups or Facebook pages for informal selling, but these lack structured ordering, payment tracking, and trust verification.

### Proposed System:

KokanKisan proposes a structured, community-driven web platform that replaces the middleman model with a direct farmer-to-buyer marketplace. The platform introduces a Trust Score system that automatically evaluates farmer credibility, giving buyers confidence in product authenticity. Unlike generic e-commerce platforms, KokanKisan is designed specifically for the Kokan region with zone-based filtering, taluka-level product discovery, and zero-delivery logistics that utilize existing infrastructure (ST buses, pickup points, community volunteers). The platform also integrates cultural and environmental modules — the Culture Hub for promoting traditional foods and festivals, and Green Kokan for community-driven environmental activism — making it not just a marketplace but a complete ecosystem for Kokan's sustainable development.

---

## 6. Proposed Modules

- **User Authentication Module** — Phone OTP-based registration and login for buyers, farmers, and admins using Firebase Authentication. JWT token-based session management with role-based access control (buyer/farmer/admin). Farmer registration includes Aadhar verification and natural farming pledge.

- **Sindhuko Marketplace Module** — Core commerce engine with product CRUD operations, zone/taluka-based filtering, category browsing, product detail pages, shopping cart, checkout with delivery method selection, order placement, and order status tracking (Confirmed → Packed → Dispatched → Delivered). Includes product flagging system (3 flags = auto-hidden) and farmer stock toggle (inStock/outOfStock).

- **Farmer Dashboard Module** — Farmer-specific interface for managing product listings, viewing incoming orders, updating order status, tracking earnings, uploading weekly farm videos via camera capture, signing the natural farming pledge, requesting vouches from fellow farmers, and viewing detailed trust score breakdown with improvement suggestions.

- **Trust Score System Module** — Automatic calculation engine that evaluates farmer credibility based on: Pledge Signed (×10), Vouches Received (×15), Average Rating (×10), Weekly Videos Uploaded (×2), and Flags Received (×20). Generates badge levels: Verified Natural Farmer (75-100, green), Building Trust (40-74, amber), Under Review (0-39, red — auto-hidden). Score auto-recalculates on every review, flag, or vouch.

- **Culture Hub Module** — Admin-driven festival blog system with four sections: What is the festival, Why traditional food is prepared, Why it is healthy, and What ingredients are required. Automatic inventory verification checks farmer products against ingredient tags before blog publication. Farmer requirement system sends product requests when ingredients are unavailable. Product priority scoring ranks farmers by availability, stock, sales history, and response time. Yearly blog reuse with fresh inventory checks.

- **Green Kokan Module** — Environmental activism module with deforestation report form (map pin via Leaflet.js + photo upload + description), interactive map showing all reported threats, report status tracking (Submitted → Under Review → Action Taken), petition signing, plantation drive listings, volunteer registration, Green Warriors leaderboard, and environmental news feed.

- **Jivanshala Booking Module** — Farm stay booking system with listings page, detail page, date selection, ₹75 booking fee via Razorpay, confirmation, and farmer host dashboard for managing bookings and earnings.

- **Delivery System Module** — Four delivery methods: Pickup Point (nearest ST bus stop/kirana partner), ST Bus Parcel (via conductor), Courier (India Post/Delhivery with auto-label generation), and Community Carrier (volunteer delivery). Auto-assigns delivery method based on buyer-farmer location distance.

- **Payment Module** — Razorpay integration supporting UPI, credit/debit cards, and net banking. Auto-calculates 7% commission (deducted before farmer payout), ₹20 convenience fee on orders above ₹200, and ₹50 courier fee for outstation orders. Webhook signature verification for secure payment processing.

- **Admin Dashboard Module** — Platform-wide analytics (users, orders, revenue, commission), farmer approval queue (approve/reject pending registrations), flagged listings management, zone/taluka management, all users list, and platform settings (commission rate, fee configuration).

- **Notification Module** — Firebase Cloud Messaging push notifications for order updates, new blog alerts, flag notifications, and requirement requests. SMS alerts via MSG91/Twilio for OTP delivery, order confirmation, and delivery updates. WhatsApp share buttons on products, blogs, and reports for viral distribution.

---

## 7. Technology / Tools to be Used

- **Development Model:** Agile (Iterative development with 2-week sprints, MVP-first approach)
- **Front-end:** React.js 18 (Vite), Tailwind CSS, React Router v6, Zustand (state management), Lucide React (icons), Framer Motion (animations), Recharts (analytics charts)
- **Back-end:** Node.js, Express.js (RESTful API)
- **Database:** MongoDB Atlas (MongoDB 7.x with Mongoose ODM)
- **Authentication:** Firebase Authentication (Phone OTP), JSON Web Tokens (JWT)
- **Real-time:** Firebase Cloud Messaging (FCM)
- **Maps:** Leaflet.js + OpenStreetMap (free, no API cost)
- **Payment Gateway:** Razorpay (test mode for development, production for launch)
- **SMS Service:** MSG91 / Twilio (OTP and order alerts)
- **IDE / Tools:** VS Code, Git, GitHub, Postman (API testing), MongoDB Compass (database management), Figma (UI design)
- **Operating System:** Windows 11 (development), Ubuntu (deployment)

---

## 8. Hardware and Software Requirements

### Hardware Requirements (Development):

- **Processor:** Intel Core i5 or above (or equivalent AMD)
- **RAM:** 8 GB minimum (16 GB recommended)
- **Storage:** 50 GB free space (SSD preferred)
- **Internet:** Broadband connection (minimum 10 Mbps) for API testing and deployment
- **Display:** Full HD (1920×1080) monitor for responsive design testing

### Software Requirements:

- **Operating System:** Windows 11 / Ubuntu 22.04 LTS
- **Programming Languages:** JavaScript (ES6+), HTML5, CSS3
- **Runtime:** Node.js 18.x or above
- **Package Manager:** npm 9.x or above
- **Frontend Framework:** React.js 18.x with Vite 5.x
- **Backend Framework:** Express.js 4.x
- **Database:** MongoDB Atlas (cloud) / MongoDB 7.x (local)
- **ODM:** Mongoose 8.x
- **Version Control:** Git 2.x, GitHub
- **API Testing:** Postman / Thunder Client (VS Code extension)
- **Database GUI:** MongoDB Compass
- **Browser:** Google Chrome (latest) for development and testing
- **Code Editor:** Visual Studio Code with extensions (ESLint, Prettier, Tailwind CSS IntelliSense)
- **Deployment:** Vercel (frontend), Railway (backend)

---

## 9. Expected Outcome

The final working system — KokanKisan — will deliver a fully functional, mobile-responsive web marketplace that connects natural farmers of Kokan directly to urban buyers in Mumbai, Pune, and across India. The platform will enable farmers to register, verify their natural farming credentials, list products with photos and descriptions, manage orders, and receive payments directly — all without paying any listing fees or commissions beyond a transparent 7% per-transaction fee. Buyers will be able to discover zone-specific produce, verify farmer trust scores, place orders with multiple delivery options, and track their orders in real-time.

The Trust Score system will ensure that only verified, trustworthy farmers remain visible on the platform, building buyer confidence and encouraging farmers to maintain high standards of natural farming. The Culture Hub will promote Kokan's cultural heritage by connecting festival celebrations with farm-fresh ingredients available directly from farmers. The Green Kokan module will empower the community to report and combat deforestation, participate in plantation drives, and protect Kokan's ecological balance.

Overall, KokanKisan will create a sustainable, community-driven economic model that increases farmer earnings by 40-60% (by eliminating middlemen), provides buyers with genuinely natural produce at fair prices, and promotes environmental and cultural preservation in the Kokan region. The platform will serve as a replicable model for hyper-local, trust-based marketplaces in other rural-urban corridors across India.

---

## 10. System Design (Overview)

### Architecture:

KokanKisan follows a **three-tier client-server architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION TIER                        │
│              React.js (Vite) + Tailwind CSS                  │
│         Mobile-responsive SPA with React Router v6           │
│    Zustand (state) | Framer Motion (animations)              │
│    Lucide React (icons) | Recharts (analytics)               │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (JSON)
                           │ JWT Authentication
                           │ Rate Limiting (100 req/min)
┌──────────────────────────┴──────────────────────────────────┐
│                      LOGIC TIER                              │
│              Node.js + Express.js (REST API)                 │
│                                                              │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────────────┐   │
│  │ Auth Routes  │ │Product Routes│ │  Order Routes       │   │
│  │ (JWT+OTP)   │ │ (CRUD+Filter)│ │ (Create+Track)      │   │
│  └─────────────┘ └──────────────┘ └────────────────────┘   │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────────────┐   │
│  │Farmer Routes│ │ Review Routes│ │  Admin Routes       │   │
│  │ (Profile)   │ │  (Rating)    │ │  (Analytics+Mgmt)   │   │
│  └─────────────┘ └──────────────┘ └────────────────────┘   │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────────────┐   │
│  │ Trust Score │ │  Green Kokan │ │  Culture Hub        │   │
│  │ (Algorithm) │ │  (Reports)   │ │  (Blog+Inventory)   │   │
│  └─────────────┘ └──────────────┘ └────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         Middleware Layer                              │    │
│  │  JWT Auth | Role Check | Rate Limiter | Validation   │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │ Mongoose ODM
                           │ MongoDB Driver
┌──────────────────────────┴──────────────────────────────────┐
│                       DATA TIER                              │
│                    MongoDB Atlas (Cloud)                      │
│                                                              │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌───────────┐    │
│  │  users   │ │ products  │ │  orders  │ │ reviews   │    │
│  ├──────────┤ ├───────────┤ ├──────────┤ ├───────────┤    │
│  │ farmer_  │ │  flags    │ │  vouches │ │ green_    │    │
│  │ profiles │ │           │ │          │ │ reports   │    │
│  └──────────┘ └───────────┘ └──────────┘ └───────────┘    │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐                   │
│  │ petitions│ │ culture_  │ │jivanshala│                   │
│  │          │ │ content   │ │ bookings │                   │
│  └──────────┘ └───────────┘ └──────────┘                   │
└─────────────────────────────────────────────────────────────┘

External Services:
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│  Firebase  │ │  Razorpay  │ │  MSG91/    │ │  Leaflet.js│
│  Auth+FCM  │ │  (Payment) │ │  Twilio    │ │  +OSM      │
│            │ │            │ │  (SMS)     │ │  (Maps)    │
└────────────┘ └────────────┘ └────────────┘ └────────────┘
```

### ER Diagram (Core Entities):

```
┌──────────┐       ┌───────────┐       ┌──────────┐
│  User    │──1:1──│ Farmer    │──1:N──│ Product  │
│          │       │ Profile   │       │          │
│ uid (PK) │       │ uid (FK)  │       │productId │
│ name     │       │ aadharHash│       │farmerId  │
│ phone    │       │ trustScore│       │ name     │
│ role     │       │ status    │       │ category │
│ village  │       │ vouchCount│       │ price    │
│ taluka   │       └───────────┘       │ quantity │
│ city     │                           │ inStock  │
└────┬─────┘                           └────┬─────┘
     │                                      │
     │ 1:N                                  │ 1:N
     │                                      │
┌────┴─────┐       ┌───────────┐       ┌────┴─────┐
│  Order   │──N:1──│  Review   │       │  Flag    │
│          │       │           │       │          │
│orderId   │       │ reviewId  │       │ flagId   │
│buyerId   │       │ orderId   │       │productId │
│farmerId  │       │ buyerId   │       │ buyerId  │
│productId │       │ farmerId  │       │ reason   │
│ quantity │       │ rating    │       └──────────┘
│ totalAmt │       │ comment   │
│ status   │       └───────────┘
│ delivery │
│ paymentId│       ┌───────────┐
└──────────┘       │  Vouch    │
                   │           │
                   │ vouchId   │
                   │ fromFarmer│
                   │ toFarmer  │
                   └───────────┘
```

### Use Case Diagram (Simplified):

```
                    ┌─────────────────────────────────┐
                    │         KokanKisan System         │
                    │                                   │
  ┌──────┐         │  ┌─────────────────────────┐    │
  │Buyer │─────────┼──│ Browse Products          │    │
  │      │─────────┼──│ Add to Cart              │    │
  │      │─────────┼──│ Place Order              │    │
  │      │─────────┼──│ Track Order              │    │
  │      │─────────┼──│ Rate & Review            │    │
  │      │─────────┼──│ Flag Product             │    │
  │      │─────────┼──│ Book Jivanshala          │    │
  │      │─────────┼──│ Report Deforestation     │    │
  └──────┘         │  └─────────────────────────┘    │
                    │                                   │
  ┌──────┐         │  ┌─────────────────────────┐    │
  │Farmer│─────────┼──│ Register (Aadhar+Pledge) │    │
  │      │─────────┼──│ Add/Edit Products        │    │
  │      │─────────┼──│ Toggle Stock             │    │
  │      │─────────┼──│ Manage Orders            │    │
  │      │─────────┼──│ Upload Farm Video        │    │
  │      │─────────┼──│ View Trust Score         │    │
  │      │─────────┼──│ Vouch for Farmer         │    │
  └──────┘         │  └─────────────────────────┘    │
                    │                                   │
  ┌──────┐         │  ┌─────────────────────────┐    │
  │Admin │─────────┼──│ Approve/Reject Farmers   │    │
  │      │─────────┼──│ Manage Flags             │    │
  │      │─────────┼──│ View Analytics           │    │
  │      │─────────┼──│ Create Festival Blogs    │    │
  │      │─────────┼──│ Manage Green Reports     │    │
  │      │─────────┼──│ Manage Zones             │    │
  └──────┘         │  └─────────────────────────┘    │
                    └─────────────────────────────────┘
```

### Data Flow Diagram (Level 1):

```
                    ┌──────────────┐
                    │   Buyer      │
                    └──────┬───────┘
                           │ Register/Login (OTP)
                           │ Browse/Search Products
                           │ Add to Cart → Checkout
                           │ Track Order → Review
                           ▼
                    ┌──────────────┐
                    │   Auth API   │──── Firebase (OTP)
                    │ (JWT Issue)  │
                    └──────┬───────┘
                           │
                    ┌──────┴───────┐
                    │  Express.js  │
                    │   REST API   │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
   ┌────────────┐  ┌────────────┐  ┌────────────┐
   │ Product    │  │  Order     │  │ Trust      │
   │ Service    │  │  Service   │  │ Score      │
   │            │  │            │  │ Service    │
   └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
         │               │               │
         ▼               ▼               ▼
   ┌─────────────────────────────────────────┐
   │            MongoDB Atlas                 │
   │  users | products | orders | reviews    │
   │  farmer_profiles | flags | vouches      │
   └─────────────────────────────────────────┘
         │               │               │
         ▼               ▼               ▼
   ┌──────────┐  ┌──────────────┐  ┌──────────┐
   │ Razorpay │  │    SMS       │  │ FCM      │
   │ Payment  │  │  MSG91/Twilio│  │ Push     │
   └──────────┘  └──────────────┘  └──────────┘
```

### Technology Architecture Summary:

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Presentation | React.js + Tailwind CSS | Mobile-responsive SPA |
| State Management | Zustand | Client-side state (auth, cart) |
| Routing | React Router v6 | SPA navigation with role-based guards |
| API Communication | Fetch API + Axios | RESTful client-server communication |
| Backend Runtime | Node.js | JavaScript server runtime |
| Web Framework | Express.js | REST API, middleware, routing |
| Authentication | Firebase Auth (OTP) + JWT | Phone OTP login, session tokens |
| Database | MongoDB Atlas | Cloud-hosted document database |
| ODM | Mongoose | Schema validation, query building |
| Payment | Razorpay | UPI, cards, net banking |
| Maps | Leaflet.js + OpenStreetMap | Free, open-source map rendering |
| Charts | Recharts | Admin analytics dashboard |
| Notifications | Firebase Cloud Messaging | Push notifications |
| SMS | MSG91 / Twilio | OTP and order alert SMS |
| Animations | Framer Motion | Lightweight UI animations |
| Deployment | Vercel (FE) + Railway (BE) | Zero-cost hosting |
| Version Control | Git + GitHub | Source code management |

---

*This synopsis is prepared for the KokanKisan project — a community marketplace connecting Kokan's natural farmers directly to urban buyers.*
