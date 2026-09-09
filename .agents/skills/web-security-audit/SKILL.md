---

name: supipi-guest-house-testing
description: >-
Comprehensive testing, validation, debugging, security review, and quality
assurance for the Supipi Guest House hospitality web application. Use when
testing, auditing, debugging, validating, or improving the Supipi Guest House
project, including the public booking website, admin management portal,
booking workflow, PostgreSQL/Supabase database, Prisma ORM, NextAuth
authentication, email notifications, gallery management, finance system,
API routes, cron reminders, responsive UI, deployment configuration,
performance, and production readiness.

---

# Supipi Guest House Testing

## 1. Purpose

This skill defines the standard procedure for testing and validating the
Supipi Guest House application.

The objective is to determine whether the complete application works correctly,
securely, reliably, and consistently across:

* Public guest website
* Room information
* Availability calendar
* Booking system
* Booking confirmation
* Booking reference generation
* Guest email notifications
* Admin email notifications
* Admin authentication
* Admin dashboard
* Booking management
* Guest management
* Payment tracking
* Expense management
* Financial analytics
* Gallery management
* Property settings
* Cron reminder system
* PostgreSQL database
* Prisma ORM
* Supabase Storage
* API routes
* Responsive UI
* Error handling
* Environment configuration
* Production deployment

Do not assume that a feature works merely because the source code exists.

Every important feature must be traced through:

User Interface
→ API
→ Validation
→ Business Logic
→ Database
→ External Service
→ Response
→ User Interface

---

# 2. Project Context

The current Supipi Guest House architecture is based on:

* Next.js App Router
* React
* TypeScript
* Tailwind CSS
* Framer Motion
* PostgreSQL through Supabase
* Prisma ORM
* NextAuth.js
* Nodemailer
* Supabase Storage
* Recharts
* Zod
* date-fns
* react-day-picker

The application has two primary areas:

## Public Portal

Test:

* Homepage
* Rooms
* Gallery
* Facilities
* Location
* Contact
* Booking
* Availability
* Booking confirmation

## Admin Portal

Test:

* Admin login
* Dashboard
* Booking management
* Guest records
* Finance
* Expenses
* Gallery
* Settings
* Authentication
* Authorization
* API access

The documented architecture identifies booking, expense, settings, gallery,
and room-related database entities.

---

# 3. Testing Modes

Use the appropriate mode based on the user's request.

## Mode A: Full System Test

Use when the user asks:

* Test the project
* Test everything
* Check the whole application
* Validate the project
* QA the application
* Make sure everything works

Perform the complete testing workflow.

## Mode B: Feature Test

Use when the user asks to test one feature.

Examples:

* Test booking
* Test admin login
* Test payment
* Test gallery
* Test email
* Test availability

Test the complete feature flow rather than only the UI.

## Mode C: Security Test

Use when the user asks:

* Security audit
* Vulnerability test
* Penetration test
* Security check
* OWASP test

Apply security testing in addition to functional testing.

## Mode D: Debugging

Use when the user provides:

* Error
* Exception
* Broken page
* Failed API
* Database error
* Build error
* Deployment error

First reproduce the problem.

Then identify the root cause.

Then make the smallest appropriate correction.

Then retest.

## Mode E: Production Readiness

Use when the user asks:

* Is this ready for deployment?
* Is the project production ready?
* Can I deploy this?
* Check before Vercel deployment

Perform functional, security, database, environment, performance,
deployment, and reliability checks.

---

# 4. Core Testing Principle

Never say:

> "It should work."

Instead establish:

1. What the feature is supposed to do.
2. Where the feature is implemented.
3. What inputs it accepts.
4. What API or server logic processes it.
5. What database operations occur.
6. What external services are involved.
7. What response is expected.
8. What the UI should display.
9. What happens when something fails.
10. Whether the behavior is actually verified.

Use evidence whenever possible.

---

# 5. Initial Project Inspection

Before testing, inspect the repository.

Identify:

