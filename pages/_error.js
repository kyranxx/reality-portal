import React from 'react';
import Link from 'next/link';

/**
 * Custom error page that works with both client and server-side errors
 */
function Error({ statusCode, title, message }) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {title || (statusCode ? `Error ${statusCode}` : 'An error occurred')}
        </h1>
        <p className="text-gray-600 mb-8">
          {message || (statusCode
            ? `A server-side error occurred.`
            : 'A client-side error occurred.')}
        </p>
        <Link href="/">
          <a className="btn btn-primary py-2.5 px-6 inline-block">
            Go back home
          </a>
        </Link>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { 
    statusCode,
    title: err?.title || undefined,
    message: err?.message || undefined
  };
};

export default Error;
