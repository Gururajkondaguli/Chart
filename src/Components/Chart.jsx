import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import './Charts.css';
import * as XLSX from "xlsx";
 

function Chart() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [financialYears, setFinancialYears] = useState([]);
  // const [apiData, setApiData] = useState([]); 

  const [showLabels, setShowLabels] = useState(true);



  useEffect(() => {
    fetch("http://localhost:8000/freight-data")
      .then(res => res.json())
      .then(res => {
        console.log("API RESPONSE:", res);
        setRows(res.rows || []); // ✅ IMPORTANT
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (!rows.length) return <p>No data available</p>;


        function getFinancialYears(fromDate, toDate) {
        const fyList = [];

        let startYear = new Date(fromDate).getMonth() >= 3
          ? new Date(fromDate).getFullYear()
          : new Date(fromDate).getFullYear() - 1;

        let endYear = new Date(toDate).getMonth() >= 3
          ? new Date(toDate).getFullYear()
          : new Date(toDate).getFullYear() - 1;

        for (let year = startYear; year <= endYear; year++) {
          fyList.push(`FY ${year}-${String(year + 1).slice(2)}`);
        }

        return fyList;
      }
            const finalRows = financialYears.map(fy => {
              const match = apiData.find(item => item.financialYear === fy);

              return {
                financialYear: fy,
                amount: match ? match.amount : 0
              };
            });


      const handleSearch = () => {
      if (!fromDate || !toDate) {
        alert("Please select From and To dates");
        return;
      }

  // 1️⃣ Generate Financial Years
  const fyList = getFinancialYears(fromDate, toDate);

  // 2️⃣ Merge with backend data
  const finalRows = fyList.map(fy => {
    const match = apiData.find(item => item.financialYear === fy);

    return {
      financialYear: fy,
      amount: match ? match.amount : 0
    };
  });

  // 3️⃣ Update state ONCE
  setFinancialYears(finalRows);
};


  // -----------------------------
  // 1️⃣ Get unique months (sorted)
  // -----------------------------
//   const months = [...new Set(rows.map(r => r.Month))];


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


const months = [...new Set(rows.map(r => r.Month))]
  .sort((a, b) => parseMonthYear(a) - parseMonthYear(b));


  // -----------------------------
  // 2️⃣ Helper: Sum freight by type + month
  // -----------------------------
  const sumByType = (type) =>
    months.map(month =>
      rows
        .filter(r => r.type === type && r.Month === month)
        .reduce((sum, r) => sum + Number(r.Fright || 0), 0) / 10000000 // ₹ → Cr
    );

  // -----------------------------
  // 3️⃣ Plotly line helper
  // -----------------------------
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


  // -----------------------------
  // 4️⃣ Plotly data
  // -----------------------------
  const plotData = [
    line("BT", sumByType("BT"), "#1f77b4"),
    line("Fright", sumByType("Fright"), "#ff7f0e"),
    line("Handling", sumByType("Handling"), "#2ca02c"),
    line("OST", sumByType("OST"), "#d62728"),
    line("Handling", sumByType("Handling"), "#d62728"),
    line("BMCO",sumByType("BMCO"), "#9467bd"),
    line("WF", sumByType("WF"), "#8c564b"),
    line("Hosur",sumByType("Hosur"), "#e377c2"),
    line("DLI", sumByType("DLI"), "#7f7f7f"),
    line("HDBMCO", sumByType("HDBMCO"), "#bcbd22"),
    line("HDWF", sumByType("HDWF"), "#17becf"),
    line("HDHosur",sumByType("HDHosur"), "#00aaff"),
  ];


        // Download Excel sheet 
          const downloadExcel = () => {
          console.log("Download Excel button clicked");

          if (!rows.length) {
            alert("No data to download");
            return;
          }

          const worksheet = XLSX.utils.json_to_sheet(rows);
          const workbook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(workbook, worksheet, "Freight Data");
          XLSX.writeFile(workbook, "freight_data.xlsx");
        };


        //  Download CSV sheet 
          const downloadCSV = () => {
          console.log("Download CSV button clicked");

          if (!rows.length) {
            alert("No data to download");
            return;
          }

          const headers = Object.keys(rows[0]).join(",");
          const csvRows = rows.map(row =>
            Object.values(row).join(",")
          );

          const csvContent = [headers, ...csvRows].join("\n");

          const blob = new Blob([csvContent], { type: "text/csv" });
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = "freight_data.csv";
          a.click();

          URL.revokeObjectURL(url);
        };

  

  return (
    <div className="rake-container">
        <div className="header">
        <h2>RAKE BILL DETAILS</h2>
    </div>
 
   {/* 2. Filters */}
  <div className="filters">
    <div className="date-group">
      <div>
        <label>Start Date</label>
        <br></br>
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="Date"
        />
      </div>

      <div>
        <label>End Date</label>
        <br></br>
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="Date"
        />
      </div>
    </div>

    <div className="button-group">
      <button className="search" onClick={handleSearch}>Search</button>
        <button
        className="hide"
        onClick={() => setShowLabels(prev => !prev)}>
        {showLabels ? "Hide Number" : "Show Number"}
      </button>

      <button onClick={downloadExcel} className="search">Download Excel</button>
      <button onClick={downloadCSV} className="search">Download CSV</button>
    </div>
  </div>

  {/* 3. Table */}





  {/* 4. Chart */}
    {/* 1. Header */}

    <div style={{ width: "100%", height: "60vh" }} className="chart-section">
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

export default Chart;
