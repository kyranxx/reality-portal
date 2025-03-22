import React from 'react';

function Error({ statusCode }) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {statusCode
            ? `Error ${statusCode}`
            : 'An error occurred on client'}
        </h1>
        <p className="text-gray-600 mb-8">
          {statusCode
            ? `A server-side error occurred.`
            : 'A client-side error occurred.'}
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="btn btn-primary py-2.5 px-6"
        >
          Go back home
        </button>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
