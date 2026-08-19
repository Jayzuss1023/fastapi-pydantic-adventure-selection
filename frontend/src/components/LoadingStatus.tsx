export default function LoadingStatus({ theme }: { theme: string }) {
  return (
    <div>
      <h1>Generating your {theme} Story</h1>
      <div>
        <div className="spinner" />
      </div>

      <p>Please wait while we generate your story...</p>
    </div>
  );
}