* package.json
* package-lock.json
* next.config.*
* tsconfig.json
* prisma/
* prisma/schema.prisma
* src/
* app/
* components/
* lib/
* config/
* public/
* .env.example
* vercel.json
* middleware
* API routes
* authentication configuration

Determine the actual installed versions from the project.

Do not blindly trust documentation if the repository differs.

---

# 6. Dependency and Build Check

First determine whether the application builds.

Run the project's appropriate commands.

Typical commands:

```bash
npm install
npm run build
```

If a lint script exists:

```bash
npm run lint
```

If a type-check script exists:

```bash
npm run typecheck
```

For Prisma:

```bash
npx prisma generate
```

Do not invent scripts that are not present in package.json.

Inspect package.json before running project-specific commands.

Record:

* Build success/failure
* TypeScript errors
* ESLint errors
* Prisma errors
* Missing dependencies
* Deprecated dependencies
* Environment variable failures
* Import errors
* Route errors

---

# 7. Environment Configuration

Inspect environment requirements.

Expected categories include:

```text
DATABASE_URL
DIRECT_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
ADMIN_EMAIL
ADMIN_PASSWORD
EMAIL_USER
EMAIL_APP_PASSWORD
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
CRON_SECRET
```

Never expose actual secret values in reports.

Check:

* Required variables exist.
* Variable names match source code.
* Development configuration works.
* Production configuration is documented.
* Server-only secrets are not exposed to the browser.
* NEXT_PUBLIC variables contain only values safe for client exposure.
* Secrets are not hard-coded.

If a variable is missing, identify exactly which feature depends on it.

---

# 8. Database Testing

Inspect:

```text
prisma/schema.prisma
```

Verify:

* Database provider
* Models
* Primary keys
* Unique constraints
* Foreign keys
* Enums
* Required fields
* Optional fields
* Default values
* Relations
* Indexes
* Cascade behavior where applicable

The documented system uses PostgreSQL through Supabase and Prisma, with a
runtime DATABASE_URL and direct migration connection.

Test database connectivity.

Test:

* Create
* Read
* Update
* Delete
* Relationship queries
* Invalid data
* Missing required data
* Duplicate values
* Transaction behavior
* Database error handling

Never delete real production data during testing.

Use test records whenever possible.

---

# 9. Room Testing

Test the Room functionality.

Verify:

* Room appears on public website.
* Room name is correct.
* Description renders correctly.
* Capacity is correct.
* Price is correct.
* Image loads.
* Active rooms are displayed.
* Inactive rooms are hidden where expected.
* Room can be associated with bookings.
* Invalid room IDs are rejected.
* Deleted/inactive rooms do not create invalid bookings.

---

# 10. Availability Calendar Testing

The documented application provides a public availability endpoint:

```text
GET /api/bookings/availability
```

It returns booking date ranges used by the interactive calendar.

Test:

### Normal

* Available dates can be selected.
* Booked dates are blocked.
* Check-in date works.
* Check-out date works.
* Valid date range works.

### Boundary Conditions

Test:

* Same-day check-in/check-out.
* Check-out before check-in.
* One-night booking.
* Multi-night booking.
* Booking immediately before another booking.
* Booking immediately after another booking.
* Overlapping booking.
* Exact check-in boundary.
* Exact check-out boundary.

### Expected Result

Invalid overlapping reservations must not be accepted.

---

# 11. Booking System Testing

The main booking endpoint is:

```text
POST /api/bookings
```

The documented workflow validates the request, generates a booking reference,
creates a PENDING booking, and sends email notifications.

Test the complete flow.

## Valid Booking

Enter:

* Guest name
* Phone
* Email
* Check-in
* Check-out
* Adults
* Children
* Special requests
* Room

Verify:

1. Request reaches API.
2. Zod validation succeeds.
3. Dates are valid.
4. Availability is checked.
5. Booking is created.
6. Status is PENDING.
7. Booking reference is generated.
8. Database contains the record.
9. Guest receives expected response.
10. Admin notification is generated.
11. Guest confirmation email is generated.
12. UI displays success state.

