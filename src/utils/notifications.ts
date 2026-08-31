import { AppNotification, ApplicationItem, PhDProgram } from "../types";

export function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notifications.");
    return Promise.resolve(false);
  }
  return Notification.requestPermission().then((permission) => permission === "granted");
}

export function sendBrowserNotification(title: string, body: string, icon = "/favicon.ico") {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    try {
      new Notification(title, {
        body,
        icon,
      });
    } catch (e) {
      console.warn("Could not fire notification directly in current context", e);
    }
  }
}

export function sendTestDeadlineNotification() {
  sendBrowserNotification(
    "BioDoc Deadline Alert: Harvard BIG PhD",
    "Application deadline is in 14 days (Dec 1, 2026). Ensure 3 letters of recommendation are requested!",
    "/favicon.ico"
  );
}

export function checkUpcomingDeadlines(
  applications: ApplicationItem[],
  programs?: PhDProgram[]
): AppNotification[] {
  const notifications: AppNotification[] = [];
  const today = new Date();

  // Combine tracked applications
  const itemsToCheck = [
    ...applications.map(app => ({
      title: `${app.university} - ${app.programTitle}`,
      deadline: app.deadline,
      id: app.id,
    })),
  ];

  for (const item of itemsToCheck) {
    if (!item.deadline) continue;
    const deadlineDate = new Date(item.deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= 60) {
      let severity: 'info' | 'warning' | 'urgent' = 'info';
      if (diffDays <= 3) severity = 'urgent';
      else if (diffDays <= 7) severity = 'warning';

      notifications.push({
        id: `deadline-${item.id}-${diffDays}`,
        title: `Upcoming Deadline: ${item.title}`,
        message: diffDays === 0
          ? `Application deadline is TODAY for ${item.title}! Submit your materials now.`
          : `Only ${diffDays} day${diffDays === 1 ? '' : 's'} remaining until the deadline (${item.deadline}).`,
        type: 'deadline',
        severity,
        timestamp: new Date().toISOString(),
        read: false,
        programId: item.id,
        daysUntilDeadline: diffDays,
      });
    }
  }

  return notifications;
}
