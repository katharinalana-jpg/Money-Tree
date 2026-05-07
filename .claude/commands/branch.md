# Create Branch with Smart Name

Given the task description in $ARGUMENTS, generate a useful branch name and create the branch.

## Rules for branch naming
- Format: `<type>/<short-kebab-description>`
- Types: `feature/` · `fix/` · `chore/` · `refactor/` · `docs/`
- Max 4–5 words after the slash, all lowercase kebab-case
- No filler words (the, a, an, for, to)
- Name must describe WHAT changes, not HOW

## Examples
| Description | Branch name |
|---|---|
| Add signup form validation | `feature/signup-form-validation` |
| Fix broken mobile nav | `fix/mobile-nav-broken` |
| Update CLAUDE.md with quiz details | `docs/claude-md-quiz-details` |
| Refactor hero section styles | `refactor/hero-section-styles` |

## Steps
1. Read $ARGUMENTS and infer the correct type prefix and a concise kebab name
2. Show the user the proposed branch name and ask for confirmation or adjustment
3. Once confirmed, run from the **main working directory** (`C:/Work/Money-Tree`) — `main` cannot be checked out inside a worktree:
```
cd C:/Work/Money-Tree
git checkout main
git pull origin main
git checkout -b <branch-name>
```
4. Confirm the branch was created and is ready for work