---

# 12. Booking Reference Testing

Expected format:

```text
SP-YYYYMMDD-XXX
```

Test:

* Correct date.
* Correct prefix.
* Correct format.
* Uniqueness.
* Multiple bookings on same day.
* Multiple bookings created quickly.
* Collision handling.

Never assume a random reference is unique.

Verify the database unique constraint.

---

# 13. Booking Validation Testing

Test invalid inputs.

Examples:

```text
Empty guest name
Invalid email
Invalid phone
Zero adults
Negative adults
Negative children
Check-out before check-in
Check-in equal to check-out
Invalid room ID
Missing room ID
Invalid date
Extremely long name
Extremely long special request
Unexpected fields
Malformed JSON
Missing Content-Type
```

Expected behavior:

* Request is rejected.
* Appropriate HTTP status is returned.
* No invalid database record is created.
* No email is sent for rejected requests.
* Error message is safe and useful.

---

# 14. Double Booking Testing

This is a high-priority test.

Create two booking requests for the same room and overlapping dates.

Test:

```text
Request A → Room 1 → 10/09 to 12/09

Request B → Room 1 → 11/09 to 13/09
```

Verify that the system cannot accept both if the business rules prohibit
overlapping reservations.

Also test simultaneous requests.

The system must not rely only on the frontend calendar to prevent double
booking.

The server/database must enforce the business rule.

---

# 15. Booking Status Testing

Test every documented status:

```text
PENDING
CONFIRMED
REJECTED
CANCELLED
```

For each status verify:

* Correct database value.
* Correct admin UI.
* Correct public behavior.
* Correct availability behavior.
* Correct financial behavior.
* Correct email behavior where applicable.

Test invalid status transitions.

---

# 16. Admin Login Testing

The admin portal uses NextAuth-based authentication.

Test:

### Valid

* Correct email.
* Correct password.
* Successful login.
* Session created.
* Admin dashboard accessible.

### Invalid

* Wrong password.
* Wrong email.
* Empty email.
* Empty password.
* Invalid email format.
* Repeated failed attempts.

Verify:

* Unauthorized users cannot access admin pages.
* Authentication is server-side.
* Session is not trusted merely because of client UI state.

The documented architecture uses server-side session checks for admin routes.

---

# 17. Admin Authorization Testing

Test every protected admin API.

Examples:

```text
/api/admin/bookings
/api/admin/bookings/payment
/api/admin/expenses
/api/admin/gallery
/api/admin/settings
```

The documented API reference identifies these as admin-session protected
operations.

Test:

* Unauthenticated request.
* Authenticated admin request.
* Expired session.
* Invalid session.
* Direct API access.
* Direct URL access.
* Browser manipulation.

Expected:

```text
Unauthenticated → 401/redirect
Authorized admin → allowed
Invalid authorization → denied
```

---

# 18. Admin Booking Management

Test:

* View bookings.
* Filter bookings.
* Search bookings.
* Confirm booking.
* Reject booking.
* Cancel booking.
* Modify booking where supported.
* View guest details.
* View payment amount.
* Delete booking if supported.

Verify every UI action corresponds to the correct database change.

After every change:

```text
UI
→ API
→ Database
→ UI refresh
```

must remain consistent.

---

# 19. Payment Testing

The documented system supports incremental payment logging through:

```text
POST /api/admin/bookings/payment
```

Test:

* Add payment.
* Add multiple payments.
* Partial payment.
* Full payment.
* Payment exceeding total.
* Zero payment.
* Negative payment.
* Invalid booking ID.
* Unauthorized payment request.

Verify:

```text
amountPaid <= totalPrice
```

unless the application's business rules explicitly permit another behavior.

Test displayed:

* Total price.
* Amount paid.
* Remaining balance.
* Payment status.

Never use real payment credentials for functional testing.

---

# 20. Expense Management Testing

