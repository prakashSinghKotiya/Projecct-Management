# ProjectFlow — Frontend



## 1. Folder structure

```
src/
├── api/                     # ONLY place that talks to the backend
│   ├── apiClient.js         #   fetch wrapper: base URL, cookies, JSON, errors
│   ├── authApi.js           #   /user/* endpoints
│   ├── projectApi.js        #   /project/* endpoints
│   └── taskApi.js           #   /task/* endpoints
│
├── components/
│   ├── common/              # Reusable building blocks
│   │   ├── Button.jsx       #   variants + loading state
│   │   ├── Input.jsx        #   label + inline error
│   │   ├── Modal.jsx        #   dialog with Escape/overlay close
│   │   ├── Loader.jsx       #   spinner
│   │   ├── ErrorMessage.jsx #   error banner
│   │   └── EmptyState.jsx   #   "no data yet" block
│   ├── layout/              # Navbar + page shell
│   ├── projects/            # ProjectCard, ProjectList, CreateProjectForm, AddMemberForm
│   └── tasks/               # TaskCard, TaskList, CreateTaskForm, TaskStatus
│
├── context/
│   └── AuthContext.jsx      # Global auth state (the only context)
│
├── hooks/
│   ├── useAuth.js           # reads AuthContext
│   ├── useProjects.js       # project list + create/update/delete/addMember
│   └── useTasks.js          # tasks for one project + create/update/delete
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── ProjectDetails.jsx
│   └── NotFound.jsx
│
├── routes/
│   ├── ProtectedRoute.jsx   # auth guard
│   └── AppRoutes.jsx        # route table
│
├── utils/
│   ├── errors.js            # error -> friendly message
│   ├── format.js            # date formatting
│   └── taskStatus.js        # status labels/colors/progress math
│
├── App.jsx                  # providers + routes
├── main.jsx
└── index.css                # all styles (CSS variables, responsive)
```


---



| Module | Method | Endpoint | Notes |
|---|---|---|---|
| authApi | register | `POST /user/register` | body `{name, email, password}` |
| authApi | login | `POST /user/login` | sets `sid` cookie |
| authApi | getMe | `GET /user/` | returns `{name, email, picture}` |
| authApi | logout | `POST /user/logout` | clears cookie |
| projectApi | getProjects | `GET /project/` | populated owner + members |
| projectApi | getProject | `GET /project/getproject/:id` | |
| projectApi | createProject | `POST /project/create` | body `{name, description}` |
| projectApi | updateProject | `PATCH /project/update/:id` | owner only |
| projectApi | deleteProject | `DELETE /project/delete/:id` | owner only |
| projectApi | addMember | `POST /project/add/:id/members` | owner only, body `{email}` |
| taskApi | getTasks | `GET /task/projects/:projectId/tasks` | |
| taskApi | createTask | `POST /task/projects/:projectId/createtasks` | |
| taskApi | updateTask | `PATCH /task/updatetasks/:taskId` | partial update |
| taskApi | deleteTask | `DELETE /task/deletetasks/:taskId` | |

---

