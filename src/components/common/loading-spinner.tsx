export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
