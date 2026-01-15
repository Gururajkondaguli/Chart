import React from 'react'
import {useState} from "react";

function Practice001() {

    const [name, setName] = useState("");

    // 'e' is the event object that contains the typed value
    const handleChange = (e) => {
        setName(e.target.value); // Updates the state with whatever the user types
    };


    return (
        <div>
            <input type="text" value={name} onChange={handleChange} />
            <p>You are typing: {name}</p>
        </div>
    )
}

export default Practice001
