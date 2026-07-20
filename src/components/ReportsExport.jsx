function ReportsExport() {

    function exportCSV() {

        alert("CSV export will be connected to the backend.");

    }

    function exportPDF() {

        alert("PDF export will be connected to the backend.");

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
                Export the current report for project managers, engineers, auditors, and carbon credit verification.
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
                    style={{
                        padding: "12px 22px",
                        background: "#16a34a",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    📊 Export CSV
                </button>

                <button
                    onClick={exportPDF}
                    style={{
                        padding: "12px 22px",
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    📄 Export PDF
                </button>

                <button
                    onClick={printReport}
                    style={{
                        padding: "12px 22px",
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    🖨 Print Report
                </button>

            </div>

        </div>

    );

}

export default ReportsExport;