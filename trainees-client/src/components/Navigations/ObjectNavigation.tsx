import React from "react";
import {NavLink} from "react-router-dom";

export default function ObjectNavigation(): React.JSX.Element {

    return (
        <header className="component-header">
            <nav>
                <ul className="component-list">
                    <li>
                        <NavLink
                            to={'/superapp/objects/create'}
                            className={({isActive}) => isActive ? "active" : undefined}
                            end={true}
                        >
                            Create Object
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={'/superapp/objects'}
                            className={({isActive}) => isActive ? "active" : undefined}
                            end={true}
                        >
                            All Objects
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={'/superapp/objects/search'}
                            className={({isActive}) => isActive ? "active" : undefined}
                            end={true}
                        >
                            Search Object
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}