# Activity Log Implementation Plan

This plan defines implementation and governance for activity logs in Smart Inventory System.

## 1. Objective

Provide reliable operational traceability while enforcing role-based visibility:

1. Admin can view all activities
2. Manager can view only own activities

## 2. Current Endpoint

1. `GET /api/v1/activity-logs`

Access:

1. `ADMIN`, `MANAGER`

## 3. Visibility Rules (Implemented)

1. If requester role is `ADMIN`: return full activity stream
2. If requester role is `MANAGER`: filter by `userId = requester.userId`
3. Limit is clamped between `1` and `25`

## 4. Event Sources

Current modules writing logs include:

1. User/auth flows
2. Category actions
3. Product actions
4. Order actions
5. Restock queue actions

## 5. Data Contract

Each log entry contains:

1. `action` (enum `ActivityAction`)
2. `message`
3. `entityType`
4. `entityId` (optional)
5. `userId` (optional)
6. `metadata` (optional JSON)
7. `createdAt`

## 6. Phase Plan

## Phase 1: Security and Access Control

1. Enforce admin/manager visibility rules at service layer
2. Keep endpoint protected by auth middleware
3. Prevent accidental leakage of other managers' logs

Acceptance:

1. Admin receives all logs
2. Manager receives only self-generated logs

## Phase 2: Query and Filtering Enhancements

1. Add filters by `action`, `entityType`, `dateFrom`, `dateTo`
2. Add pagination (`page`, `limit`) instead of only top-N
3. Add sort options (default latest first)

Acceptance:

1. Filters are validated and indexed
2. Result shape remains stable for dashboard consumers

## Phase 3: Observability Enhancements

1. Add request correlation ID in metadata
2. Normalize metadata fields across modules
3. Add export endpoint for admin reports

Acceptance:

1. Logs can be traced across multi-step workflows
2. Audit exports are usable for compliance and review

## 7. Validation and Error Handling

1. Validate query params and limit boundaries
2. Return standardized validation messages
3. Avoid throwing on optional missing metadata

## 8. Test Matrix

1. Admin fetch logs -> returns mixed users
2. Manager fetch logs -> only own userId entries
3. Limit boundary checks (`0`, negative, very high)
4. Auth failures for missing/invalid token
5. Ensure no cross-user leakage in manager mode

## 9. Rollout Checklist

1. Type build passes
2. Manual API verification with one admin and two managers
3. Log visibility confirmed in staging
4. Monitoring alerts configured for repeated auth failures
