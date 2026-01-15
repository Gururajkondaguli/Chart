import React from 'react'
import {useState} from "react";

function OnChange() {

    // 1. State to store the input value
    const [text, setText] = useState("");

    // 2. Handle Change: Updates state as you type
    function handleInputChange(event) {
        setText(event.target.value);
    }

    // 3. Handle Click: A specific action for the "Clear" button
    function handleClearClick() {
        setText(""); // Resets the state to an empty string
        alert("Input has been cleared!");
    }

    // 4. Handle Submit: Processes the whole form
    function handleFormSubmit(event) {
        event.preventDefault(); // STOPS page from reloading
        if (text === "") {
            alert("Please type something before submitting!");
        } else {
            alert("Form Submitted successfully with: " + text);
        }
    }
    return (
        <div style={{ padding: "40px", fontFamily: "Arial", textAlign: "center" }}>
            <h1>Event Demo 2026</h1>

            {/* FORM: Uses onSubmit */}
            <form onSubmit={handleFormSubmit} style={{ marginBottom: "20px" }}>

                <input
                    type="text"
                    value={text}
                    onChange={handleInputChange} // onChange here
                    placeholder="Enter your name..."
                    style={{
                        padding: "10px",
                        width: "250px",
                        borderRadius: "5px",
                        border: "2px solid #ccc",
                        backgroundColor: text.length > 5 ? "#e6fffa" : "white" // Inline CSS Logic
                    }}
                />

                <div style={{ marginTop: "15px" }}>
                    {/* Submit Button (triggers onSubmit of the form) */}
                    <button type="submit" style={{ padding: "10px 20px", marginRight: "10px", cursor: "pointer" }}>
                        Submit Form
                    </button>

                    {/* Regular Button: Uses onClick */}
                    <button type="button" onClick={handleClearClick} style={{ padding: "10px 20px", cursor: "pointer" }}>
                        Clear Input
                    </button>
                </div>
            </form>

            {/* Visual Feedback for onChange */}
            <p><strong>Live Typing Preview:</strong> {text}</p>
        </div>
    )
}

export default OnChange
