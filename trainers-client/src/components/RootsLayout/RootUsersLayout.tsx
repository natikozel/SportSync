import React from "react";
import {Outlet} from "react-router-dom";

import UsersNavigation from "../Navigations/UsersNavigation";

export default function RootUsersLayout(): React.JSX.Element {
    return (
        <>
            <UsersNavigation/>
            <main>
                <Outlet/>
            </main>
        </>
    );
}