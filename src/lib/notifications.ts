/**
 * Email Notification Service
 * 
 * This utility module defines the notification templates and logic
 * for EarlyEdge's transactional emails. In production, these would
 * be called from Supabase Edge Functions using Resend or SendGrid.
 * 
 * For now, we log notification intents and expose helper functions
 * that can be wired up to an email API when ready.
 */

/* ─── Types ─────────────────────────────────────────────────── */

export type NotificationType =
    | 'booking_confirmed'
    | 'session_reminder_24h'
    | 'session_reminder_1h'
    | 'review_prompt'
    | 'review_received'
    | 'new_message'
    | 'coach_verified'
    | 'welcome';

export interface NotificationPayload {
    type: NotificationType;
    recipientEmail: string;
    recipientName: string;
    data: Record<string, any>;
}

/* ─── Templates ─────────────────────────────────────────────── */

const templates: Record<NotificationType, {
    subject: (data: Record<string, any>) => string;
    body: (data: Record<string, any>) => string;
}> = {
    booking_confirmed: {
        subject: (d) => `Booking confirmed with ${d.coachName}`,
        body: (d) => `Hi ${d.studentName},\n\nYour ${d.sessionType} with ${d.coachName} has been confirmed.\n\n📅 ${d.date}\n⏰ ${d.time}\n⏱️ ${d.duration}\n🔗 Meeting link: ${d.meetingLink || 'Will be shared before the session'}\n\nPrepare any questions or materials you'd like to discuss.\n\nBest,\nThe EarlyEdge Team`,
    },
    session_reminder_24h: {
        subject: (d) => `Reminder: Session with ${d.otherName} tomorrow`,
        body: (d) => `Hi ${d.recipientName},\n\nJust a reminder that you have a session tomorrow:\n\n📅 ${d.date}\n⏰ ${d.time}\n👤 ${d.otherName}\n📝 ${d.sessionType}\n\n🔗 ${d.meetingLink || 'Meeting link will be shared soon'}\n\nBest,\nThe EarlyEdge Team`,
    },
    session_reminder_1h: {
        subject: (d) => `Starting soon: Session with ${d.otherName} in 1 hour`,
        body: (d) => `Hi ${d.recipientName},\n\nYour session with ${d.otherName} starts in 1 hour.\n\n🔗 Join here: ${d.meetingLink || 'Check your booking details'}\n\nBest,\nThe EarlyEdge Team`,
    },
    review_prompt: {
        subject: (d) => `How was your session with ${d.coachName}?`,
        body: (d) => `Hi ${d.studentName},\n\nHope your session with ${d.coachName} went well!\n\nWe'd love to hear your feedback — it helps other students find the right coach and helps coaches improve.\n\n⭐ Leave a review: ${d.reviewLink}\n\nIf you landed an offer or achieved a great outcome, let us know — we'll add it as a badge to your review!\n\nBest,\nThe EarlyEdge Team`,
    },
    review_received: {
        subject: (d) => `New ${d.rating}⭐ review from ${d.studentName}`,
        body: (d) => `Hi ${d.coachName},\n\nYou just received a new review!\n\n⭐ ${d.rating}/5 from ${d.studentName}\n"${d.reviewText}"\n\nKeep up the great work!\n\nBest,\nThe EarlyEdge Team`,
    },
    new_message: {
        subject: (d) => `New message from ${d.senderName}`,
        body: (d) => `Hi ${d.recipientName},\n\nYou have a new message from ${d.senderName}:\n\n"${d.messagePreview}"\n\nReply here: ${d.messageLink}\n\nBest,\nThe EarlyEdge Team`,
    },
    coach_verified: {
        subject: () => `Your EarlyEdge profile is now live! 🎉`,
        body: (d) => `Hi ${d.coachName},\n\nGreat news — your coach profile has been verified and is now live on EarlyEdge!\n\nStudents can now find and book sessions with you.\n\nHere are some tips to get your first bookings:\n1. Share your profile link with your network\n2. Keep your availability up to date\n3. Respond to messages quickly\n\nView your profile: ${d.profileLink}\n\nBest,\nThe EarlyEdge Team`,
    },
    welcome: {
        subject: (d) => `Welcome to EarlyEdge, ${d.name}! 🚀`,
        body: (d) => `Hi ${d.name},\n\nWelcome to EarlyEdge — the peer coaching platform where you learn from students who just did what you're trying to do.\n\n🔍 Browse coaches by category\n📞 Book a free 15-minute intro call\n💬 Message coaches directly\n\nGet started: ${d.dashboardLink}\n\nBest,\nThe EarlyEdge Team`,
    },
};

/* ─── Send Notification ─────────────────────────────────────── */

/**
 * Queue a notification to be sent.
 * In production, this would call a Supabase Edge Function
 * which then uses Resend/SendGrid to send the actual email.
 */
export async function sendNotification(payload: NotificationPayload): Promise<void> {
    const template = templates[payload.type];
    if (!template) {
        console.warn(`Unknown notification type: ${payload.type}`);
        return;
    }

    const subject = template.subject(payload.data);
    const body = template.body(payload.data);

    // In production, this would be:
    // await supabase.functions.invoke('send-email', {
    //     body: { to: payload.recipientEmail, subject, body }
    // });

    console.log(`📧 [${payload.type}] → ${payload.recipientEmail}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body: ${body.substring(0, 100)}...`);
}

/* ─── Convenience Functions ─────────────────────────────────── */

export function notifyBookingConfirmed(booking: {
    studentEmail: string;
    studentName: string;
    coachName: string;
    sessionType: string;
    date: string;
    time: string;
    duration: string;
    meetingLink?: string;
}) {
    return sendNotification({
        type: 'booking_confirmed',
        recipientEmail: booking.studentEmail,
        recipientName: booking.studentName,
        data: booking,
    });
}

export function notifyReviewPrompt(booking: {
    studentEmail: string;
    studentName: string;
    coachName: string;
    reviewLink: string;
}) {
    return sendNotification({
        type: 'review_prompt',
        recipientEmail: booking.studentEmail,
        recipientName: booking.studentName,
        data: booking,
    });
}

export function notifySessionReminder(params: {
    recipientEmail: string;
    recipientName: string;
    otherName: string;
    sessionType: string;
    date: string;
    time: string;
    meetingLink?: string;
    timing: '24h' | '1h';
}) {
    return sendNotification({
        type: params.timing === '24h' ? 'session_reminder_24h' : 'session_reminder_1h',
        recipientEmail: params.recipientEmail,
        recipientName: params.recipientName,
        data: params,
    });
}

export function notifyCoachVerified(coach: {
    coachEmail: string;
    coachName: string;
    profileLink: string;
}) {
    return sendNotification({
        type: 'coach_verified',
        recipientEmail: coach.coachEmail,
        recipientName: coach.coachName,
        data: coach,
    });
}

export function notifyWelcome(user: {
    email: string;
    name: string;
    dashboardLink: string;
}) {
    return sendNotification({
        type: 'welcome',
        recipientEmail: user.email,
        recipientName: user.name,
        data: user,
    });
}
