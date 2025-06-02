import express from "express";
import createError from "http-errors";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ message: "Get all contacts" });
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(createError(400, "ID is required"));
  res.json({ message: `Get contact by ID: ${id}` });
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) return next(createError(400, "Missing fields"));
  res.status(201).json({ message: "Contact created", contact: { name, email, phone } });
});

export default router;
