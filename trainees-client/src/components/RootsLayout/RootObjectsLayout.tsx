import React from "react";
import {Outlet} from "react-router-dom";

import ObjectNavigation from "../Navigations/ObjectNavigation";

export default function RootObjectsLayout(): React.JSX.Element {
    return (
        <>
            <ObjectNavigation />
            <main>
                <Outlet/>
            </main>
        </>
    );
}