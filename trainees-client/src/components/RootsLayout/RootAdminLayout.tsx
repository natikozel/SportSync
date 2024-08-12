import React from "react";
import {Outlet} from "react-router-dom";

import AdminNavigation from "../Navigations/AdminNavigation";

export default function RootAdminLayout(): React.JSX.Element {
    return (
        <>
            <AdminNavigation />
            <main>
                <Outlet/>
            </main>
        </>
    );
}