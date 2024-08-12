import React from "react";

interface HeaderProps {
    children: React.ReactNode;
    title: string
}

export default function Header({children, title}: HeaderProps): React.JSX.Element {

    return (
        <>
            <header id="main-header">
                <div id="header-title">
                    <h1>{title}</h1>
                </div>
                <nav>{children}</nav>
            </header>
        </>
    );
}