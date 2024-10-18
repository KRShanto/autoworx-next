import React from "react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-6 text-4xl font-bold text-blue-600">
        API Documentation
      </h1>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold text-blue-500">
          POST /api/auth/zap-login
        </h2>
        <p className="mb-2 text-gray-700">
          This endpoint authenticates Zapier into the software. It requires a
          security token.
        </p>
        <div className="rounded-md bg-white p-4 shadow-md">
          <h3 className="mb-2 text-xl font-semibold text-blue-500">Request</h3>
          <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-gray-800">
            <code>
              {`POST /api/auth/zap-login
Headers:
    Content-Type: application/json
    X-TOKEN: your-security-token
`}
            </code>
          </pre>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold text-blue-500">
          POST /api/zap-lead
        </h2>
        <p className="mb-2 text-gray-700">
          This endpoint saves leads coming from Zapier into the software.
        </p>
        <div className="rounded-md bg-white p-4 shadow-md">
          <h3 className="mb-2 text-xl font-semibold text-blue-500">Request</h3>
          <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-gray-800">
            <code>
              {`POST /api/zap-lead
Headers:
    Content-Type: application/json
    X-TOKEN: your-security-token

Body:
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "customer_country": "United States",
    "oppurtunity_source": "(Facebook) Car | Service"
}`}
            </code>
          </pre>
        </div>
      </section>
    </div>
  );
}
