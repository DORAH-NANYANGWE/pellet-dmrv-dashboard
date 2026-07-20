import ReportsFilters from "../Components/ReportsFilters";
import ReportsSummary from "../Components/ReportsSummary";
import ReportsChart from "../Components/ReportsChart";
import ReportsTable from "../Components/ReportsTable";
import ReportsExport from "../Components/ReportsExport";

function Reports() {

    return (

        <div
            style={{
                padding: "30px",
                color: "white",
                display: "flex",
                flexDirection: "column",
                gap: "30px"
            }}
        >

            <div>

                <h1
                    style={{
                        marginBottom: "8px"
                    }}
                >
                    Reports
                </h1>

                <p
                    style={{
                        color: "#94a3b8"
                    }}
                >
                    Generate fleet reports, analyse stove performance and export project data.
                </p>

            </div>

            <ReportsFilters />

            <ReportsSummary />

            <ReportsChart />

            <ReportsTable />

            <ReportsExport />

        </div>

    );

}

export default Reports;