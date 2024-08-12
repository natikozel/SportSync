import React from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {NavLink, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

import {queryClient, fetchUsers, deleteAllUsers} from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";

export interface User {
    userId: {
        email: string,
        superapp: string;
    }
    role: string;
    username: string;
    avatar: string;
}

export default function Users(): React.JSX.Element {
    const userEmail = useSelector((state: any) => state.user.email);
    const userRole = useSelector((state: any) => state.user.role);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);

    const navigate = useNavigate();

    const {data, isPending, isError, error} = useQuery({
        queryKey: ['users'],
        queryFn: ({signal}) => fetchUsers({
            signal, email: userEmail, userSuperapp: userSuperapp
        }),
        enabled: userRole === 'ADMIN'
    });

    const {
        mutate,
        isPending: isPendingDelete,
        isError: isErrorDelete,
        error: errorDelete
    } = useMutation({
        mutationFn: deleteAllUsers,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
                refetchType: "none"
            });
        }
    });

    let content;

    if (isPending || isPendingDelete) {
        content = <LoadingIndicator/>;
    }

    if (isError || isErrorDelete) {
        const errorMsg = isError ? error?.message : errorDelete?.message;
        content = (
            <ErrorBlock title="An error occurred" message={errorMsg}/>
        );
    }

    function handleDeleteUsers() {
        mutate({email: userEmail});
        navigate('/superapp/admin');
    }

    if (data && userRole === 'ADMIN') {
        content = (
            <div className="users">
                <h1>All Users</h1>
                {data.length > 0 ?
                    (<>
                        <button onClick={handleDeleteUsers}>Delete All Users</button>
                        <ul className="users-list">
                            {data.map((user: User) => (
                                <li key={user.userId.email} className="user-container">
                                    <NavLink to={`/superapp/users/login/${user.userId.superapp}/${user.userId.email}`}>
                                        <div className="user-content">
                                            <h2 className="title-color">E-Mail: <span
                                                className="category-value">{user.userId.email}</span></h2>
                                            <h2 className="title-color">User-Name: <span
                                                className="category-value">{user.username}</span>
                                            </h2>
                                        </div>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </>) :
                    <ErrorBlock
                        title="An error occurred"
                        message="There are no registered users in the system"
                    />
                }
            </div>
        );
    } else {
        content = (
            <div className="users">
                <ErrorBlock title="An error occurred" message={'Only admin users are allowed to access this command'}/>
            </div>
        );
    }

    return (
        <>
            {content}
        </>
    );
}