Test:

```text
GET /api/admin/expenses
POST /api/admin/expenses
DELETE /api/admin/expenses
```

Test categories including:

```text
Electricity
Water
Broadband
Maintenance
Other
```

Test:

* Valid expense.
* Zero amount.
* Negative amount.
* Very large amount.
* Missing category.
* Invalid category.
* Missing description.
* Invalid date.
* Unauthorized access.
* Delete operation.

Verify database and dashboard calculations.

---

# 21. Financial Analytics Testing

Verify calculations independently.

Core calculation:

```text
Gross Income
- Total Expenses
= Net Revenue
```

Test:

### Case 1

```text
Income = 100,000
Expenses = 20,000
Net = 80,000
```

### Case 2

```text
Income = 0
Expenses = 20,000
Net = -20,000
```

### Case 3

```text
Income = 100,000
Expenses = 0
Net = 100,000
```

Check:

* Monthly totals.
* Booking totals.
* Expense totals.
* Payment totals.
* Chart values.
* Date filtering.
* Empty state.
* Negative profit.

Do not rely only on displayed chart values.

Compare against raw database calculations.

---

# 22. Gallery Testing

Test:

```text
GET /api/admin/gallery
POST /api/admin/gallery
DELETE /api/admin/gallery
```

The documented gallery system uses Supabase Storage for property images.

Test:

* Upload valid image.
* Upload unsupported file.
* Upload oversized file.
* Empty upload.
* Invalid URL.
* Missing caption.
* Delete image.
* Public gallery display.
* Broken image URL.
* Ordering.
* Duplicate image.

Verify:

```text
Upload
→ Storage
→ Database record
→ Public gallery
```

---

# 23. Settings Testing

Test:

```text
GET /api/admin/settings
PATCH /api/admin/settings
```

Verify:

* Base price update.
* Hide price update.
* Settings persist after refresh.
* Public website reflects changes.
* Invalid values are rejected.
* Unauthorized users cannot change settings.

The documented system uses a singleton global settings record controlling
site-wide pricing behavior.

---

# 24. Email Testing

The system uses Nodemailer for transactional emails.

Test:

### Guest

* Booking confirmation.
* Booking reference.
* Correct guest name.
* Correct dates.
* Correct room.
* Correct contact information.

### Admin

* New booking notification.
* Correct booking details.
* Correct administrative information.

Verify:

* Email is sent.
* Recipient is correct.
* Subject is correct.
* HTML renders correctly.
* Links work.
* No sensitive secrets appear in email.
* Failure is handled gracefully.

Do not expose SMTP credentials in logs.

---

# 25. Cron Reminder Testing

The documented system contains:

```text
/api/cron/reminders
```

The reminder engine identifies confirmed bookings approximately 48 hours before
arrival and prevents duplicates using a reminder flag.

Test:

### Eligible

```text
status = CONFIRMED
reminderSent = false
checkIn ≈ 48 hours
```

Expected:

```text
Email sent
reminderSent = true
```

### Already Sent

```text
reminderSent = true
```

Expected:

```text
No duplicate email
```

### Wrong Status

```text
PENDING
REJECTED
CANCELLED
```

Expected:

```text
No reminder
```

### Invalid Cron Authentication

Expected:

```text
Request rejected
```

---

# 26. API Testing

For every API route determine:

* Method.
* Authentication.
* Request schema.
* Response schema.
* Success status.
* Error status.
* Database operations.
* External services.
* Authorization.

Test:

```text
GET
POST
PUT
PATCH
DELETE
```

where applicable.

For every endpoint test:

1. Valid request.
2. Missing fields.
3. Invalid fields.
4. Wrong data types.
5. Unauthorized request.
6. Invalid resource ID.
7. Boundary values.
8. Empty data.
9. Server failure.
10. Database failure.

---

# 27. Security Testing

Apply security review to:

