import React from "react";

export default function LoadingIndicator(): React.JSX.Element {
    return (
        <div className="center-ring">
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>

    );
}