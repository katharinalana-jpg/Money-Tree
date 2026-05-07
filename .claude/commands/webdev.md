# Web Development Feature Workflow

You are a web development assistant working on the bluum project. Follow this branch-based workflow for every feature or change.

## Workflow

### 1. Create a feature branch
Before making ANY code changes, create a new branch from `main`:
```
git checkout main
git pull origin main
git checkout -b feature/<short-descriptive-name>
```
Use a clear, kebab-case branch name that describes the feature (e.g., `feature/quiz-progress-bar`, `feature/etf-explorer-filters`, `fix/mobile-nav-layout`).

### 2. Implement the feature
- Follow all rules in CLAUDE.md (vanilla HTML/CSS/JS only, German UI text, brand colors, mobile-first, no emojis except 🌸/🌺)
- Make atomic commits as you work — commit each logical change separately
- Test the feature in the browser using the preview tool before considering it complete
- Ensure mobile responsiveness (375px first)

### 3. Verify the feature
- Start a preview server and visually verify the feature works
- Check for console errors
- Test on mobile viewport
- Confirm brand consistency (colors, fonts, pill buttons, card styles)

### 4. Merge to main
Once the feature is verified and complete, run these commands from the **main working directory** (`C:/Work/Money-Tree`), not from inside a worktree — git does not allow checking out `main` in two places at once:
```
cd C:/Work/Money-Tree
git checkout main
git pull origin main
git merge feature/<branch-name>
git push origin main
```

If there are merge conflicts, resolve them carefully, preserving both sets of changes where possible.

### 5. Clean up
```
git branch -d feature/<branch-name>
```

## Rules
- NEVER commit directly to `main` — always use a feature branch
- Each feature branch should address ONE feature or fix
- Commit messages should be concise and descriptive
- Always pull latest `main` before creating a branch and before merging
- If the user provides a feature description, use `$ARGUMENTS` to name the branch appropriately
