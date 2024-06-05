# Autoworx

A web based software for managing car repair shops.

## Technologies

- Next.js (frontend + backend)
- NextAuth (authentication)
- Tailwind CSS
- Prisma (ORM)
- MySQL (database)
- Zustand (state management)
- Pusher (real-time chat)
- Radix-UI (design system)
- react-icons (icons)

## Pages

### Not started

- `/` - Dashboard
- `/analytics` - Analytics
- `/sales` - Creating and managing sales
- `/settings` - Settings

### Not updated

- `/customer` - Creating and managing customers
- `/employee` - Creating and managing employees

### Work in progress

- `/estimate` - Creating and managing estimates and invoices
- `/inventory` - Creating and managing inventory

### Done for now

- `/(auth)` - Authentication
- `/communication` - Communication page
- `/task` - Creating and managing tasks

## Database

You can find more details about the database in the `prisma/schema.prisma` file.

Here is a brief overview of some of the main tables:

### User

- **Purpose**: Represents an individual who can be an employee or admin of a company.
- **Key Fields**:
  - `name`: Name of the user.
  - `email`: Unique email address of the user.
  - `password`: User's password.
  - `role`: Role of the user (admin or employee).
  - `companyId`: ID of the company the user belongs to.
- **Relations**:
  - Belongs to a `Company`.
  - Can have multiple `tasks`, `appointments`, and `invoices`.

### Company

- **Purpose**: Represents a business entity.
- **Key Fields**:
  - `name`: Name of the company.
  - `createdAt`: Creation timestamp.
  - `updatedAt`: Last update timestamp.
- **Relations**:
  - Has many `users`, `tasks`, `customers`, `services`, `vehicles`, `invoices`, and more.

### Customer

- **Purpose**: Represents a customer of the company.
- **Key Fields**:
  - `firstName`: First name of the customer.
  - `lastName`: Last name of the customer.
  - `email`: Email address of the customer.
  - `phone`: Phone number of the customer.
  - `address`, `city`, `state`, `zip`: Address details.
  - `companyId`: ID of the company the customer is associated with.
- **Relations**:
  - Belongs to a `Company`.
  - Can have multiple `appointments`.

### Vehicle

- **Purpose**: Represents a vehicle associated with the company.
- **Key Fields**:
  - `year`: Year of the vehicle.
  - `make`: Make of the vehicle.
  - `model`: Model of the vehicle.
  - `transmission`, `engineSize`, `license`, `vin`: Vehicle specifications.
  - `companyId`: ID of the company the vehicle belongs to.
- **Relations**:
  - Belongs to a `Company`.
  - Can have multiple `appointments`.

### Invoice

- **Purpose**: Represents a financial document for billing purposes, either as an invoice or an estimate.
- **Key Fields**:
  - `type`: Type of the invoice (Invoice or Estimate).
  - `customerId`: ID of the customer.
  - `vehicleId`: ID of the vehicle.
  - `subtotal`, `discount`, `tax`, `grandTotal`: Financial details.
  - `statusId`: ID of the status.
  - `companyId`: ID of the company.
  - `userId`: ID of the user.
- **Relations**:
  - Belongs to a `Company`.
  - Belongs to a `User`.
  - Can have multiple `invoiceItems`, `payments`, `tasks`, and `photos`.

### Service

- **Purpose**: Represents a service provided by the company, which can be part of an invoice.
- **Key Fields**:
  - `name`: Name of the service.
  - `description`: Description of the service.
  - `categoryId`: ID of the category.
  - `companyId`: ID of the company.
- **Relations**:
  - Belongs to a `Company`.
  - Can belong to a `Category`.
  - Can have multiple `invoiceItems`.

### Material

- **Purpose**: Represents materials used in services or invoices.
- **Key Fields**:
  - `name`: Name of the material.
  - `vendorId`: ID of the vendor.
  - `categoryId`: ID of the category.
  - `quantity`, `cost`, `sell`, `discount`: Financial and inventory details.
  - `companyId`: ID of the company.
- **Relations**:
  - Belongs to a `Company`.
  - Can belong to a `Category` and a `Vendor`.
  - Can have multiple `invoiceItems`.

### Labor

- **Purpose**: Represents labor associated with an invoice.
- **Key Fields**:
  - `name`: Name of the labor.
  - `categoryId`: ID of the category.
  - `hours`, `charge`, `discount`: Labor details.
  - `companyId`: ID of the company.
- **Relations**:
  - Belongs to a `Company`.
  - Can belong to a `Category`.
  - Can have multiple `invoiceItems`.

### Payment

- **Purpose**: Represents a payment made for an invoice.
- **Key Fields**:
  - `date`: Date of the payment.
  - `notes`: Notes regarding the payment.
  - `type`: Type of the payment (CARD, CHECK, CASH, OTHER).
  - `invoiceId`: ID of the invoice.
- **Relations**:
  - Belongs to an `Invoice`.

### Task

- **Purpose**: Represents a task assigned within the company.
- **Key Fields**:
  - `title`: Title of the task.
  - `description`: Description of the task.
  - `date`: Date of the task.
  - `startTime`, `endTime`: Timing of the task.
  - `priority`: Priority of the task (Low, Medium, High).
  - `companyId`: ID of the company.
  - `userId`: ID of the user.
  - `invoiceId`: ID of the invoice.
- **Relations**:
  - Belongs to a `Company`.
  - Belongs to a `User`.
  - Can be linked to an `Invoice`.

### Appointment

- **Purpose**: Represents a scheduled appointment within the company.
- **Key Fields**:
  - `title`: Title of the appointment.
  - `date`: Date of the appointment.
  - `startTime`, `endTime`: Timing of the appointment.
  - `notes`: Notes regarding the appointment.
  - `companyId`: ID of the company.
  - `userId`: ID of the user.
  - `customerId`: ID of the customer.
  - `vehicleId`: ID of the vehicle.
  - `orderId`: ID of the order.
- **Relations**:
  - Belongs to a `Company`.
  - Belongs to a `User`.
  - Can have multiple `appointmentUsers`.

### Message

- **Purpose**: Represents a chat message.
- **Key Fields**:
  - `to`: ID of the recipient.
  - `from`: ID of the sender.
  - `message`: The message content.
  - `createdAt`: Timestamp of message creation.
  - `updatedAt`: Timestamp of message update.
- **Relations**:
  - None explicitly defined, but indexed for recipient and sender.
