"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <main>
      <h1>Error</h1>
      <p>{error.message}</p>
    </main>
  );
}
