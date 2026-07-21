import { useEffect, useState } from "react";

import ReportsFilters from "../Components/ReportsFilters";
import ReportsSummary from "../Components/ReportsSummary";
import ReportsChart from "../Components/ReportsChart";
import ReportsTable from "../Components/ReportsTable";
import ReportsExport from "../Components/ReportsExport";

import { getReportsTable } from "../services/reportsService";

function Reports() {

    const [reportData, setReportData] = useState([]);

    const [loading, setLoading] = useState(true);

    async function loadReports() {

        try {

            const data = await getReportsTable();

            setReportData(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadReports();

    }, []);

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

            <ReportsTable
                data={reportData}
                loading={loading}
            />

            <ReportsExport
                data={reportData}
            />

        </div>

    );

}

export default Reports;