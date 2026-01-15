import React, { useState, useEffect, useRef } from "react";

/**
 * =========================================================
 * FILE NAME (in your real project):
 * ChartBuilderSinglePage.jsx
 *
 * This file combines:
 * - TimeRangePicker
 * - Apply button
 * - API fetch
 * - Chart render
 *
 * NO other files involved.
 * =========================================================
 */

export default function ChartBuilderSinglePage() {

    /* -------------------------------------------------------
     * 1️⃣ STATE: From & To dates (controlled by inputs)
     * ----------------------------------------------------- */
    const [from, setFrom] = useState("2024-01-01");
    const [to, setTo] = useState("2024-01-31");

    /* -------------------------------------------------------
     * 2️⃣ STATE: Data returned from API
     * ----------------------------------------------------- */
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    /* -------------------------------------------------------
     * 3️⃣ REF: Chart DOM container (Plotly)
     * ----------------------------------------------------- */
    const chartRef = useRef(null);

    /* -------------------------------------------------------
     * 4️⃣ FUNCTION: Called when APPLY button is clicked
     * THIS IS THE MOST IMPORTANT FUNCTION
     * ----------------------------------------------------- */
    const handleApply = async () => {
        setLoading(true);

        console.log("Apply clicked with:", from, to);

        /**
         * 🔥 BACKEND CALL (example)
         * In your real app this is:
         * datasetsAPI.previewWithDateFilter(...)
         */
        const response = await fetch(
            `/api/data?from=${from}&to=${to}`
        );

        const data = await response.json();

        setRows(data.rows);   // 🔥 This triggers re-render
        setLoading(false);
    };

    /* -------------------------------------------------------
     * 5️⃣ EFFECT: Render chart WHEN rows change
     * ----------------------------------------------------- */
    useEffect(() => {
        if (!rows.length || !window.Plotly) return;

        const x = rows.map(r => r.date);
        const y = rows.map(r => r.value);

        const trace = {
            type: "scatter",
            mode: "lines+markers",
            x,
            y,
            line: { color: "blue" }
        };

        const layout = {
            title: "Filtered Chart",
            xaxis: { title: "Date", type: "category" },
            yaxis: { title: "Value" }
        };

        window.Plotly.newPlot(chartRef.current, [trace], layout);

    }, [rows]); // 🔥 Runs ONLY after data changes

    /* -------------------------------------------------------
     * 6️⃣ UI
     * ----------------------------------------------------- */
    return (
        <div style={{ padding: 20 }}>

            <h2>Chart Builder (Single Page Demo)</h2>

            {/* ---------- DATE INPUTS ---------- */}
            <div style={{ marginBottom: 10 }}>
                <label>From: </label>
                <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                />
            </div>

            <div style={{ marginBottom: 10 }}>
                <label>To: </label>
                <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                />
            </div>

            {/* ---------- APPLY BUTTON ---------- */}
            <button onClick={handleApply}>
                Apply Time Range
            </button>

            {/* ---------- STATUS ---------- */}
            {loading && <p>Loading data...</p>}

            {/* ---------- CHART ---------- */}
            <div
                ref={chartRef}
                style={{ width: "100%", height: 400, marginTop: 20 }}
            />
        </div>
    );
}
