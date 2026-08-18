import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="app-container">
      <header>
        <h1>Interactive Story Generator</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
