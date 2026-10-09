import { PushNotificationAlert } from '../types';
import { playChimeSound } from './audioAlert';

const NOTIFICATIONS_STORAGE_KEY = 'aura_jewelry_push_notifications';
type NotificationCallback = (alert: PushNotificationAlert) => void;
const subscribers = new Set<NotificationCallback>();

export function getStoredNotifications(): PushNotificationAlert[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredNotifications(alerts: PushNotificationAlert[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(alerts));
  } catch (err) {
    console.error('Failed to save push alerts', err);
  }
}

export function subscribeNotifications(callback: NotificationCallback): () => void {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

export async function requestBrowserPushPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

export function triggerPushNotification(payload: {
  type: PushNotificationAlert['type'];
  title: string;
  message: string;
  orderId?: string;
  inquiryId?: string;
}): PushNotificationAlert {
  const alert: PushNotificationAlert = {
    id: 'push_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    type: payload.type,
    title: payload.title,
    message: payload.message,
    timestamp: new Date().toISOString(),
    read: false,
    orderId: payload.orderId,
    inquiryId: payload.inquiryId,
  };

  // 1. Play crystal audio chime
  playChimeSound();

  // 2. Browser native push notification if enabled
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(payload.title, {
        body: payload.message,
        icon: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=128&auto=format&fit=crop&q=80',
        tag: alert.id,
      });
    } catch (e) {
      console.warn('Native notification failed', e);
    }
  }

  // 3. Persist alert
  const current = getStoredNotifications();
  const updated = [alert, ...current.slice(0, 49)];
  saveStoredNotifications(updated);

  // 4. Notify all active in-app subscribers
  subscribers.forEach((sub) => sub(alert));

  // 5. Broadcast to other tabs
  try {
    const channel = new BroadcastChannel('aura_jewelry_alerts');
    channel.postMessage({ type: 'NEW_ALERT', alert });
    channel.close();
  } catch {
    // BroadcastChannel unsupported or restricted in sandbox
  }

  return alert;
}
