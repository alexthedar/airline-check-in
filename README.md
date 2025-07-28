# Airline Check-In Portal

This is an MVP of an Airline Check-In System built using Next.js, TypeScript, and Supabase. The application allows passengers to check in online before their flight, upload documents, and view their check-in status. Airline staff can see all passenger check-ins and update their status.

## Features

- **Passenger Check-In**: Passengers can enter their last name and confirmation number to check in and upload necessary documents.
- **Check-In Status**: Passengers can view their check-in status by entering their confirmation number.
- **Admin Dashboard**: Airline staff can log in using a secret key to view and update passenger check-in statuses.
- **Responsive Design**: The application is designed to be responsive and accessible on various devices.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Supabase**: An open-source Firebase alternative for backend services.
- **Tailwind CSS**: A utility-first CSS framework for styling.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- A Supabase account and project set up.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/airline-check-in.git
   cd airline-check-in
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ADMIN_SECRET_KEY=your-admin-secret-key
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

- **Passenger Check-In**: Navigate to the home page and fill out the check-in form with your last name and confirmation number. Upload any required documents and submit the form.
- **Check-In Status**: Go to the status page and enter your confirmation number to view your check-in status.
- **Admin Access**: Navigate to the admin page, enter the secret key, and log in to view and manage passenger check-ins.

### Process Queue

The process queue is a feature designed to handle asynchronous tasks related to passenger check-ins.

To manually trigger the processing of the job queue, use the following curl command:

```bash
curl -X GET http://localhost:3000/api/worker/process-queue \
  -H "Authorization: Bearer YOUR_SECRET_KEY_HERE"
```

### Expire Check-Ins

The expire check-ins feature is designed to automatically mark check-ins as expired after the travel date has passed.

To manually trigger the expiration of check-ins, use the following curl command:

```bash
curl -X GET http://localhost:3000/api/cron/expire-checkins \
  -H "Authorization: Bearer SUPER_SECRET_PASSWORD_123"
```
