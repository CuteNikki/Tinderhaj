# 🦈 Tinderhaj

**Tinderhaj** is a playful, modern web app inspired by IKEA’s iconic Blåhaj plush shark. Built with [Next.js](https://nextjs.org/), it uses TypeScript for safety, Prisma for database management, and Bun for fast development.

---

## 🚀 Features

- **Modern Next.js** app directory structure
- **TypeScript** for type safety
- **Prisma ORM** for database access and migrations
- **Prettier & ESLint** for code quality
- **Custom UI components** and shark-themed assets in [`public/`](public/)

---

## 🛠️ Getting Started

1. **Install dependencies:**

   ```bash
   bun install
   ```

2. **Configure environment variables:**

   - Copy `.env.example` to `.env` and update the values.

3. **Set up the database:**

   ```bash
   bun run prisma-migrate
   # (Optional) Seed the database:
   bun run prisma-seed
   ```

4. **Start the development server:**

   ```bash
   bun run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧑‍💻 Scripts

| Script           | Description                  |
| ---------------- | ---------------------------- |
| `dev`            | Start the development server |
| `build`          | Build for production         |
| `start`          | Start the production server  |
| `lint`           | Run ESLint                   |
| `format`         | Format code with Prettier    |
| `prisma-migrate` | Run Prisma migrations        |
| `prisma-seed`    | Seed the database            |
| `prisma-studio`  | Open Prisma Studio           |

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repo
2. Create a new branch:  
   `git checkout -b feature/your-feature`
3. Commit your changes:  
   `git commit -am 'Add new feature'`
4. Push to your branch:  
   `git push origin feature/your-feature`
5. Open a pull request

---

## 📝 License

Licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Made with ❤️ and sharks.
