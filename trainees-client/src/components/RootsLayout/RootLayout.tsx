import React from "react";
import {Outlet} from "react-router-dom";

import MainNavigation from "../Navigations/MainNavigation";

export default function RootLayout(): React.JSX.Element {

    return (
        <>
            <MainNavigation />
            <main>
                <Outlet/>
            </main>
        </>
    );
}