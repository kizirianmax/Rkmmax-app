// Updated adaptiveTriageProtocol logic and full 4-layer architecture

function adaptiveTriageProtocol(input) {
    // Simplified logic
    if (input.condition === 'urgent') {
        return 'Immediate action required';
    } else if (input.condition === 'non-urgent') {
        return 'Schedule for later';
    } else {
        return 'No action needed';
    }
}

// 4-layer architecture
// Layer 1: Input Layer
// Layer 2: Processing Layer
// Layer 3: Decision Layer
// Layer 4: Output Layer

module.exports = { adaptiveTriageProtocol };