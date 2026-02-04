class AuditLogger {
    constructor() {
        this.logs = [];
    }

    logAction(action, content, author) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            action,
            content,
            author,
            timestamp,
        };
        this.logs.push(logEntry);
        this.sendConfirmationEmail(logEntry);
    }

    sendConfirmationEmail(logEntry) {
        // Logic to send confirmation email
        console.log(`Email sent to ${logEntry.author}: Action \