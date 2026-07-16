function StatCard({ title, value, color }) {

    return (

        <div
            style={{
                flex: 1,
                minWidth: "180px",
                background: "#1e293b",
                padding: "20px",
                borderRadius: "12px",
                borderLeft: `5px solid ${color}`,
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
            }}
        >

            <div
                style={{
                    color: "#94a3b8",
                    fontSize: "13px"
                }}
            >
                {title}
            </div>

            <div
                style={{
                    color: "white",
                    fontSize: "30px",
                    fontWeight: "bold",
                    marginTop: "10px"
                }}
            >
                {value}
            </div>

        </div>

    );

}

export default StatCard;