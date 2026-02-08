import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { requireValidation } from "../../middlewares/requireValidation.js";
import { Bike } from "./models.js";
import {
  createBikeValidationSchema,
  updateBikeValidationSchema,
} from "./validation.js";

const bikeRouter = Router();

/**
 * @Desc   Create bike
 * @Access Admin
 * @API    POST /bike/
 */

bikeRouter.post(
  "/",
  requireAuth({ isAdmin: true }),
  requireValidation(createBikeValidationSchema),
  async (req, res) => {
    try {
      const data = req.body;
      const bike = await Bike.create(data);

      return res
        .status(200)
        .json({ Message: "Bike created successfully", bike });
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  },
);

/**
 * @Desc   Get all bikes
 * @Access All
 * @API    GET /bike/
 */

bikeRouter.get("/", async (req, res) => {
  try {
    const bikes = await Bike.find().select("-details");

    return res.status(200).json({ bikes });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});

/**
 * @Desc   Get bike by id
 * @Access All
 * @API    GET /bike/:id
 */

bikeRouter.get("/:id", async (req, res) => {
  try {
    const bikeId = req.params.id;
    const bike = await Bike.findById(bikeId);

    return res.status(200).json({ bike });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});

/**
 * @Desc   Update bike by id
 * @Access Admin
 * @API    PUT /bike/:id
 */

bikeRouter.put(
  "/:id",
  requireAuth({ isAdmin: true }),
  requireValidation(updateBikeValidationSchema),
  async (req, res) => {
    try {
      const bikeId = req.params.id;
      const data = req.body;

      const bike = await Bike.findByIdAndUpdate(bikeId, data, { new: true });

      if (!bike) return res.status(404).json({ message: "Bike not found" });

      return res
        .status(200)
        .json({ message: "Bike updated successfully", bike });
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  },
);

/**
 * @Desc   Delete bike by id
 * @Access Admin
 * @API    DELETE /bike/:id
 */

bikeRouter.delete("/:id", requireAuth({ isAdmin: true }), async (req, res) => {
  try {
    const bikeId = req.params.id;

    const bike = await Bike.findByIdAndDelete(bikeId);

    if (!bike) return res.status(404).json({ message: "Bike not found" });

    return res.status(200).json({ message: "Bike deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
});

export default bikeRouter;
