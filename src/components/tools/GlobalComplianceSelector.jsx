import React from 'react';

const GlobalComplianceSelector = () => {
    const complianceStandards = [
        'ISO 27001',
        'GDPR',
        'HIPAA',
        'PCI-DSS',
        'CCPA'
    ];

    const handleSelection = (event) => {
        const selectedStandard = event.target.value;
        console.log(`Selected compliance standard: ${selectedStandard}`);
        // Further action can be defined here
    };

    return (
        <div>
            <label htmlFor="compliance-standards">Select Compliance Standard:</label>
            <select id="compliance-standards" onChange={handleSelection}>
                {complianceStandards.map((standard) => (
                    <option key={standard} value={standard}>{standard}</option>
                ))}
            </select>
        </div>
    );
};

export default GlobalComplianceSelector;