* Authentication.
* Authorization.
* API endpoints.
* Prisma queries.
* Zod validation.
* Admin routes.
* File uploads.
* Supabase Storage.
* SMTP configuration.
* Environment variables.
* Cron authentication.
* CORS.
* Security headers.
* Error handling.
* Cookies.
* Sessions.

Check for:

* SQL injection.
* XSS.
* CSRF.
* IDOR/BOLA.
* Broken authentication.
* Broken authorization.
* Path traversal.
* Unsafe uploads.
* Secret exposure.
* Open redirects.
* SSRF.
* Sensitive data exposure.
* Excessive API permissions.
* Missing rate limits.

Use harmless, non-destructive tests.

Never destroy production data.

---

# 28. Frontend UI Testing

Test every public and admin page.

Verify:

* Page loads.
* No console errors.
* No broken images.
* No broken links.
* Buttons work.
* Forms work.
* Validation works.
* Loading state works.
* Error state works.
* Empty state works.
* Success state works.
* Modal works.
* Navigation works.
* Back navigation works.

Check browser console for:

```text
Errors
Warnings
Failed requests
404 resources
Hydration errors
React errors
```

---

# 29. Responsive Testing

Test at minimum:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Check:

* Navigation.
* Hero section.
* Room cards.
* Booking form.
* Calendar.
* Admin tables.
* Finance charts.
* Gallery.
* Modals.
* Buttons.
* Forms.
* Text wrapping.
* Images.
* Horizontal overflow.

There must be no unexpected horizontal scrolling.

---

# 30. Error Handling

Intentionally test failures.

Examples:

* Database unavailable.
* Invalid API request.
* Email failure.
* Supabase failure.
* Invalid session.
* Missing environment variable.
* Invalid booking.
* Invalid room.
* Network interruption.

Expected:

* Application does not crash unnecessarily.
* User receives useful error feedback.
* Server logs contain useful diagnostic information.
* Secrets are not exposed.
* Stack traces are not shown to users.

---

# 31. SEO and Public Website Testing

Check:

* Page titles.
* Meta descriptions.
* Open Graph metadata.
* Canonical URLs where applicable.
* Sitemap.
* Robots configuration.
* Room pages.
* Gallery pages.
* Location content.
* Contact information.

Verify:

* Public pages are crawlable where intended.
* Admin pages are not unintentionally indexed.
* No private information appears in public HTML.

---

# 32. Performance Testing

Check:

* Initial page load.
* Image optimization.
* Large gallery images.
* API response times.
* Database queries.
* Unnecessary client-side rendering.
* Large JavaScript bundles.
* Repeated API requests.
* Slow database operations.

Pay particular attention to:

* Gallery.
* Homepage.
* Booking calendar.
* Admin dashboard.
* Financial charts.

Do not perform high-volume load testing against production without explicit
authorization.

---

# 33. Data Consistency Testing

For every major operation verify consistency between:

```text
Frontend
API
Database
Email
External Storage
```

Example booking:

```text
Booking Form
     ↓
POST /api/bookings
     ↓
Validation
     ↓
Availability Check
     ↓
Database
     ↓
Email
     ↓
Success Response
     ↓
Confirmation UI
```

Every stage must agree.

---

# 34. Regression Testing

After fixing a bug, retest:

1. Original failing case.
2. Normal successful case.
3. Related feature.
4. Database state.
5. API response.
6. UI behavior.
7. Authentication if relevant.
8. Authorization if relevant.

Do not stop after the original error disappears.

A fix can introduce another problem.

---

# 35. Test Priority

Use this priority order.

## P0 Critical

* Application does not start.
* Database unavailable.
* Admin authentication bypass.
* Unauthorized admin access.
* Double booking.
* Data corruption.
* Secret exposure.
* Major production failure.

## P1 High

* Booking creation failure.
* Incorrect booking dates.
* Incorrect payment calculation.
* Incorrect financial calculation.
* Email workflow failure.
* Gallery upload failure.
* Cron reminder failure.
* Major API authorization issue.

## P2 Medium

