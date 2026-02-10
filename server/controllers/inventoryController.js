import Inventory from "../models/Inventory.js";

/* =====================================================
   HELPER: FINAL STATUS LOGIC (SINGLE SOURCE OF TRUTH)
   ===================================================== */
const getFinalStatus = (stock, status) => {
  const numericStock = Number(stock);

  // 1️⃣ Highest priority: Discontinued (manual lock)
  if (status === "Discontinued") return "Discontinued";

  // 2️⃣ Manual Out of Stock should NEVER be overwritten
  if (status === "Out of Stock") return "Out of Stock";

  // 3️⃣ Auto rule: stock <= 0 → Out of Stock
  if (numericStock <= 0) return "Out of Stock";

  // 4️⃣ Default
  return "Available";
};

/* ================= GET ALL ================= */
export const getItems = async (req, res) => {
  try {
    const { page, limit } = req.query;

    if (page && limit) {
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;

      const total = await Inventory.countDocuments();
      const items = await Inventory.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      return res.status(200).json({
        data: items,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      });
    }

    const items = await Inventory.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   CREATE ITEM
   ===================================================== */
export const createItem = async (req, res) => {
  try {
    const { name, category, stock, price, status } = req.body;

    // ✅ Validation
    if (
      !name ||
      !category ||
      stock === undefined ||
      price === undefined
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const finalStatus = getFinalStatus(stock, status);

    const item = await Inventory.create({
      name,
      category,
      stock: Number(stock),
      price: Number(price),
      status: finalStatus,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("CREATE ITEM ERROR:", error.message);
    res.status(400).json({ message: error.message });
  }
};

/* =====================================================
   UPDATE ITEM
   ===================================================== */
export const updateItem = async (req, res) => {
  try {
    const { stock, status } = req.body;

    const finalStatus = getFinalStatus(stock, status);

    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        stock: Number(stock),
        status: finalStatus,
      },
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    console.error("UPDATE ITEM ERROR:", error.message);
    res.status(400).json({ message: error.message });
  }
};

/* =====================================================
   DELETE ITEM
   ===================================================== */
export const deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
