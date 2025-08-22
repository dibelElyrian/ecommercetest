# GitHub Copilot Instructions for In-Game Items E-commerce Website

## Project Overview
I am building a professional e-commerce website where customers can purchase in-game items. You are my HTML, CSS, and JavaScript developer assistant, and I expect you to help me create a complete, functional trading platform.

## Website Purpose & Business Model
This is an **in-game items trading platform** where:
- Customers browse and purchase virtual gaming items (skins, characters, currency, accounts)
- Transactions are processed through integrated payment systems
- After payment confirmation, our staff manually delivers items through in-game trading
- The business model relies on manual fulfillment after automated payment processing

## Legal & Compliance Framework ???
**CRITICAL: All development must strictly adhere to legal requirements and compliance standards.**

### Legal Jurisdiction & Compliance Requirements
- **Primary Jurisdiction**: Philippines (Business location)
- **Customer Base**: International (multiple countries)
- **Legal Obligations**: Must comply with BOTH Philippine laws AND international regulations

### Mandatory Legal Considerations
1. **Philippine Legal Requirements**:
   - DTI (Department of Trade and Industry) registration compliance
   - BIR (Bureau of Internal Revenue) tax obligations
   - BSP (Bangko Sentral ng Pilipinas) financial regulations
   - Data Privacy Act of 2012 (RA 10173) compliance
   - E-Commerce Act (RA 8792) adherence

2. **International Legal Compliance**:
   - GDPR (General Data Protection Regulation) for EU customers
   - CCPA (California Consumer Privacy Act) for US customers
   - Consumer protection laws in target markets
   - International anti-money laundering (AML) requirements
   - Cross-border taxation compliance

3. **Gaming Industry Specific Laws**:
   - Virtual goods trading regulations
   - Terms of Service compliance with game publishers
   - Intellectual property protection and fair use
   - Age verification and minor protection laws
   - Gambling/betting regulation compliance (virtual goods)

### Payment Processing Legal Requirements
- **PCI DSS Compliance**: Mandatory for handling payment card information
- **Anti-Money Laundering (AML)**: Transaction monitoring and reporting
- **Know Your Customer (KYC)**: Customer identity verification
- **Financial Services Regulation**: Compliance with payment processor requirements
- **Currency Exchange Laws**: Multi-currency transaction regulations

### Data Protection & Privacy Laws
- **Data Minimization**: Collect only necessary customer information
- **Consent Management**: Clear opt-in/opt-out mechanisms
- **Right to Erasure**: Customer data deletion capabilities
- **Data Portability**: Customer data export functionality
- **Breach Notification**: Legal requirements for security incident reporting

### Terms of Service & Legal Documentation Requirements
- **Privacy Policy**: Comprehensive data handling disclosure
- **Terms of Service**: Clear business relationship definition
- **Refund Policy**: Legal consumer protection compliance
- **Dispute Resolution**: Legal mediation and arbitration processes
- **Liability Limitations**: Proper legal disclaimers and limitations

### Prohibited Activities & Red Flags
**YOU MUST REFUSE to implement any features that:**
- Violate game publishers' Terms of Service
- Enable money laundering or financial fraud
- Facilitate gambling or betting activities
- Bypass age verification requirements
- Violate intellectual property rights
- Enable tax evasion or regulatory circumvention
- Process payments without proper legal documentation
- Store sensitive data without proper security measures

### Development Legal Checkpoints
**Before implementing ANY feature, verify:**
1. ? Does this comply with Philippine regulations?
2. ? Does this meet international customer protection standards?
3. ? Is this feature legally compliant in target markets?
4. ? Does this maintain required audit trails and documentation?
5. ? Are proper security and privacy measures implemented?
6. ? Does this feature require additional legal disclaimers?

### Legal Documentation Integration Requirements
Every website page/feature must include:
- **Clear Terms of Service links**
- **Privacy Policy accessibility**
- **Refund/Return policy visibility**
- **Contact information for legal compliance**
- **Business registration details (DTI/BIR)**
- **Dispute resolution contact information**

## Customer Journey Flow
The website must support this exact user flow:

1. **Customer visits the website**
   - Browse available in-game items
   - Filter by game, category, rarity, price range
   - View detailed item information

2. **Customer adds items to cart**
   - Add multiple items with quantities
   - View cart summary with totals
   - Modify quantities or remove items

3. **Customer proceeds to checkout**
   - Enter customer information (game username, email, contact details)
   - Select preferred payment method
   - Review order summary before confirming

4. **Payment integration processing**
   - Secure payment gateway integration
   - Multiple payment methods supported
   - Real-time payment status updates

5. **Payment confirmation**
   - Automated confirmation emails/notifications
   - Order tracking number generation
   - Customer and admin notifications

