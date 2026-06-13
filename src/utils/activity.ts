import ActivityLog from '../models/ActivityLog';
import { IUser } from '../models/User';

export async function recordActivity(user: IUser, action: string, target?: string, details?: string) {
  await ActivityLog.create({
    user: user._id,
    email: user.email,
    action,
    target,
    details,
  });
}
