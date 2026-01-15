import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

function Chart1() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLabels, setShowLabels] = useState(true);


    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // 🔹 Search button handler
    const handleSearch = () => {
        if (!fromDate || !toDate) {
            alert("Please select both dates");
            return;
        }

        console.log("From:", fromDate, "To:", toDate);

        // 🔥 Example: API call / filter logic
        // fetch(`/api/data?from=${fromDate}&to=${toDate}`)
        //   .then(res => res.json())
        //   .then(data => console.log(data));
    };

    useEffect(() => {
        fetch("http://localhost:8000/freight-data")
            .then(res => res.json())
            .then(res => {
                setRows(res.rows || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading chart...</p>;
    if (!rows.length) return <p>No data available</p>;

    // Helper: parse month-year
    const parseMonthYear = (value) => {
        const [mon, yr] = value.split("-");
        const year = 2000 + Number(yr);
        const monthMap = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3,
            May: 4, Jun: 5, Jul: 6, Aug: 7,
            Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };
        return new Date(year, monthMap[mon], 1);
    };

    // Sorted months
    const months = [...new Set(rows.map(r => r.Month))]
        .sort((a, b) => parseMonthYear(a) - parseMonthYear(b));

    // Sum freight by type + month
    const sumByType = (type) =>
        months.map(month =>
            rows
                .filter(r => r.type === type && r.Month === month)
                .reduce((sum, r) => sum + Number(r.Fright || 0), 0) / 10000000 // ₹ → Cr
        );

    // Line helper
    const line = (name, values, color) => ({
        x: months.map(m =>
            parseMonthYear(m).toLocaleString("en", {
                month: "short",
                year: "numeric"
            })
        ),
        y: values,
        type: "scatter",
        mode: showLabels ? "lines+markers+text" : "lines+markers",
        name,
        text: showLabels ? values.map(v => v.toFixed(2)) : [],
        textposition: "top center",
        line: { color }
    });

    // Plot data
    const plotData = [
        line("BT", sumByType("BT"), "#1f77b4"),
        line("Fright", sumByType("Fright"), "#ff7f0e"),
        line("Handling", sumByType("Handling"), "#2ca02c"),
        line("OST", sumByType("OST"), "#d62728"),
        line("BMCO", sumByType("BMCO"), "#9467bd"),
        line("WF", sumByType("WF"), "#8c564b"),
        line("Hosur", sumByType("Hosur"), "#e377c2"),
        line("DLI", sumByType("DLI"), "#7f7f7f"),
        line("HDBMCO", sumByType("HDBMCO"), "#bcbd22"),
        line("HDWF", sumByType("HDWF"), "#17becf"),
        line("HDHosur", sumByType("HDHosur"), "#00aaff"),
    ];

    return (
        <div>

            <div style={{ padding: "20px" }}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Start Date: </label>
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>End Date: </label>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
                    />
                </div>

                <button onClick={handleSearch}>Search</button>
            </div>









            <div style={{ width: "100%", height: "60vh" }}>
                <Plot
                    data={plotData}
                    layout={{
                        title: "Rake Bill Details",
                        autosize: true,
                        xaxis: { title: "Month" },
                        yaxis: { title: "Freight (₹ Cr)" },
                        legend: { orientation: "h", y: 1.2 },
                        margin: { t: 80 }
                    }}
                    style={{ width: "100%", height: "100%" }}
                    useResizeHandler={true}
                />
            </div>
        </div>
    );
}

export default Chart1;



//
// import React, { useState } from "react";
// import Plot from "react-plotly.js";
//
// function ChartGraph() {
//     const [rows, setRows] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showLabels, setShowLabels] = useState(true);
//
//     // Controlled inputs
//     const [fromDate, setFromDate] = useState("");
//     const [toDate, setToDate] = useState("");
//
//     // Helper: parse month-year string like "Jan-25"
//     const parseMonthYear = (value) => {
//         const [mon, yr] = value.split("-");
//         const year = 2000 + Number(yr);
//         const monthMap = {
//             Jan: 0, Feb: 1, Mar: 2, Apr: 3,
//             May: 4, Jun: 5, Jul: 6, Aug: 7,
//             Sep: 8, Oct: 9, Nov: 10, Dec: 11
//         };
//         return new Date(year, monthMap[mon], 1);
//     };
//
//     // Fetch data with query params when Search is clicked
//     const handleSearch = () => {
//         if (!fromDate || !toDate) {
//             alert("Please select both dates");
//             return;
//         }
//
//         setLoading(true);
//
//         const queryString = `?fromDate=${encodeURIComponent(fromDate)}&toDate=${encodeURIComponent(toDate)}`;
//
//         fetch(`http://localhost:8000/freight-data${queryString}`)
//             .then(res => res.json())
//             .then(res => {
//                 setRows(res.rows || []);
//                 setLoading(false);
//             })
//             .catch(err => {
//                 console.error(err);
//                 setLoading(false);
//             });
//     };
//
//     if (loading) return <p>Loading chart...</p>;
//     if (!rows.length) return <p>No data available</p>;
//
//     // Sorted months from rows
//     const months = [...new Set(rows.map(r => r.Month))]
//         .sort((a, b) => parseMonthYear(a) - parseMonthYear(b));
//
//     // Sum freight by type + month
//     const sumByType = (type) =>
//         months.map(month =>
//             rows
//                 .filter(r => r.type === type && r.Month === month)
//                 .reduce((sum, r) => sum + Number(r.Fright || 0), 0) / 10000000 // ₹ → Cr
//         );
//
//     // Line helper
//     const line = (name, values, color) => ({
//         x: months.map(m =>
//             parseMonthYear(m).toLocaleString("en", {
//                 month: "short",
//                 year: "numeric"
//             })
//         ),
//         y: values,
//         type: "scatter",
//         mode: showLabels ? "lines+markers+text" : "lines+markers",
//         name,
//         text: showLabels ? values.map(v => v.toFixed(2)) : [],
//         textposition: "top center",
//         line: { color }
//     });
//
//     // Plot data
//     const plotData = [
//         line("BT", sumByType("BT"), "#1f77b4"),
//         line("Fright", sumByType("Fright"), "#ff7f0e"),
//         line("Handling", sumByType("Handling"), "#2ca02c"),
//         line("OST", sumByType("OST"), "#d62728"),
//         line("BMCO", sumByType("BMCO"), "#9467bd"),
//         line("WF", sumByType("WF"), "#8c564b"),
//         line("Hosur", sumByType("Hosur"), "#e377c2"),
//         line("DLI", sumByType("DLI"), "#7f7f7f"),
//         line("HDBMCO", sumByType("HDBMCO"), "#bcbd22"),
//         line("HDWF", sumByType("HDWF"), "#17becf"),
//         line("HDHosur", sumByType("HDHosur"), "#00aaff"),
//     ];
//
//     return (
//         <div>
//             {/* Date Filters */}
//             <div style={{ marginBottom: "20px" }}>
//                 <label>Start Date: </label>
//                 <input
//                     type="date"
//                     value={fromDate}
//                     onChange={(e) => setFromDate(e.target.value)}
//                 />
//                 <label style={{ marginLeft: "20px" }}>End Date: </label>
//                 <input
//                     type="date"
//                     value={toDate}
//                     onChange={(e) => setToDate(e.target.value)}
//                 />
//                 <button style={{ marginLeft: "20px" }} onClick={handleSearch}>
//                     Search
//                 </button>
//             </div>
//
//             {/* Chart */}
//             <div style={{ width: "100%", height: "60vh" }}>
//                 <Plot
//                     data={plotData}
//                     layout={{
//                         title: "Rake Bill Details (Filtered by Date Range)",
//                         autosize: true,
//                         xaxis: { title: "Month" },
//                         yaxis: { title: "Freight (₹ Cr)" },
//                         legend: { orientation: "h", y: 1.2 },
//                         margin: { t: 80 }
//                     }}
//                     style={{ width: "100%", height: "100%" }}
//                     useResizeHandler={true}
//                 />
//             </div>
//         </div>
//     );
// }
//
// export default ChartGraph;