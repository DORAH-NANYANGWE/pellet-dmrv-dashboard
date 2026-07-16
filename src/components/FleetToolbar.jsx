function FleetToolbar({

    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    refresh,
    exportCSV,
    totalRows

}) {

    return (

        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px",
                marginBottom: "25px"
            }}
        >

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    flexWrap: "wrap",
                    flex: 1
                }}
            >

                <input

                    type="text"

                    placeholder="🔍 Search stove or device..."

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                    style={{

                        width: "320px",

                        padding: "12px",

                        background: "#0f172a",

                        color: "white",

                        border: "1px solid #334155",

                        borderRadius: "8px"

                    }}

                />

                <select

                    value={statusFilter}

                    onChange={(e)=>setStatusFilter(e.target.value)}

                    style={{

                        padding:"12px",

                        background:"#0f172a",

                        color:"white",

                        border:"1px solid #334155",

                        borderRadius:"8px"

                    }}

                >

                    <option>All</option>

                    <option>Online</option>

                    <option>Offline</option>

                </select>

            </div>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center"
                }}
            >

                <span
                    style={{
                        color:"#94a3b8",
                        fontSize:"13px"
                    }}
                >
                    {totalRows} devices
                </span>

                <button

                    onClick={refresh}

                    style={{

                        padding:"10px 18px",

                        background:"#2563eb",

                        color:"white",

                        border:"none",

                        borderRadius:"8px",

                        cursor:"pointer"

                    }}

                >

                    Refresh

                </button>

                <button

                    onClick={exportCSV}

                    style={{

                        padding:"10px 18px",

                        background:"#16a34a",

                        color:"white",

                        border:"none",

                        borderRadius:"8px",

                        cursor:"pointer"

                    }}

                >

                    Export CSV

                </button>

            </div>

        </div>

    );

}

export default FleetToolbar;