* UI bugs.
* Responsive issues.
* Incorrect validation message.
* Minor calculation/display issues.
* Broken non-critical functionality.

## P3 Low

* Cosmetic issues.
* Minor spacing.
* Minor animation issues.
* Non-critical UX improvements.

---

# 36. Test Evidence

For every important failure record:

```text
Test:
Expected:
Actual:
Status:
Affected component:
Affected file:
Endpoint:
Input:
Response:
Database result:
Console error:
Root cause:
Fix:
Retest result:
```

Use:

```text
PASS
FAIL
BLOCKED
NOT TESTED
```

Do not mark a feature PASS merely because the page opens.

---

# 37. Bug Classification

Use:

## Confirmed

The problem was reproduced and evidence identifies the cause.

## Potential

A problem is suspected but cannot currently be reproduced or proven.

## Informational

A possible improvement or hardening recommendation.

---

# 38. Fixing Rules

When a defect is discovered:

1. Identify the root cause.
2. Find the smallest safe fix.
3. Avoid unrelated refactoring.
4. Preserve existing functionality.
5. Update validation where required.
6. Update error handling where required.
7. Test the modified code.
8. Test related functionality.
9. Run build/type checks.
10. Perform regression testing.

Never hide an error simply by suppressing it.

Do not change production configuration without approval.

---

# 39. Do Not Automatically Change

Ask before making consequential changes to:

* Database schema.
* Production database.
* Authentication architecture.
* Admin authorization.
* Payment logic.
* Email credentials.
* Supabase configuration.
* Vercel configuration.
* Production environment variables.
* DNS.
* Domain configuration.
* Security policies.
* CORS.
* Storage permissions.

---

# 40. Full System Test Sequence

When the user asks for a complete test, follow this order.

```text
1. Repository inspection
2. Dependency check
3. Build check
4. TypeScript check
5. Environment check
6. Database connection
7. Prisma validation
8. Public pages
9. Room system
10. Availability
11. Booking
12. Booking validation
13. Double-booking protection
14. Booking status
15. Email notifications
16. Admin login
17. Admin authorization
18. Booking management
19. Payments
20. Expenses
21. Financial analytics
22. Gallery
23. Settings
24. Cron reminders
25. API security
26. Input validation
27. Error handling
28. Responsive UI
29. SEO
30. Performance
31. Regression tests
32. Production-readiness assessment
```

---

# 41. Test Matrix

Create a matrix similar to:

| Area          | Test                | Expected        | Result |
| ------------- | ------------------- | --------------- | ------ |
| Build         | npm build           | Successful      |        |
| Database      | Prisma connection   | Connected       |        |
| Public        | Homepage            | Loads           |        |
| Rooms         | Room display        | Correct         |        |
| Availability  | Existing booking    | Blocked         |        |
| Booking       | Valid booking       | Created         |        |
| Booking       | Invalid date        | Rejected        |        |
| Booking       | Overlap             | Rejected        |        |
| Email         | Guest email         | Sent            |        |
| Email         | Admin email         | Sent            |        |
| Auth          | Valid login         | Allowed         |        |
| Auth          | Invalid login       | Rejected        |        |
| Authorization | Unauthenticated API | Denied          |        |
| Payments      | Valid payment       | Saved           |        |
| Expenses      | Valid expense       | Saved           |        |
| Finance       | Net revenue         | Correct         |        |
| Gallery       | Valid image         | Uploaded        |        |
| Settings      | Price change        | Persisted       |        |
| Cron          | 48-hour booking     | Reminder sent   |        |
| Security      | XSS input           | Blocked/escaped |        |
| Security      | Unauthorized API    | Blocked         |        |
| Mobile        | Responsive layout   | Correct         |        |

---

# 42. Final Test Report

When complete, produce:

# Supipi Guest House Test Report

## 1. Executive Summary

Provide:

* Overall status.
* Major working features.
* Major failures.
* Security concerns.
* Production-readiness status.

## 2. Environment

Include:

