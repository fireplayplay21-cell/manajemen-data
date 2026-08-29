# Security Specification for Firestore

## 1. Data Invariants
- Only authenticated users with verified emails or registered admins (like ika.ayuvia7@admin.sd.belajar.id) can manage school records.
- Generic school records and documents are protected against unauthorized modification.
- User profiles can only be written by the authenticated user matching the document id or admins.

## 2. Payloads
- Dirty Dozen tests verify unauthorized creation, cross-user modification, spoofed admin claims, and unauthenticated writes are denied.
