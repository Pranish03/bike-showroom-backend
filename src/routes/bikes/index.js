import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { Bike } from "./models.js";

const bikeRouter = Router();

bikeRouter.post("/", requireAuth({ isAdmin: true }), async (req, res) => {
  const data = req.body;

  const existBike = await Bike.findOne({ name: data.name });

  if (existBike)
    return res.status(400).json({
      message: "Bike already exits",
    });

  const bike = await Bike.create(data);

  return res.status(200).json({ Message: "Bike created successfully", bike });
});

export default bikeRouter;
