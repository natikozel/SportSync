import React from "react";
import {NavLink} from "react-router-dom";

export default function AdminNavigation(): React.JSX.Element {
    return (
        <header className="component-header">
            <nav>
                <ul className="component-list">
                    <li>
                        <NavLink
                            to={'/superapp/admin/users'}
                            className={({isActive}) => isActive ? "active" : undefined}
                            end={true}
                        >
                            All Users
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={'/superapp/admin/miniapp'}
                            className={({isActive}) => isActive ? "active" : undefined}
                            end={true}
                        >
                            All Commands
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={'/superapp/admin/deletion'}
                            className={({isActive}) => isActive ? "active" : undefined}
                            end={true}
                        >
                            Data Management
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
