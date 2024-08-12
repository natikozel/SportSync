import React from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {RootState} from "../../store";
import {userActions} from "../../store/user-slice";

export default function MainNavigation(): React.JSX.Element {
    const userRole = useSelector((state: RootState) => state.user.role);
    const userEmail: any = useSelector((state: RootState) => state.user.email);
    const userSubmitted = useSelector((state: RootState) => state.user.submitted);
    const superapp: any = useSelector((state: RootState) => state.superapp.superapp);
    const superappSubmitted = useSelector((state: RootState) => state.superapp.submitted);
    const connectToSuperapp = superapp === '2024a.yarinmanoah';
    const condition: boolean = userRole === 'ADMIN';
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLogout() {
        dispatch(userActions.setEmail(null));
        dispatch(userActions.setRole(null));
        dispatch(userActions.setType(null));
        dispatch(userActions.setUserSuperapp(null));
        dispatch(userActions.setSubmitted(false));
        navigate('/superapp/users/login');
    }

    return (
        <header className="main-header">
            <nav>
                <ul className="main-list">
                    <li>
                        <NavLink
                            to={'/'}
                            className={({isActive}) => isActive ? "active" : undefined}
                            end={true}
                        >
                            Home
                        </NavLink>
                    </li>
                    {connectToSuperapp && superappSubmitted && (
                        <li>
                            <NavLink
                                to={userSubmitted ? `/superapp/users/login/${superapp}/${userEmail}` : `/superapp/users/login`}
                                className={({isActive}) => isActive ? "active" : undefined}
                            >
                                Trainees - MiniApp
                            </NavLink>
                        </li>)
                    }
                    {condition && (
                        <li>
                            <NavLink
                                to={'/superapp/admin'}
                                className={({isActive}) => isActive ? "active" : undefined}
                            >
                                Admin
                            </NavLink>
                        </li>)
                    }
                    {/*<li>*/}
                    {/*    <NavLink*/}
                    {/*        to={'/superapp/objects'}*/}
                    {/*        className={({isActive}) => isActive ? "active" : undefined}*/}
                    {/*    >*/}
                    {/*        Objects*/}
                    {/*    </NavLink>*/}
                    {/*</li>*/}
                    {/*<li>*/}
                    {/*    <NavLink*/}
                    {/*        to={'/superapp/miniapp'}*/}
                    {/*        className={({isActive}) => isActive ? "active" : undefined}*/}
                    {/*    >*/}
                    {/*        Command*/}
                    {/*    </NavLink>*/}
                    {/*</li>*/}
                </ul>
            </nav>
            {connectToSuperapp && superappSubmitted && (
                <nav className="component-list">
                    {!userSubmitted ? (<NavLink to={'/superapp/users/login'}>Sign in</NavLink>) : (
                        <div className="actions">
                            <button onClick={handleLogout}>Sign out</button>
                        </div>)}
                </nav>)
            }
        </header>
    );
}
