<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project conventions

- Use npm and keep `package-lock.json` synchronized with `package.json`.
- Follow the feature-based architecture under `src/features`; keep shared infrastructure in `src/core`.
- Keep Route Handlers thin: authenticate, authorize, adapt input/output, and delegate to application use cases. Access data through repository contracts, never directly from UI or Route Handlers.
- Add a new numbered migration for schema changes; never edit a migration that may already have been applied.
- Keep Persian and English dictionaries synchronized for every user-facing change, preserving RTL for Persian and LTR for English.
- Never commit secrets, credentials, `.env.local`, or production connection details.

## Engineering principles

- Keep business rules in domain/application layers, independent of frameworks and infrastructure. Depend on domain contracts and wire implementations in feature composition roots.
- Keep modules focused on one responsibility. Prefer simple, explicit code; extract shared abstractions only for demonstrated reuse.
- Reuse established validation, authorization, data-access, error-handling, and realtime patterns.
- Keep production flows stateless where practical; do not use process memory for persistent data or cross-instance coordination.
- Use database transactions when one business operation requires multiple writes to succeed or fail together.
- Preserve backward compatibility for public APIs unless a breaking change is explicitly required and documented.
- Optimize for expected scale and measured bottlenecks, not hypothetical ones.

## Verification

- Verify in proportion to risk. For code changes, run `npm run lint`, `npx tsc --noEmit`, and `npm run build` unless a documented environment limitation prevents it.
- Add or update relevant tests when test infrastructure exists; otherwise manually verify affected success, validation, authorization, and failure paths.
- Do not suppress type, lint, or runtime errors merely to make checks pass; fix the underlying cause or document a justified exception.

## Documentation maintenance

Documentation is part of the definition of done. Whenever a feature, behavior, route, API contract, environment variable, command, dependency, architecture decision, limitation, or operational procedure is added, changed, or removed, update the relevant documentation in the same change.

At minimum, review `README.md` and every relevant file under `docs/`. Do not document planned behavior as implemented behavior; clearly label current limitations and planned work. Keep commands, request/response examples, role permissions, defaults, and environment-variable descriptions synchronized with the code.
