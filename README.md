# Falcone Key Generator

A browser-only HTML/CSS/vanilla JavaScript prototype for managing activation-code records. It uses IndexedDB and includes a responsive dashboard, local demo login, apps, Demo/Lifetime records, payment-slip attachment storage, company settings, basic staff permissions, history, local audit entries, JSON backup, A5 print layout, clipboard actions, and WhatsApp text sharing.

## Run it

Because the project uses JavaScript ES modules and IndexedDB, run it from a local web server rather than opening `index.html` as a `file://` URL.

From this folder, run one of these:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

No build step, framework, external library, or backend is required. Web Crypto, clipboard, and share features work best in a secure context such as `localhost` or HTTPS.

## Demo accounts

All content is fictional.

- Owner: `owner` / `falcone123`
- Manager: `manager` / `demo123`
- Cashier: `cashier` / `demo123`

The demo accounts are created the first time the database is opened. You can create additional staff accounts in **User & Role Management**.

## Basic use

1. Sign in as Owner.
2. Open **App Management** and add an app. Use an app ID such as `APP02`, an HTTP/HTTPS APK URL, installation and activation instructions, and a Demo duration.
3. Open **Generate Code**, select the app and license type, and enter customer name and phone.
4. Demo keys require customer name and phone. Lifetime keys additionally require a JPG, PNG, or PDF payment slip under 10 MB. The slip is saved in IndexedDB before the record is considered saved. Uploading a slip is not payment verification.
5. Use Copy Key, Copy Download Link, Copy Full Message, Print / Save A5 PDF, or Share via WhatsApp after a record is generated. WhatsApp sharing opens a user-controlled text-share page; it does not attach a PDF.
6. Find records in separate Demo History and Lifetime History pages. Owner can edit customer name/phone or revoke a record. The original key, app, license type, issue date, and creator should not be changed; revoke and issue a new key if those fields are wrong.

## A5 document and sharing

**Print / Save A5 PDF** opens the browser print dialog using a selectable-text A5 portrait layout. Choose “Save as PDF” in the print destination. This baseline project does not automatically generate or download a PDF file. It does not use a PDF-generation library. To share a PDF file through the system share sheet, a real PDF `File` must first be created and supported by `navigator.canShare()` / `navigator.share()`; otherwise save the PDF and attach it manually in WhatsApp. The included WhatsApp text link only shares encoded text.

## Browser storage and backups

- Records, settings, accounts, app logo data, and uploaded payment-slip blobs are stored in IndexedDB in the current browser profile.
- Data is not automatically shared between devices or browsers. Clearing site data can delete it.
- JSON backup exports apps, settings, customers, users, activation records, and local audit rows. **Payment-slip file contents are not included** in JSON backups. Export/open important slips separately before migrating or clearing browser data.
- Import validates the backup shape and activation records and rejects duplicate activation keys. It adds records; it is not a complete cross-device database migration.
- The audit trail is local and can be modified by someone with browser access; it is not tamper-proof.

## Critical security and licensing limitations

**Browser-only authentication and role permissions are demonstrations, not secure production controls.** Credentials are stored locally in browser IndexedDB in this prototype and are not securely protected. UI hiding and JavaScript permission checks can be bypassed by a user with browser access. Do not use it to protect real customer or payment data.

The generated activation strings do **not** activate an APK automatically. The target app must implement compatible license validation, and production systems should validate licenses against a trusted service. Revocation and Demo expiry are local display statuses until the app checks them through a compatible validation mechanism. A key collision check covers only the current browser database. Global uniqueness across multiple devices requires a shared backend.

Before real customer use, connect:
- A proper authentication service with secure password handling, sessions, and server-enforced roles/permissions.
- A server-side database with backups, access controls, migrations, and audit logging.
- A file-storage service with authorization and retention controls for payment slips.
- A licensing API and app-side validation, including server-authoritative expiry/revocation and a documented offline policy.
- A payment verification process; uploading a payment slip is not verification.
- Server-side validation, rate limiting, monitoring, and privacy/legal review appropriate to your jurisdiction.

## Included files

- `index.html` — app shell and login
- `style.css` — responsive dashboard and A5 print styles
- `js/db.js` — IndexedDB operations
- `js/auth.js` — demo users, login, and permission helpers
- `js/ui.js` — safe display helpers and common utilities
- `js/app.js` — pages and workflows
