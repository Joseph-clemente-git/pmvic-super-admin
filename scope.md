US-01 – PMVIC Admin Balance Management
As a PMVIC Admin,
I want to view my organization's current balance and credit/debit transactions,
so that I can monitor the organization's available balance and financial activity.
Subtasks
Design Balance Management interface
Display current balance
Display available credit/balance information
Display debit and credit adjustments
Implement balance computation
Display transaction history
Implement balance validation
Perform functional testing
Acceptance Criteria
PMVIC Admin can view the organization's current balance.
The system displays applicable credit and debit transactions.
Balance is automatically updated when a credit or debit transaction is processed.
PMVIC Admin can view the transaction history.
Transaction history includes date, transaction type, amount, and resulting balance.
The displayed balance is consistent with the organization's balance record.
US-02 – SuperAdmin Balance Monitoring Dashboard
As a SuperAdmin,
I want to view the balance status of all organizations,
so that I can monitor their financial position and identify organizations with outstanding balances.
Subtasks
Design SuperAdmin Dashboard
Display organization list
Display organization balance
Display credit/debit status
Display outstanding balance
Implement balance filtering
Implement organization search
Implement dashboard data synchronization
Perform functional testing
Acceptance Criteria
SuperAdmin can view all registered organizations.
Dashboard displays the current balance of each organization.
Dashboard displays outstanding balance information.
SuperAdmin can search and filter organizations.
Balance information automatically reflects processed transactions.
Dashboard data is consistent with the organization's balance records.
US-03 – Organization Management
As a SuperAdmin,
I want to manage organizations and their associated branches,
so that organization information and structure remain accurate in the system.
Subtasks
Create Organization Management interface
Add organization
Update organization information
View organization details
Manage organization status
Manage branch information
Link organization to applicable accounts
Implement organization validation
Perform functional testing
Acceptance Criteria
SuperAdmin can view registered organizations.
SuperAdmin can create an organization.
SuperAdmin can update organization information.
SuperAdmin can manage applicable branches.
Each organization is uniquely identifiable.
Organization information is reflected in the associated organization system.
Only authorized SuperAdmin users can modify organization information.
US-04 – User and Access Management
As a SuperAdmin,
I want to manage organization users, administrators, and invitations,
so that users have the appropriate access to the system.
Subtasks
Create User Management interface
Display organization users
Display Organization Admin accounts
Display Branch Admin accounts
Invite User
Assign user to organization/branch
Manage user roles
Activate/Deactivate user
Implement access validation
Perform functional testing
Acceptance Criteria
SuperAdmin can view organization users.
SuperAdmin can view assigned Organization Admin and Branch Admin accounts.
SuperAdmin can invite new users.
Invited users are associated with the appropriate organization or branch.
SuperAdmin can assign the appropriate role to a user.
User access is based on the assigned role and organization.
SuperAdmin can activate or deactivate applicable accounts.
US-05 – Outstanding Balance Management
As a SuperAdmin,
I want to monitor outstanding balances and determine whether an organization has a remittance obligation,
so that I can properly manage organizations with unpaid or outstanding amounts.
Subtasks
Create Outstanding Balance interface
Display outstanding balance
Calculate outstanding amount
Implement "Is Remit?" determination
Display remittance status
Implement balance validation
Link outstanding balance to transactions
Perform functional testing
Acceptance Criteria
SuperAdmin can view the outstanding balance of an organization.
The system calculates the outstanding amount based on applicable transactions.
The system determines whether the organization requires remittance.
Remittance status is clearly displayed.
Outstanding balance is updated when related transactions are processed.
The outstanding balance is consistent with the organization's transaction records.
US-06 – Remittance Management
As a SuperAdmin,
I want to view organizations with outstanding balances and tag their remittance status, so that I can identify which organizations have already remitted and which are still pending.
Subtasks
Perform functional testing.
Display remittance date and tagged-by user.
Update remittance status in the organization record.
Add Remove Remittance Tag action (if permitted).
Add Tag as Remitted action.
Display remittance status/tag.
Display outstanding balance per organization.
Create Outstanding Balance screen.
Acceptance Criteria
Tagging a remittance does not modify the organization's balance; it only updates the remittance status.
SuperAdmin can filter organizations by Pending or Remitted status.
Tagged organizations are reflected as Remitted in the Outstanding Balance list.
The system records the remittance date and the SuperAdmin who applied the tag.
SuperAdmin can tag an organization as Remitted.
The system displays the current Remittance Status (Pending or Remitted).
SuperAdmin can view the outstanding balance of each organization.
US-07 – Transaction History and Balance Processing
As a SuperAdmin,
I want all credit and debit transactions to be automatically processed and recorded,
so that organization balances and transaction records remain accurate.
Subtasks
Develop Debit/Credit Processing API
Implement credit transaction processing
Implement debit transaction processing
Implement automatic balance calculation
Store balance transactions
Develop transaction history
Implement transaction validation
Integrate with existing Organization System
Implement transaction error handling
Perform integration testing
Acceptance Criteria
The system can process credit transactions.
The system can process debit transactions.
Each processed transaction automatically updates the organization's balance.
Each transaction is recorded in the transaction history.
Transaction records contain the required transaction details.
The system prevents invalid transactions from being posted.
The balance and transaction history remain synchronized.
The Function/Trigger API correctly communicates the balance update to the applicable system.
US-08 – Recurring Daily Report and Notifications
As a SuperAdmin,
I want the system to automatically generate recurring daily balance reports and send notifications,
so that I can regularly monitor organization balances and daily financial activity.
Subtasks
Design Daily Report
Define daily report data
Implement recurring schedule
Develop Time Trigger API
Generate daily balance report
Generate daily earned report
Implement email notification
Implement recurring event processing
Implement report approval, if required
Perform automation testing
Acceptance Criteria
The system automatically generates the configured daily report.
The report includes the required organization balance and transaction information.
The recurring process executes based on the configured schedule.
The system generates the daily earned report.
The daily report is sent to the configured recipients through email.
The system records the execution of the recurring process.
Failed report generation or notification attempts are logged.
The report data reflects the latest available transaction and balance information.
US-09 – Authentication and Account Recovery
As a system user,
I want to securely log in, recover my password, and receive an invitation when added to the system,
so that I can securely access my authorized functions.
Subtasks
Implement Login
Implement user authentication
Implement Forgot Password
Implement Password Reset
Implement Invite User
Implement invitation acceptance
Implement role-based access
Implement session management
Perform security and functional testing
Acceptance Criteria
Registered users can securely log in.
Users can request a password reset through Forgot Password.
The system provides the appropriate password recovery mechanism.
Invited users can accept their invitation and activate their account.
Users can only access functions authorized for their assigned role.
Unauthorized users cannot access restricted SuperAdmin or organization functions.
Login and account recovery actions are properly validated.