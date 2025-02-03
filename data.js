const journeyData = {
    // Stage definitions for easy reference
    stages: {
        conversion: {
            name: "Conversion",
            description: "Steps required to create and set up an account"
        },
        activation: {
            name: "Activation",
            description: "Steps required to complete first order"
        }
    },
    
    // Step data
    steps: [
        {
            id: 'form',
            title: 'Fill out Form on Website',
            stage: 'conversion',
            segments: ['all'],
            userGoal: 'I need to share my business information in order to create an account',
            painPoints: [
                'Too many questions with no context on why they\'re needed',
                'No ability to save progress and return later',
                'Unclear what happens after submission'
            ],
            next: ['signup']
        },
        {
            id: 'signup',
            title: 'Sign up',
            stage: 'conversion',
            segments: ['all'],
            userGoal: 'I need to create my account so I can start exploring the platform and products',
            painPoints: [
                '5 second wait time between signup and entering admin',
                'No personalization of the experience',
                'No guided onboarding flow',
                'Unclear next steps after account creation'
            ],
            next: ['dashboard']
        },
        {
            id: 'dashboard',
            title: 'Dashboard',
            stage: 'conversion',
            segments: ['all'],
            userGoal: 'I need to understand what I can do on this platform and where to start',
            painPoints: [
                'No personalized recommendations based on information provided',
                'No progress tracking or setup checklist',
                'Critical features buried in navigation'
            ],
            next: ['create-product', 'connect-store', 'order-sample', 'billing', 'configure-vas']
        },
        {
            id: 'create-product',
            title: 'Create Product',
            stage: 'activation',
            segments: ['smb-unmanaged', 'smb-managed'],
            userGoal: 'I need to start setting up my first product so I can publish them to start selling on my sales channels',
            painPoints: [
                'Complex workflow with too many steps',
                'No draft capabilities',
                'No batch creation options',
                'No templates or quick-start options'
            ],
            next: ['product-hub']
        },
        {
            id: 'product-hub',
            title: 'Product Hub',
            stage: 'activation',
            segments: ['smb-unmanaged', 'smb-managed'],
            userGoal: 'I need to manage my products across all my sales channels effectively',
            painPoints: [
                'Products in the Hub feel very disconnected from the listing on my sales channels',
            ],
            next: ['product-catalog']
        },
        {
            id: 'product-catalog',
            title: 'Product Catalog',
            stage: 'activation',
            segments: ['all'],
            userGoal: 'I need to find products that match my business needs and customer demand',
            painPoints: [
                'Limited product details and specifications',
                'No way to compare similar products',
                'Missing key product metrics (popularity, margins)',
                'Limited filtering options'
            ],
            next: ['select-sku']
        },
        {
            id: 'select-sku',
            title: 'Select SKU (Products)',
            stage: 'activation',
            segments: ['all'],
            userGoal: 'I need to choose the right variants and options for my selected product',
            painPoints: [
                'Don\'t understand SKU configurations',
                'Unclear what options mean',
                'No preview of SKU combinations',
                'Missing size charts and specifications'
            ],
            next: ['upload-artwork']
        },
        {
            id: 'upload-artwork',
            title: 'Upload Artwork',
            stage: 'activation',
            segments: ['smb-unmanaged', 'smb-managed'],
            userGoal: 'I need to add my artwork to my selected product',
            painPoints: [
                'Don\'t have clear artwork requirements',
                'No templates or guidelines',
                'Limited design tools',
                'No immediate preview'
            ],
            next: ['download-mockup']
        },
        {
            id: 'download-mockup',
            title: 'Download Mockup',
            stage: 'activation',
            segments: ['smb-unmanaged', 'smb-managed'],
            userGoal: 'I need to see how my design will look on the actual product and verify my product looks exactly how I want it before publishing',
            painPoints: [
                'Mockup only visible after artwork upload',
                'Limited mockup angles',
                'Can\'t easily make adjustments',
                'No option to import external mockups'
            ],
            next: ['publish-product']
        },
        {
            id: 'connect-store',
            title: 'Connect Store',
            stage: 'activation',
            segments: ['smb-unmanaged', 'smb-managed'],
            userGoal: 'I need to link my existing store/sales channel so orders flow to Gooten automatically',
            painPoints: [
                'Time-consuming connection process',
                'No progress indicator',
                'Limited platform support',
                'Unclear requirements beforehand'
            ],
            next: ['sales-channels']
        },
        {
            id: 'sales-channels',
            title: 'Sales Channels',
            stage: 'activation',
            segments: ['smb-unmanaged', 'smb-managed'],
            userGoal: 'I need to manage my sales channels effectively',
            painPoints: [
                'Limited integration options',
                'Complex setup process',
                'No clear status indicators'
            ],
            next: ['connect-url']
        },
        {
            id: 'connect-url',
            title: 'Connect URL',
            stage: 'activation',
            segments: ['smb-unmanaged', 'smb-managed'],
            userGoal: 'I need to establish the connection between my store and Gooten',
            painPoints: [
                'Technical process not clearly explained',
                'Limited troubleshooting guidance',
                'No connection status monitoring'
            ],
            next: ['sync-products']
        },
        {
            id: 'sync-products',
            title: 'Sync Products',
            stage: 'activation',
            segments: ['smb-unmanaged', 'smb-managed'],
            userGoal: 'I need to migrate my existing products from my store/sales channel into Gooten',
            painPoints: [
                'Slow import compared to competitors',
                'No bulk editing capabilities',
                'Limited sync options',
                'No status updates during sync'
            ],
            next: ['select-sku']
        },
        {
            id: 'order-sample',
            title: 'Order a Sample',
            stage: 'activation',
            segments: ['all'],
            userGoal: 'I need to verify the quality before using Gooten as a fulfillment partner',
            painPoints: [
                'Complex sample ordering process',
                'No sample pricing visible upfront',
                'Limited to one sample per product',
                'Long sample processing times'
            ],
            next: ['place-order']
        },
        {
            id: 'place-order',
            title: 'Place Order',
            stage: 'activation',
            segments: ['all'],
            userGoal: 'I need to complete my sample order',
            painPoints: [
                'Limited payment options',
                'No order tracking capabilities',
                'Unclear delivery timeframes'
            ],
            next: ['create-new-product']
        },
        {
            id: 'create-new-product',
            title: 'Create New Product',
            stage: 'activation',
            segments: ['smb-unmanaged', 'smb-managed'],
            userGoal: 'I need to create a product based on my sample',
            painPoints: [
                'No way to copy sample settings',
                'Manual recreation required',
                'No template creation from sample'
            ],
            next: ['select-products']
        },
        {
            id: 'billing',
            title: 'Billing Information',
            stage: 'activation',
            segments: ['all'],
            userGoal: 'I need to setup my billing so that I can pay for orders',
            painPoints: [
                'No clear description on when charges occur',
                'Difficult cash flow management',
                'No option to request credit terms',
                'No flexible billing cycle options'
            ],
            next: ['settings-billing']
        },
        {
            id: 'settings-billing',
            title: 'Settings/Billing',
            stage: 'activation',
            segments: ['all'],
            userGoal: 'I need to manage my billing settings',
            painPoints: [
                'Limited payment method options',
                'No automated billing reports',
                'Complex reconciliation process'
            ],
            next: ['first-order']
        },
        {
            id: 'configure-vas',
            title: 'Configure VAS',
            stage: 'activation',
            segments: ['all'],
            userGoal: 'I need to set up value-added services for my business',
            painPoints: [
                'Limited service options',
                'Unclear pricing structure',
                'Complex configuration process'
            ],
            next: ['first-order']
        },
        {
            id: 'publish-product',
            title: 'Publish Product',
            stage: 'activation',
            segments: ['smb-unmanaged', 'smb-managed'],
            userGoal: 'I need to make my product live on my sales channels',
            painPoints: [
                'No context of shipping prices makes product pricing difficult',
                'Limited bulk publishing options',
                'No scheduling capabilities'
            ],
            next: ['first-order']
        },
        {
            id: 'first-order',
            title: 'First Order',
            stage: 'activation',
            segments: ['all'],
            userGoal: 'I need to successfully process my first customer order',
            painPoints: [
                'No order validation checks',
                'Limited order tracking',
                'Unclear fulfillment timeline'
            ],
            next: []
        },
        {
            id: 'integration-testing',
            title: 'Integration Testing',
            stage: 'conversion',
            segments: ['mid-market'],
            userGoal: 'I need to validate the technical setup and integration capabilities before committing to the platform',
            painPoints: [
                'Poor API documentation',
                'Need account setup to test',
                'No sandbox environment',
                'Limited testing tools'
            ],
            next: ['catalog-pricing']
        },
        {
            id: 'catalog-pricing',
            title: 'Catalog Pricing Setup',
            stage: 'activation',
            segments: ['mid-market'],
            userGoal: 'I need my agreed upon pricing setup so that I can start fulfilling orders with Gooten',
            painPoints: [
                'No easy way to monitor if negotiated prices are applying on orders',
                'Reliance on manual updates from Gooten Support',
                'No bulk pricing update capabilities',
                'Limited pricing validation tools'
            ],
            next: ['shipping-setup']
        },
        {
            id: 'shipping-setup',
            title: 'Shipping Setup',
            stage: 'activation',
            segments: ['mid-market'],
            userGoal: 'I need optimized shipping rates and configuration to maintain competitive delivery times',
            painPoints: [
                'Complex shipping rule setup',
                'Limited carrier integration options',
                'No automated rate optimization',
                'Difficult to manage multiple shipping zones'
            ],
            next: ['routing-setup']
        },
        {
            id: 'routing-setup',
            title: 'Routing Setup',
            stage: 'activation',
            segments: ['mid-market'],
            userGoal: 'I need my agreed upon vendor network routing rules to be implemented',
            painPoints: [
                'No transparency into how orders would be routed',
                'Only retrospective view of routing decisions',
                'Complex rule configuration',
                'Limited vendor performance metrics'
            ],
            next: ['credit-terms']
        },
        {
            id: 'credit-terms',
            title: 'Credit Terms Setup',
            stage: 'activation',
            segments: ['mid-market'],
            userGoal: 'I need my agreed upon credit terms to be implemented so I can start fulfilling orders with Gooten',
            painPoints: [
                'No transparency in the platform on credit terms status',
                'Manual credit limit adjustments',
                'Limited payment scheduling options',
                'No automated credit utilization reporting'
            ],
            next: ['first-order']
        }
    ]
}; 