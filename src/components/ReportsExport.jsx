import { generatePDF } from "../utils/pdfReport";

function ReportsExport({ data }) {

    function exportCSV() {

        if (!data.length) {

            alert("No report data available.");

            return;

        }

        const headers = [

            "Date",
            "Stove Code",
            "Device Code",
            "Temperature (°C)",
            "Battery (V)",
            "Signal (dBm)",
            "Fan",
            "GPS",
            "Status"

        ];

        const csvRows = data.map((row) => [

            row.date,
            row.stove_code,
            row.device_code,
            row.temperature,
            row.battery_voltage,
            row.signal_strength,
            row.fan_running ? "ON" : "OFF",
            row.gps_fix ? "FIX" : "NO FIX",
            row.status

        ]);

        const csvContent = [

            headers.join(","),

            ...csvRows.map((row) => row.join(","))

        ].join("\n");

        const blob = new Blob(

            [csvContent],

            {

                type: "text/csv;charset=utf-8;"

            }

        );

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        const today = new Date().toISOString().split("T")[0];

        link.download = `Fleet_Report_${today}.csv`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

    }

    function exportPDF() {

        generatePDF(data);

    }

    function printReport() {

        window.print();

    }

    return (

        <div
            style={{
                background: "#1e293b",
                borderRadius: "12px",
                padding: "25px"
            }}
        >

            <h2
                style={{
                    marginBottom: "20px",
                    color: "white"
                }}
            >
                Export Reports
            </h2>

            <p
                style={{
                    color: "#94a3b8",
                    marginBottom: "25px"
                }}
            >
                Export the current report for project managers,
                engineers, auditors and carbon credit verification.
            </p>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "15px"
                }}
            >

                <button
                    onClick={exportCSV}
                    style={buttonStyle("#16a34a")}
                >
                    📊 Export CSV
                </button>

                <button
                    onClick={exportPDF}
                    style={buttonStyle("#dc2626")}
                >
                    📄 Export PDF
                </button>

                <button
                    onClick={printReport}
                    style={buttonStyle("#2563eb")}
                >
                    🖨 Print Report
                </button>

            </div>

        </div>

    );

}

function buttonStyle(background) {

    return {

        padding: "12px 22px",
        background,
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"

    };

}

export default ReportsExport;