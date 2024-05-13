import { Request, Response } from "express";
import { getUserNotifications } from "../repositery/notification.repo";
import { STATUS_CODES } from "../../../constants";
import { handleErrorResponse } from "../../../utils";

class NotificationController {
  public async getUserNotifications(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const userId = (req as any).user._id;
    try {
      const notifications = await getUserNotifications(userId, page);
      res.status(STATUS_CODES.OK).json({
        message: "Fetched user notifications",
        data: notifications,
      });
    } catch (error: any) {
      handleErrorResponse(res, error);
    }
  }
}

export const notificationsController = new NotificationController();
