import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

export function RouteErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "Try refreshing the page or heading back home.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText || "Route error"}`;
    if (typeof error.data === "string" && error.data.trim()) {
      message = error.data;
    }
  } else if (error instanceof Error && error.message.trim()) {
    message = error.message;
  }

  return (
    <main className="route-error" role="alert">
      <div className="route-error__panel">
        <p className="route-error__eyebrow">React app recovery</p>
        <h1 className="route-error__title">{title}</h1>
        <p className="route-error__message">{message}</p>
        <div className="route-error__actions">
          <Link className="route-error__link route-error__link--primary" to="/">
            Back Home
          </Link>
          <button
            className="route-error__link"
            onClick={() => window.location.reload()}
            type="button"
          >
            Reload
          </button>
        </div>
      </div>
    </main>
  );
}
