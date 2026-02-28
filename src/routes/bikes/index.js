import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { requireValidation } from "../../middlewares/requireValidation.js";
import { Bike } from "./models.js";
import {
  createBikeValidationSchema,
  updateBikeValidationSchema,
} from "./validation.js";
import { upload } from "../../lib/multer.js";
import { deleteImage } from "../../utils/deleteImage.js";

const bikeRouter = Router();

/**
 * @Desc   Create bike
 * @Access Admin
 * @API    POST /bike
 */

bikeRouter.post(
  "/",
  requireAuth({ isAdmin: true }),
  upload.single("image"),
  requireValidation(createBikeValidationSchema),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "Image is required" });

      const data = req.parsed;
      const imgUrl = req.file.path.replace("uploads/", "");

      delete data.image;

      const bike = await Bike.create({ ...data, image: imgUrl });

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
 * @API    GET /bike
 */

bikeRouter.get("/", async (req, res) => {
  try {
    const bikes = await Bike.find().select("-details");

    const bikesWithImageUrl = bikes.map((bike) => ({
      ...bike.toObject(),
      image: `${process.env.SERVER_URL}/${bike.image}`,
    }));

    return res.status(200).json({ bikes: bikesWithImageUrl });
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

    const bikeWithImageUrl = {
      ...bike.toObject(),
      image: `${process.env.SERVER_URL}/${bike.image}`,
    };

    return res.status(200).json({ bike: bikeWithImageUrl });
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
  upload.single("image"),
  requireValidation(updateBikeValidationSchema),
  async (req, res) => {
    try {
      const bikeId = req.params.id;

      const bike = await Bike.findById(bikeId);
      if (!bike) return res.status(404).json({ message: "Bike not found" });

      const data = { ...req.parsed };

      if (req.file) {
        deleteImage(bike.image);
        data.image = req.file.path.replace("uploads/", "");
      }

      const updatedBike = await Bike.findByIdAndUpdate(bikeId, data, {
        new: true,
      });

      return res
        .status(200)
        .json({ message: "Bike updated successfully", updatedBike });
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

    deleteImage(bike.image);

    return res.status(200).json({ message: "Bike deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
});

export default bikeRouter;
