import express from 'express';
import { Router } from 'express';
import bcrypt from 'bcrypt';
import { config } from './config/env.js';

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    isActive: true,
    password: "$2b$10$somehashedpasswordhere" // example hashed password
  },
  {
    id: 2,
    name: "Sarah Brown",
    email: "sarah@example.com",
    role: "user",
    isActive: true,
    password: "$2b$10$somehashedpasswordhere"
  },
  {
    id: 3,
    name: "Michael Lee",
    email: "michael@example.com",
    role: "moderator",
    isActive: false,
    password: "$2b$10$somehashedpasswordhere"
  },
  {
    id: 4,
    name: "Aisha Kamal",
    email: "aisha@example.com",
    role: "user",
    isActive: true,
    password: "$2b$10$somehashedpasswordhere"
  },
  {
    id: 5,
    name: "David Ojo",
    email: "david.ojo@example.com",
    role: "user",
    isActive: false,
    password: "$2b$10$somehashedpasswordhere"
  }
];

const app = express();
app.use(express.json());

const router = Router();
app.use(router);

router.get("/", (req, res) => {
  res.send(`Hello World`);
});

// Get user by id
router.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const user = users.find(user => user.id === id);

  if (!user) {
    return res.status(404).json({ error: `User not found with id: ${id}` });
  }

  // Exclude password from response for security
  const { password, ...userWithoutPassword } = user;

  return res.status(200).json({ user: userWithoutPassword });
});

// Signup route with bcrypt hashing
router.post('/users/signup', async (req, res) => {
  const { id, name, email, password } = req.body;

  if (!id) return res.status(400).json({ error: "id is required" });
  if (!name) return res.status(400).json({ error: "name is required" });
  if (!email) return res.status(400).json({ error: "email is required" });
  if (!password) return res.status(400).json({ error: "password is required" });

  // Check duplicates
  const existingUserById = users.find(user => user.id === id);
  if (existingUserById) return res.status(409).json({ error: "User with this id already exists" });

  const existingUserByEmail = users.find(user => user.email === email);
  if (existingUserByEmail) return res.status(409).json({ error: "User with this email already exists" });

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  users.push({
    id,
    name,
    email,
    role: "user",
    isActive: true,
    password: hashedPassword
  });

  return res.status(201).json({ message: "Account registered successfully" });
});

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});

