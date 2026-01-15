import React from 'react'
import dayjs from "dayjs";

function Day() {
    const start = dayjs("2026-01-01 10:00:00");
    const end = dayjs("2026-01-01 10:00:00");
    return (
        <div>

            
            <h1>Start: {start.format("YYYY-MM-DD HH:mm:ss")}</h1>
            <h1>to: {start.format("YYYY-MM-DD HH:mm:ss")}</h1>
        </div>
    )
}

export default Day
