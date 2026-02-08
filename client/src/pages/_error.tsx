import React from 'react';
import { NextPageContext } from 'next';
import Link from 'next/link';

interface ErrorProps {
  statusCode?: number;
}

function ErrorPage({ statusCode }: ErrorProps) {
  const code = statusCode || 500;
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center', padding: 32, maxWidth: 720 }}>
        <h1 style={{ fontSize: 48, margin: 0 }}>Something went wrong</h1>
        <p style={{ color: '#6b7280', marginTop: 12 }}>An unexpected error occurred (code: {code}).</p>
        <div style={{ marginTop: 20 }}>
          <Link href="/" style={{ padding: '10px 18px', background: '#f57c00', color: 'white', borderRadius: 8, textDecoration: 'none' }}>Go back home</Link>
        </div>
      </div>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;
  return { statusCode };
};

export default ErrorPage;
