import { Router } from "express";
import { mediaController } from "../controllers/media.controller";
// import { mediaController } from "../controllers/media.contoller";

class MediaRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router
      .route(`/files/upload`)
      .post(mediaController.uploadMedia);
  }
}

export const mediaRoutes = new MediaRoutes;
