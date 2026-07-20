function ReportsFilters() {

    return (

        <div
            style={{
                background: "#1e293b",
                borderRadius: "12px",
                padding: "25px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "20px",
                alignItems: "end"
            }}
        >

            <div>

                <label
                    style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#94a3b8"
                    }}
                >
                    From Date
                </label>

                <input
                    type="date"
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#0f172a",
                        color: "white",
                        border: "1px solid #334155",
                        borderRadius: "8px"
                    }}
                />

            </div>

            <div>

                <label
                    style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#94a3b8"
                    }}
                >
                    To Date
                </label>

                <input
                    type="date"
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#0f172a",
                        color: "white",
                        border: "1px solid #334155",
                        borderRadius: "8px"
                    }}
                />

            </div>

            <div>

                <label
                    style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#94a3b8"
                    }}
                >
                    Province
                </label>

                <select
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#0f172a",
                        color: "white",
                        border: "1px solid #334155",
                        borderRadius: "8px"
                    }}
                >
                    <option>All Provinces</option>
                    <option>Lusaka</option>
                    <option>Copperbelt</option>
                    <option>Central</option>
                    <option>Eastern</option>
                    <option>Northern</option>
                    <option>Southern</option>
                    <option>Western</option>
                    <option>North-Western</option>
                    <option>Muchinga</option>
                    <option>Luapula</option>
                </select>

            </div>

            <div>

                <label
                    style={{
                        display: "block",
                        marginBottom: "8px",
                        color: "#94a3b8"
                    }}
                >
                    Device Status
                </label>

                <select
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#0f172a",
                        color: "white",
                        border: "1px solid #334155",
                        borderRadius: "8px"
                    }}
                >
                    <option>All</option>
                    <option>Online</option>
                    <option>Offline</option>
                </select>

            </div>

            <button
                style={{
                    padding: "12px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                Apply Filters
            </button>

            <button
                style={{
                    padding: "12px",
                    background: "#475569",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                Reset
            </button>

        </div>

    );

}

export default ReportsFilters;