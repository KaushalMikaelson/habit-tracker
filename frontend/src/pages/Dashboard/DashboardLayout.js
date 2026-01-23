import { DASHBOARD_PAGE_GRID } from "./DashboardLayout.constants";

function DashboardLayout({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: DASHBOARD_PAGE_GRID,
        gap: "24px",
        padding: "24px",
        alignItems: "start",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

export default DashboardLayout;
