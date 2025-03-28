export default function Loading() {
  return (
    <div className="container py-8 flex justify-center items-center min-h-[50vh]">
      <div className="text-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Načítava sa...
          </span>
        </div>
        <p className="mt-4">Načítava sa...</p>
      </div>
    </div>
  );
}
