# University Probation System

A university academic probation frontend planned with **Next.js, JavaScript, and Tailwind CSS**.

> **Project status:** Frontend demo implemented. Includes role-specific dashboards, student management, academic results, simulated evaluations, semester management, and advising notes. All records are fictional and changes reset on refresh.

## Run the frontend

Requires Node.js 20.9 or later and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page. Select **View dashboard** for a minimal dashboard, or use the task cards to go straight to students, results, probation records, advisors, semesters, or advising notes. The dashboard includes three summary cards, quick actions, and a searchable student list.

Use the role selector above the page title to switch between officer, advisor, and student views. Advisor and student views also provide an identity selector. The [demo login page](http://localhost:3000/login) provides another way to choose a role.

**Windows PowerShell:** If execution policy blocks `npm.ps1`, use `npm.cmd install` and `npm.cmd run dev` instead. No execution policy change is required.

```bash
npm run lint
npm run build
npm start
```

Run `npm start` after a successful build to serve the production application. Records live in a shared React context for the current browser session. Navigation preserves demo edits; a full refresh restores the fictional starting records. Result edits clear the same semester's demo evaluation so it can be reviewed again. CSV export is available for student lists and academic results.

Browser workflow checks cover search, CSV export, duplicate student IDs, result edits, evaluation history, advisor feedback, and mobile navigation:

```bash
npx playwright install chromium
npm run test:e2e
```

The test runner uses the app on port 3000 if it is already running, or starts a development server for the checks.

The sections below describe the frontend scope and implementation guide. The project files already exist; skip the scaffolding instructions when running this checkout.

## 1. Project goal

Build an interface where academic officers can enter results and review probation, advisors can follow up with students, and students can view their academic status and feedback.

Display semester history so users can review previous results and probation records.

## 2. Confirm these requirements first

- [ ] Obtain the official academic probation policy from the faculty or university handbook.
- [ ] Confirm the status labels and explanations to display.
- [ ] Confirm the academic result fields and GPA scale.
- [ ] Confirm which screens and actions each role needs.

**Do not invent university policy.** Use fictional records and label any temporary rule or evaluation as demo data.

## 3. Technology choices

| Part | Choice | Responsibility |
| --- | --- | --- |
| Frontend | Next.js App Router with JavaScript | Pages, navigation, forms, and tables |
| Styling | Tailwind CSS | Responsive layout and visual styling |
| Demo data | JavaScript fixtures and React state | Populate screens and simulate interactions |

Use `.js` files for this project.

## 4. Roles and views

| Role | Interface features |
| --- | --- |
| Admin / Academic Officer | Manage students, advisors, semesters, and results; review evaluations and reports |
| Advisor | View assigned students, review their history, and add demo advising notes |
| Student | View their own academic results, probation history, and advisor feedback |

Provide role-specific navigation and clearly label role switching as demo behavior.

## 5. Initial frontend scope

Build these features first:

- Demo login and logout screens.
- Role-specific dashboards.
- Student records and advisor assignment forms.
- Semester management screens.
- Entry and viewing of fictional academic results.
- Simulated probation evaluation and history display.
- Advisor notes and action plan forms.

For the first version, an academic officer enters semester GPA and CGPA into demo forms. Computing these values from individual course grades can be added later if required.

Keep email notifications, file uploads, complex analytics, and course registration outside the initial scope.

## 6. Create the repository and Next.js project

### Repository

- Name: `university-probation-system`
- Description: `A university academic probation frontend built with Next.js, JavaScript, and Tailwind CSS.`
- Keep it private during development unless your faculty requires otherwise.

### Check prerequisites

Install Git and a supported Node.js LTS release. Check your terminal:

```bash
node -v
npm -v
git --version
```

Check the current Next.js installation documentation for its minimum Node.js version.

### Create the application

From the parent directory where you want the project:

```bash
npx create-next-app@latest university-probation-system
cd university-probation-system
npm run dev
```

Choose **customize settings** when prompted:

| Setting | Choice |
| --- | --- |
| TypeScript | No |
| Linter | ESLint |
| React Compiler | No for the initial project |
| Tailwind CSS | Yes |
| Use `src/` directory | Yes |
| App Router | Yes |
| Cache Components, if offered | No for the initial project |
| Import alias | Keep `@/*` |

Prompts may vary by Next.js version. Keep the generated configuration and lockfile.

Open [http://localhost:3000](http://localhost:3000).

These instructions assume the named local project directory does not already exist. If you already cloned the repository, scaffold in a separate empty directory and merge the generated files carefully, keeping this README. Do not create another copy of the project inside itself.

### Connect to GitHub

If the remote repository is empty and the local project already has Git initialized:

```bash
git add .
git commit -m "Initialize Next.js project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/university-probation-system.git
git push -u origin main
```

Replace `YOUR_USERNAME`. If Git is not initialized, run `git init` first. If `origin` already exists or the remote contains a README, clone/synchronize that repository before pushing; do not force-push to bypass a conflict.

## 7. Frontend page plan

All routes below are planned routes to implement.

| Route | Role | Content |
| --- | --- | --- |
| `/` | Everyone | Entry page |
| `/login` | Everyone | Demo login form and role selection |
| `/admin/dashboard` | Admin | Student counts, probation counts, and selected semester summary |
| `/admin/students` | Admin | Searchable student list |
| `/admin/students/new` | Admin | Add student form |
| `/admin/students/[id]` | Admin | Student details, editing, and history |
| `/admin/advisors` | Admin | Advisor management |
| `/admin/semesters` | Admin | Semester management |
| `/admin/results` | Admin | Result entry and result list |
| `/admin/probation` | Admin | Demo evaluation controls and probation records |
| `/advisor/dashboard` | Advisor | Assigned student summary |
| `/advisor/students` | Advisor | Assigned student list |
| `/advisor/students/[id]` | Advisor | Results, probation history, and note form |
| `/student/dashboard` | Student | Own latest status and academic summary |
| `/student/results` | Student | Own semester results |
| `/student/probation` | Student | Own probation history |
| `/student/feedback` | Student | Own advisor feedback |

`[id]` is a dynamic route: one page template displays the selected student's record.

## 8. Suggested source organization

Use the following paths as a guide; create files as their features are implemented.

| Path | Purpose |
| --- | --- |
| `src/app/layout.js` | Root HTML layout |
| `src/app/globals.css` | Global styles and generated Tailwind setup |
| `src/app/page.js` | Entry page |
| `src/app/login/page.js` | Demo login page |
| `src/app/admin/layout.js` | Shared admin navigation and layout |
| `src/app/advisor/layout.js` | Shared advisor navigation and layout |
| `src/app/student/layout.js` | Shared student navigation and layout |
| `src/app/.../page.js` | Pages listed in the route plan |
| `src/components/layout/` | Sidebar, header, and mobile navigation |
| `src/components/ui/` | Buttons, inputs, badges, cards, and messages |
| `src/components/students/` | Student table and student form |
| `src/components/results/` | Result form and results table |
| `src/components/probation/` | Demo evaluation controls and history display |
| `src/components/advising/` | Notes list and note form |
| `src/lib/mock-data.js` | Fictional development data |
| `src/context/` | Shared demo state where needed |
| `docs/` | Screenshots, report notes, and approved policy reference |

## 9. Build the frontend in phases

### Phase 1 - Design the shared layout

- [ ] Create a desktop sidebar and header.
- [ ] Create mobile navigation.
- [ ] Add a main content area with a clear page title.
- [ ] Use consistent spacing, typography, form labels, and button styles.
- [ ] Build reusable cards, tables, status badges, and feedback messages.

Use a simple academic dashboard style with a light background and readable contrast. Show status text alongside color; color alone must not communicate probation status.

### Phase 2 - Build with fictional data

- [ ] Add a small set of fictional students, advisors, semesters, results, and notes.
- [ ] Build the student list and details page.
- [ ] Add search by student ID or name and filtering by semester/status.
- [ ] Build the result-entry form.
- [ ] Build the probation history table.
- [ ] Build the advisor note form.
- [ ] Build the student-facing summary pages.

Use React state to simulate edits. In-memory changes reset on a page refresh; communicate this demo behavior clearly.

### Phase 3 - Connect demo interactions

1. Select a fictional student and semester.
2. Enter demo GPA, CGPA, and relevant credit information.
3. Validate the form and update the displayed result in React state.
4. Use a clearly labeled demo evaluation action to display a predefined fictional status and reason.
5. Update the visible demo history without removing earlier semester entries.

Use predefined evaluation examples; do not present simulated outcomes as official academic decisions.

### Phase 4 - Add demo role navigation

- [ ] Build a demo login form or role selector.
- [ ] Navigate to the selected role's dashboard.
- [ ] Show the appropriate sidebar items for each role.
- [ ] Use a selected fictional advisor or student to populate their views.
- [ ] Add a demo logout action that returns to the login screen.

### Phase 5 - Finish and verify

- [ ] Add loading, empty, validation, success, and error states.
- [ ] Disable repeat submissions while a simulated action is running.
- [ ] Test narrow mobile layouts and keyboard navigation.
- [ ] Check that demo changes update the relevant views.
- [ ] Run linting and a production build.
- [ ] Capture screenshots and update setup instructions for the final report.

## 10. Form requirements

| Form | Suggested fields |
| --- | --- |
| Student | Student ID, full name, department, email, assigned advisor |
| Semester | Name, chronological order or start/end dates |
| Academic result | Student, semester, GPA, CGPA, and relevant credits |
| Demo evaluation | Student and semester; display fictional status and reason |
| Advising note | Student, associated case/semester, meeting date, note, action plan |

Keep student IDs as strings so hyphens and leading zeros are preserved. Check for duplicate student IDs and student-and-semester results in demo state. Use the institution's approved GPA scale and credit definitions for client-side validation.

Show visible labels, required-field hints, and readable validation messages.

## 11. Server and Client Components

Next.js pages and layouts are Server Components by default. Add `"use client"` to components that need browser interaction such as `useState`, input event handlers, or click handlers.

Typical Client Components include a result form, interactive search, demo role selection, and mobile navigation. Static content can remain in Server Components.

Keep shared interactive demo data in a common state provider when multiple screens need the same values.

## 12. Frontend verification checklist

- [ ] Navigation works for each demo role.
- [ ] Forms have visible labels and readable errors.
- [ ] Empty student/result/history lists have helpful messages.
- [ ] Tables remain usable on mobile.
- [ ] Pending demo actions show feedback and block duplicate submissions.
- [ ] Invalid submissions do not show a false success message.
- [ ] Search and semester/status filters work with fictional records.
- [ ] Demo form changes appear in the relevant lists and detail views.
- [ ] Missing results display a clear unevaluated state.
- [ ] Fictional status examples and role switching are clearly labeled.
- [ ] Page refresh resets in-memory demo changes as documented.

Run after implementing the application:

```bash
npx eslint .
npm run build
```

Fix relevant errors before preparing the demonstration.

## 13. Milestones

| Milestone | Completion target |
| --- | --- |
| 1. Planning | Approved frontend scope, policy labels, and role views |
| 2. Frontend foundation | Next.js runs; shared layout and routes exist |
| 3. UI prototype | Main forms and tables work with fictional data |
| 4. Demo interactions | Forms, filters, role navigation, and simulated evaluations work |
| 5. Final demonstration | Responsive screens, checks, screenshots, and report ready |

**First practical target:** display a fictional student list and create a result-entry form.

## 14. Documentation to prepare

- Project overview and objectives.
- Frontend scope and role views.
- Approved probation policy reference for displayed labels.
- Page routes and reusable component structure.
- Demo data and interaction behavior.
- Screenshots and frontend test cases.
- Exact local frontend setup instructions.
- Known limitations and possible future improvements.

## Official references

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
