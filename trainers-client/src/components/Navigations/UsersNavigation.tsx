import React from "react";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";

import {RootState} from "../../store";

export default function UsersNavigation(): React.JSX.Element {
    const userSubmitted = useSelector((state: RootState) => state.user.submitted);
    const userEmail = useSelector((state: any) => state.user.email);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);

    return (
        <header className="component-header">
            <nav>
                <ul className="component-list">
                    {!userSubmitted && (
                        <li>
                            <NavLink
                                to={'/superapp/users'}
                                className={({isActive}) => isActive ? "active" : undefined}
                                end={true}
                            >
                                Create New User
                            </NavLink>
                        </li>)
                    }
                    {!userSubmitted ? (
                        <li>
                            <NavLink
                                to={'/superapp/users/login'}
                                className={({isActive}) => isActive ? "active" : undefined}
                                end={true}
                            >
                                Login
                            </NavLink>
                        </li>
                    ) : (
                        <li>
                            <NavLink
                                to={`/superapp/users/login/${userSuperapp}/${userEmail}`}
                                className={({isActive}) => isActive ? "active" : undefined}
                                end={true}
                            >
                                User Details
                            </NavLink>
                        </li>
                    )}
                    {userSubmitted && (
                        <li>
                            <NavLink
                                to={'/superapp/users/trainees'}
                                className={({isActive}) => isActive ? "active" : undefined}
                                end={true}
                            >
                                Trainees
                            </NavLink>
                        </li>)
                    }
                    {userSubmitted && (
                        <li>
                            <NavLink
                                to={'/superapp/users/requests/pending'}
                                className={({isActive}) => isActive ? "active" : undefined}
                                end={true}
                            >
                                Pending Requests
                            </NavLink>
                        </li>)
                    }
                    {userSubmitted && (
                        <li>
                            <NavLink
                                to={'/superapp/users/requests/accepted'}
                                className={({isActive}) => isActive ? "active" : undefined}
                                end={true}
                            >
                                Accepted Requests
                            </NavLink>
                        </li>)
                    }
                    {userSubmitted && (
                        <li>
                            <NavLink
                                to={'/superapp/users/reviews'}
                                className={({isActive}) => isActive ? "active" : undefined}
                                end={true}
                            >
                                Reviews
                            </NavLink>
                        </li>)
                    }
                </ul>
            </nav>
        </header>
    );
}