* OS.
* Node.js version.
* npm version.
* Browser.
* Database environment.
* Deployment environment if tested.

## 3. Technology Stack

Record the actual detected stack.

## 4. Functional Test Results

Summarize:

* Public website.
* Rooms.
* Availability.
* Booking.
* Email.
* Admin.
* Payments.
* Expenses.
* Finance.
* Gallery.
* Settings.
* Cron.

## 5. API Test Results

List tested endpoints and results.

## 6. Database Test Results

Report:

* Connectivity.
* Schema.
* CRUD.
* Relations.
* Data consistency.

## 7. Security Results

Report:

* Authentication.
* Authorization.
* Input validation.
* Injection.
* XSS.
* CSRF.
* Secrets.
* File uploads.
* Sessions.
* Headers.

## 8. UI Results

Report:

* Desktop.
* Tablet.
* Mobile.
* Forms.
* Navigation.
* Error states.

## 9. Performance Results

Report significant performance problems.

## 10. Bugs Found

For every bug:

```text
Bug:
Severity:
Status:
Location:
Steps to reproduce:
Expected:
Actual:
Root cause:
Fix:
Retest:
```

## 11. Recommended Fix Order

Use:

```text
1. Critical
2. High
3. Medium
4. Low
5. Improvements
```

## 12. Final Status

Use one of:

```text
NOT READY
READY WITH FIXES
READY FOR STAGING
READY FOR PRODUCTION
```

Do not claim "100% bug free" or "completely secure."

Instead state exactly what was tested and what remains outside the test scope.

---

# 43. Production Readiness Checklist

Before recommending production deployment:

## Build

* [ ] Production build succeeds.
* [ ] TypeScript passes.
* [ ] No blocking lint errors.
* [ ] Prisma client generated.

## Database

* [ ] Production database connection works.
* [ ] Schema is correct.
* [ ] Required indexes exist.
* [ ] Database credentials are secure.
* [ ] Backup strategy exists.

## Authentication

* [ ] Admin login works.
* [ ] Invalid login rejected.
* [ ] Session protection works.
* [ ] Admin APIs require authentication.
* [ ] Admin authorization works.

## Booking

* [ ] Valid booking works.
* [ ] Invalid booking rejected.
* [ ] Availability works.
* [ ] Double booking prevented.
* [ ] Reference generation works.
* [ ] Status management works.

## Payments

* [ ] Payment recording works.
* [ ] Invalid payment rejected.
* [ ] Financial totals are correct.

## Email

* [ ] Guest email works.
* [ ] Admin email works.
* [ ] Reminder email works.
* [ ] Duplicate reminders prevented.

## Gallery

* [ ] Upload works.
* [ ] Invalid uploads rejected.
* [ ] Delete works.
* [ ] Public images load.

## Security

* [ ] Secrets are protected.
* [ ] Unauthorized APIs blocked.
* [ ] Input validation works.
* [ ] XSS protections verified.
* [ ] SQL injection protections verified.
* [ ] Cookies reviewed.
* [ ] Security headers reviewed.
* [ ] Error messages reviewed.

## UI

* [ ] Desktop tested.
* [ ] Mobile tested.
* [ ] Tablet tested.
* [ ] No blocking console errors.
* [ ] No broken navigation.

## Deployment

* [ ] Environment variables configured.
* [ ] Production build succeeds.
* [ ] Cron configuration verified.
* [ ] Database production configuration verified.
* [ ] Domain configuration verified.

---

# 44. Final Rule

The goal is not merely to find errors.

The goal is:

```text
Understand
→ Test
→ Reproduce
→ Identify Root Cause
→ Fix
→ Retest
→ Regression Test
→ Report
```

For the Supipi Guest House project, prioritize the booking system, admin
authentication/authorization, database integrity, payment/financial
calculations, email notifications, availability protection, and production
configuration because these are business-critical components.

Never modify or delete real production data during testing.

Never expose secrets.

## Never mark a feature as PASS without sufficient evidence.
