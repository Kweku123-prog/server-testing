import { HandleException } from "../../../utils";
import { Notifications } from "../models/notifications.models";

async function saveNotification(
  userId: string,
  title: string,
  body: string,
  data?: any
) {
  try {
    const notification = await new Notifications({
      user: userId,
      title,
      body,
      data,
    }).save();  
    console.log(notification)
  } catch (error) {
    console.log({ NotificationError: error });
  }
}

async function getUserNotifications(userId: string, page: number) {
  try {
    const query = {user: userId}
    
    
    const options = {
      page,
      limit: 20,
      select: "-__v",
      leanWithId: false,
      lean: true,
      sort: {createdAt: -1}
    };

    const notifications = Notifications.paginate(query, options)
    return notifications
  } catch (error: any) {
    throw new HandleException(error.status, error.message)
  }
}

export { saveNotification, getUserNotifications };