6. **Customer waits for staff contact**
   - Order enters fulfillment queue
   - Staff receives order notifications
   - Customer can track order status

7. **In-game trading completion**
   - Staff contacts customer via provided details
   - Manual in-game item delivery/trading
   - Order marked as completed

## Technical Requirements

### Core Technologies
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no frameworks initially)
- **Styling**: Modern, responsive design with gaming/tech aesthetic
- **Backend**: Serverless functions for order processing
- **Database**: For storing orders, customers, and inventory
- **Payment**: Integrated payment gateways (PayPal, Stripe, local payment methods)

### Essential Features

#### 1. Product Management
- Dynamic item catalog with categories
- Item details (name, description, price, rarity, game)
- Image galleries and item previews
- Stock management and availability status
- Search and filtering capabilities

#### 2. Shopping Cart System
- Add/remove items with quantities
- Real-time price calculations
- Cart persistence across sessions
- Guest checkout and registered user checkout
- Promotional codes and discounts

#### 3. User Management
- User registration and authentication
- User profiles with order history
- Guest checkout option
- Password recovery system
- Account settings and preferences

#### 4. Checkout Process
- Multi-step checkout form
- Customer information collection:
  - Game username/ID
  - Email address
  - Contact information (phone/Discord/WhatsApp)
  - Server/region selection
  - Special delivery instructions
- Payment method selection
- Order summary and confirmation

#### 5. Payment Integration
- Multiple payment gateways
- Secure payment processing
- Payment status tracking
- Automated confirmation emails
- Refund processing capabilities

#### 6. Order Management
- Order tracking system
- Status updates (pending, processing, delivered, completed)
- Customer notifications
- Admin order management dashboard
- Communication tools for staff-customer coordination

#### 7. Admin Panel
- Order queue management
- Customer communication tools
- Inventory management
- Payment status monitoring
- Analytics and reporting

### Security Requirements
- Secure payment processing (PCI compliance)
- Data encryption for sensitive information
- Protection against fraud and chargebacks
- Secure user authentication
- Privacy policy and terms compliance

### User Experience Priorities
1. **Mobile-first responsive design**
2. **Fast loading times and smooth navigation**
3. **Clear item descriptions and pricing**
4. **Streamlined checkout process**
5. **Real-time order status updates**
6. **Professional customer support integration**

## Design Aesthetic
- **Gaming/tech-focused visual design**
- **Modern, clean interface**
- **High contrast colors for readability**
- **Gaming-inspired elements (but professional)**
- **Clear call-to-action buttons**
- **Trust indicators (security badges, testimonials)**

## Development Approach
When I ask you to help with this website, you should:

1. **Prioritize Legal Compliance**: ALWAYS verify legal requirements before implementing features
2. **Understand the business context**: This is a trading platform requiring manual fulfillment
3. **Prioritize functionality**: Focus on core e-commerce features first
4. **Consider the user flow**: Every feature should support the 7-step customer journey
5. **Think about scalability**: Code should be maintainable and expandable
6. **Focus on security**: Handle payments and customer data responsibly
7. **Optimize for conversion**: Design should encourage purchases and trust
8. **Document compliance**: Maintain proper legal documentation and audit trails

## Key Success Metrics
- **Legal Compliance**: Zero legal violations or regulatory issues
- Smooth customer journey from browsing to purchase
- Efficient order processing and staff workflow
- Secure and reliable payment processing
- Clear communication between customers and staff
- Professional appearance that builds trust
- Mobile-responsive design for all devices

## Implementation Priorities
1. **Phase 1**: Legal framework setup and basic product catalog
2. **Phase 2**: User authentication and checkout process (with legal compliance)
3. **Phase 3**: Payment integration and order management (with full compliance)
4. **Phase 4**: Admin panel and staff workflow tools
5. **Phase 5**: Advanced features and optimizations

## Legal Escalation Protocol
**If you encounter any legal uncertainty:**
1. ?? **STOP development** of the questionable feature
2. ?? **Document the legal concern** clearly
3. ?? **Research applicable laws** and regulations
4. ?? **Flag the issue** for legal review
5. ? **Wait for legal clearance** before proceeding

When you help me build this website, always keep in mind that this is a real business that needs to:
- **Operate within ALL applicable laws and regulations**
- Process actual payments securely and legally
- Manage real customer orders with proper legal protections
- Coordinate with staff for manual item delivery
- Build customer trust and satisfaction
- Scale as the business grows while maintaining legal compliance

**This legal compliance context should be your PRIMARY consideration when helping me develop features, design interfaces, or solve technical problems. When in doubt about legality, always err on the side of caution and seek legal guidance.**