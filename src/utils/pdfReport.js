import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePDF(data) {

    const doc = new jsPDF();

    const now = new Date();

    // -------------------------
    // Statistics
    // -------------------------

    const temperatures = data.map(r => Number(r.temperature) || 0);
    const batteries = data.map(r => Number(r.battery_voltage) || 0);
    const signals = data.map(r => Number(r.signal_strength) || 0);

    const totalRecords = data.length;

    const highestTemp = Math.max(...temperatures);
    const lowestTemp = Math.min(...temperatures);

    const averageTemp =
        temperatures.reduce((a, b) => a + b, 0) /
        (temperatures.length || 1);

    const highestBattery = Math.max(...batteries);
    const lowestBattery = Math.min(...batteries);

    const averageSignal =
        signals.reduce((a, b) => a + b, 0) /
        (signals.length || 1);

    // -------------------------
    // PDF Metadata
    // -------------------------

    doc.setProperties({

        title: "Fleet Monitoring Report",

        author: "Pellet DMRV Platform",

        subject: "IoT Stove Monitoring",

        keywords: "DMRV, Biomass, Carbon Credits"

    });

    // -------------------------
    // Header
    // -------------------------

    doc.setFont("helvetica", "bold");

    doc.setFontSize(22);

    doc.text("Pellet DMRV Platform", 14, 20);

    doc.setFontSize(15);

    doc.text("Fleet Monitoring Report", 14, 30);

    doc.setDrawColor(22, 163, 74);

    doc.setLineWidth(0.8);

    doc.line(14, 36, 196, 36);

    doc.setFont("helvetica", "normal");

    doc.setFontSize(10);

    doc.text(
        `Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`,
        14,
        45
    );

    // -------------------------
    // Executive Summary
    // -------------------------

    doc.setFont("helvetica", "bold");

    doc.setFontSize(14);

    doc.text("Executive Summary", 14, 58);

    doc.setFont("helvetica", "normal");

    doc.setFontSize(10);

    let y = 68;

    const summary = [

        ["Telemetry Records", totalRecords],

        ["Highest Temperature", `${highestTemp.toFixed(1)} °C`],

        ["Lowest Temperature", `${lowestTemp.toFixed(1)} °C`],

        ["Average Temperature", `${averageTemp.toFixed(1)} °C`],

        ["Highest Battery", `${highestBattery.toFixed(2)} V`],

        ["Lowest Battery", `${lowestBattery.toFixed(2)} V`],

        ["Average Signal", `${averageSignal.toFixed(1)} dBm`]

    ];

    summary.forEach(item => {

        doc.setFont("helvetica", "bold");

        doc.text(item[0], 16, y);

        doc.setFont("helvetica", "normal");

        doc.text(String(item[1]), 85, y);

        y += 8;

    });

    // -------------------------
    // Table Title
    // -------------------------

    doc.setFont("helvetica", "bold");

    doc.setFontSize(14);

    doc.text("Telemetry Records", 14, y + 8);

    // -------------------------
    // Table
    // -------------------------

    autoTable(doc, {

        startY: y + 15,

        head: [[

            "Date",

            "Stove",

            "Device",

            "Temp",

            "Battery",

            "Signal",

            "Fan",

            "GPS",

            "Status"

        ]],

        body: data.map(row => [

            row.date,

            row.stove_code,

            row.device_code,

            `${row.temperature}°C`,

            `${row.battery_voltage}V`,

            `${row.signal_strength}`,

            row.fan_running ? "ON" : "OFF",

            row.gps_fix ? "FIX" : "NO FIX",

            row.status

        ]),

        theme: "striped",

        styles: {

            fontSize: 8,

            cellPadding: 3

        },

        headStyles: {

            fillColor: [22, 163, 74],

            textColor: 255,

            fontStyle: "bold"

        },

        alternateRowStyles: {

            fillColor: [245, 245, 245]

        }

    });

    // -------------------------
    // Footer
    // -------------------------

    const pages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pages; i++) {

        doc.setPage(i);

        doc.setDrawColor(180);

        doc.line(14, 285, 196, 285);

        doc.setFontSize(9);

        doc.text(

            "Pellet DMRV Platform",

            14,

            290

        );

        doc.text(

            "Confidential",

            105,

            290,

            {

                align: "center"

            }

        );

        doc.text(

            `Page ${i} of ${pages}`,

            196,

            290,

            {

                align: "right"

            }

        );

    }

    doc.save(

        `Fleet_Report_${now.toISOString().split("T")[0]}.pdf`

    );

}