class AuditLogger {
    constructor() {
        this.logs = [];
    }

    logOperation(operationDetails) {
        const timestamp = new Date().toISOString();
        const logEntry = { timestamp, ...operationDetails };
        this.logs.push(logEntry);
        console.log(`Logged: ${JSON.stringify(logEntry)}`);
    }

    getLogs() {
        return this.logs.map(log => ({ ...log })); // return immutable copy
    }

    generateReport() {
        const report = this.logs.map(log => `${log.timestamp} - ${JSON.stringify(log)}`).join('\n');
        console.log('Report generated:\n', report);
        return report;
    }
}

module.exports = new AuditLogger();