import { DASHBOARD_PAGE_GRID } from "./DashboardLayout.constants.js";

function DashboardTopGrid({ children }) {
    return (
        <div
            style={{
                maxWidth: "1400px",
                margin: "0 auto",
                padding: "16px",          // page breathing space only

                display: "grid",
                gridTemplateColumns: DASHBOARD_PAGE_GRID,
                gap: "24px",
                alignItems: "stretch",
            }}
        >
            {children}
        </div>
    );
}

export default DashboardTopGrid;
