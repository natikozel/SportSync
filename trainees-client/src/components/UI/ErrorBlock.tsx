import React from "react";

interface ErrorBlockProps {
    title: string,
    message: any
}

export default function ErrorBlock({title, message}: ErrorBlockProps) {
    return (
        <div className="error-block">
            <div className="error-block-icon">!</div>
            <div className="event-details-content">
                <h2>{title}</h2>
                <p>{message}</p>
            </div>
        </div>
    );
}