/**
 * Service Agreement template from Template Playground.
 * A professional services contract with itemized services and computed totals.
 */
export const serviceTemplate = {
    $class: 'org.accordproject.templatemark@0.5.0.ContractDefinition',
    name: 'service-agreement',
    nodes: [
        {
            $class: 'org.accordproject.commonmark@0.5.0.Heading',
            level: '1',
            nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'SERVICE AGREEMENT' }],
        },
        {
            $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
            nodes: [
                { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'This Service Agreement is made and entered into as of ' },
                {
                    $class: 'org.accordproject.templatemark@0.5.0.FormattedVariableDefinition',
                    name: 'effectiveDate',
                    elementType: 'DateTime',
                    format: 'D MMMM YYYY',
                    nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '1 February 2026' }],
                },
                { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' by and between ' },
                {
                    $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
                    name: 'clientName',
                    elementType: 'String',
                    nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Acme Corp' }],
                },
                { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ', located at ' },
                {
                    $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
                    name: 'clientAddress',
                    elementType: 'String',
                    nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '123 Business Road, London, UK' }],
                },
                { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' (Client), and ' },
                {
                    $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
                    name: 'providerName',
                    elementType: 'String',
                    nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'DevConsult Ltd' }],
                },
                { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ', located at ' },
                {
                    $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
                    name: 'providerAddress',
                    elementType: 'String',
                    nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '456 Tech Street, Berlin, Germany' }],
                },
                { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' (Provider).' },
            ],
        },
        {
            $class: 'org.accordproject.commonmark@0.5.0.ThematicBreak',
        },
        {
            $class: 'org.accordproject.commonmark@0.5.0.Heading',
            level: '2',
            nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '1. Services' }],
        },
        {
            $class: 'org.accordproject.templatemark@0.5.0.ClauseDefinition',
            name: 'compensation',
            elementType: 'org.accordproject.service@1.0.0.Compensation',
            nodes: [
                {
                    $class: 'org.accordproject.commonmark@0.5.0.Heading',
                    level: '3',
                    nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Services Provided' }],
                },
                {
                    $class: 'org.accordproject.templatemark@0.5.0.ListBlockDefinition',
                    name: 'services',
                    elementType: 'org.accordproject.service@1.0.0.ServiceItem[]',
                    listType: 'bullet',
                    nodes: [
                        {
                            $class: 'org.accordproject.commonmark@0.5.0.Item',
                            nodes: [
                                {
                                    $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
                                    nodes: [
                                        {
                                            $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
                                            name: 'description',
                                            elementType: 'String',
                                            nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Backend Development' }],
                                        },
                                        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' at ' },
                                        {
                                            $class: 'org.accordproject.templatemark@0.5.0.FormattedVariableDefinition',
                                            name: 'rate',
                                            elementType: 'Double',
                                            format: '0.00',
                                            nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '80.00' }],
                                        },
                                        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' per unit × ' },
                                        {
                                            $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
                                            name: 'quantity',
                                            elementType: 'Integer',
                                            nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '40' }],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    $class: 'org.accordproject.commonmark@0.5.0.Heading',
                    level: '3',
                    nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Payment Terms' }],
                },
                {
                    $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
                    nodes: [
                        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Payment is due within ' },
                        {
                            $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
                            name: 'paymentTerms',
                            elementType: 'Integer',
                            nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '30' }],
                        },
                        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' days of invoice.' },
                    ],
                },
            ],
        },
        {
            $class: 'org.accordproject.commonmark@0.5.0.ThematicBreak',
        },
        {
            $class: 'org.accordproject.commonmark@0.5.0.Heading',
            level: '2',
            nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '2. Total Compensation' }],
        },
        {
            $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
            nodes: [
                { $class: 'org.accordproject.commonmark@0.5.0.Softbreak' },
                { $class: 'org.accordproject.commonmark@0.5.0.Strong', nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Total Service Value:' }] },
                { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' ' },
                {
                    $class: 'org.accordproject.templatemark@0.5.0.FormulaDefinition',
                    name: 'totalServiceValue',
                    elementType: 'String',
                    code: {
                        $class: 'org.accordproject.templatemark@0.5.0.Code',
                        type: 'ES_2020',
                        contents: "return '$' + compensation.services.map(s => s.rate * s.quantity).reduce((sum, cur) => sum + cur, 0).toFixed(2);",
                    },
                    nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '$3800.00' }],
                },
            ],
        },
        {
            $class: 'org.accordproject.commonmark@0.5.0.ThematicBreak',
        },
        {
            $class: 'org.accordproject.commonmark@0.5.0.Heading',
            level: '2',
            nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '3. Execution' }],
        },
        {
            $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
            nodes: [
                { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'IN WITNESS WHEREOF, the parties hereto have executed this Agreement.' },
            ],
        },
        {
            $class: 'org.accordproject.commonmark@0.5.0.Heading',
            level: '3',
            nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Client:' }],
        },
        {
            $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
            nodes: [
                {
                    $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
                    name: 'clientName',
                    elementType: 'String',
                    nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Acme Corp' }],
                },
            ],
        },
        {
            $class: 'org.accordproject.commonmark@0.5.0.Heading',
            level: '3',
            nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Provider:' }],
        },
        {
            $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
            nodes: [
                {
                    $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
                    name: 'providerName',
                    elementType: 'String',
                    nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'DevConsult Ltd' }],
                },
            ],
        },
    ],
};
/**
 * Concerto model for the Service Agreement template.
 */
export const serviceModel = `namespace org.accordproject.service@1.0.0

concept ServiceItem {
    o String description
    o Double rate
    o Integer quantity
}

concept Compensation {
  o ServiceItem[] services
  o Integer paymentTerms
}

@template
concept ServiceAgreement {
    o String clientName
    o String clientAddress
    o String providerName
    o String providerAddress
    o DateTime effectiveDate
    o Compensation compensation
}`;
/**
 * Sample data for the Service Agreement template.
 */
export const serviceData = {
    "$class": "org.accordproject.service@1.0.0.ServiceAgreement",
    "effectiveDate": "2026-02-01T00:00:00Z",
    "clientName": "Acme Corp",
    "clientAddress": "123 Business Road, London, UK",
    "providerName": "DevConsult Ltd",
    "providerAddress": "456 Tech Street, Berlin, Germany",
    "compensation": {
        "$class": "org.accordproject.service@1.0.0.Compensation",
        "paymentTerms": 30,
        "services": [
            {
                "$class": "org.accordproject.service@1.0.0.ServiceItem",
                "description": "Backend Development",
                "rate": 80,
                "quantity": 40
            },
            {
                "$class": "org.accordproject.service@1.0.0.ServiceItem",
                "description": "Code Review",
                "rate": 60,
                "quantity": 10
            }
        ]
    }
};
