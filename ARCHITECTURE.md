# Think ID Architecture Strategy

**Date:** February 4, 2026  
**Status:** Adopted

## 1. Executive Summary

We are adopting a **Domain-Scoped Monorepo** architecture. This strategy optimizes for developer velocity, ease of code sharing, and type safety across our related applications (Profile, App Studio, Admin).

While we may eventually separate distinct product lines (like the "Bot Platform") into their own repositories, we are starting with a unified monorepo to avoid the overhead of package management and version drift during the critical initial development phases.

## 2. Directory Structure

The repository will be reorganized into a workspace-based structure (using pnpm workspaces):

```text
/
├── apps/                          # Deployable Applications
│   ├── profile-dashboard/         # User & Business Profile Management (Next.js)
│   ├── app-studio/                # Application Management Console (Next.js)
│   └── admin-portal/              # Internal Admin Tools (Next.js)
│
├── packages/                      # Shared Logic & UI
│   ├── ui/                        # Shared Design System (Components, Tailwind)
│   ├── types/                     # Shared TypeScript Interfaces (User, Org, API)
│   ├── utils/                     # Shared Helper Functions (Formatters, Validators)
│   └── config/                    # Shared Configurations (ESLint, TSConfig)
│
├── package.json                   # Root configuration
├── pnpm-workspace.yaml            # Workspace definition
└── turbo.json                     # TurboRepo build pipeline definition
```

## 3. Key Concepts

### A. Stateless Frontends ("Thin Clients")
*   **Apps** are treated as "View Layers". They handle routing and assembling pages but should not contain deep business logic or complex UI definitions.
*   **Packages** contain the building blocks. The UI package exports "dumb" components that accept data via props.

### B. Workspace Protocol
Dependency management is handled via the `workspace:*` protocol.
*   *Example:* Accessing the UI library from the Profile App:
    `"dependencies": { "@think-id/ui": "workspace:*" }`
*   This ensures that local changes are immediately reflected across all apps without a publish/install cycle.

## 4. Phase 1 Migration Plan (Transformation to Monorepo)

This section outlines the immediate steps to transform the current single-root application into the target monorepo structure.

### Step 1: Workspace Initialization
1.  Create `pnpm-workspace.yaml` in the root.
2.  Create `apps/` and `packages/` directories.
3.  Clean up root dependencies (move them to specific apps/packages later).

### Step 2: Application Migration
Move the existing application logic into its own container.
1.  Create `apps/profile-dashboard`.
2.  Move the following folders/files from root to `apps/profile-dashboard`:
    *   `app/`, `components/`, `hooks/`, `lib/`, `public/`, `stores/`, `styles/`, `types/`, `utils/`
    *   `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json`
3.  Move `package.json` content relevant to the app into `apps/profile-dashboard/package.json`.

### Step 3: Shared UI Extraction
Extract the UI components to allow sharing with future apps (App Studio).
1.  Create `packages/ui`.
2.  Move `apps/profile-dashboard/components/ui` to `packages/ui/src`.
3.  Configure `packages/ui/package.json` with `exports` for component access.
4.  Update `apps/profile-dashboard` to depend on `@think-id/ui`.
5.  Refactor imports in the profile app:
    *   From: `import { Button } from "@/components/ui/button"`
    *   To: `import { Button } from "@think-id/ui"`

---

## 5. Future Implementation: Splitting the Monorepo

If a specific domain (e.g., "Bot Platform") grows large enough to require its own repository and distinct team, we will execute a **Subtree Split**. This preserves the git history for that specific project while decoupling it from the main repo.

### The "Subtree Split" Procedure

**Scenario:** We want to move `apps/bot-platform` to a new repo called `think-id-bot-platform`.

#### Step 1: Extract History
Run the following command in the Monorepo root to isolate the folder's history into a new branch:

```bash
# Syntax: git subtree split -P <folder> -b <new-branch-name>
git subtree split -P apps/bot-platform -b split-bot-platform
```

#### Step 2: Push to New Repository
Create the new empty repository on GitHub, then push the split branch:

```bash
# Add the new remote
git remote add new-bot-repo https://github.com/think-id/think-id-bot-platform.git

# Push the branch to the new repo's 'main' branch
git push new-bot-repo split-bot-platform:main
```

#### Step 3: Update Dependencies (The "Break")
The new repository no longer has access to `packages/ui` via the file system.

1.  **Publish Packages:** We must publish our shared packages (`@think-id/ui`) to a registry (NPM or GitHub Packages) from the original Monorepo.
2.  **Update New Repo:** In the new `think-id-bot-platform` repo, update `package.json`:

    ```json
    // Change from this:
    "dependencies": { "@think-id/ui": "workspace:*" }

    // To this:
    "dependencies": { "@think-id/ui": "^1.0.0" }
    ```

3.  **Install:** Run `pnpm install` in the new repo. It will now download the UI library from the registry instead of looking for a local folder.

## 6. Decision Log

| Decision | Alternative Considered | Reason Selected |
| :--- | :--- | :--- |
| **Monorepo** | Polyrepo (Separate Repos) | Prevents version drift; enables atomic commits; faster refactoring across multiple apps. |
| **Shared UI Package** | Copy/Paste Components | Ensures brand consistency; single source of truth for design updates. |
| **Git Subtree** | "Fresh Start" Repo | Preserves commit history and attribution when breaking out future projects. |
