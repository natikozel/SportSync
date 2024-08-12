import React from "react";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {queryClient, deleteAllUsers, deleteAllObjects, deleteAllCommands, removeFromLocalStorage} from "../../util/http";
import ErrorBlock from "../UI/ErrorBlock";
import {userActions} from "../../store/user-slice";
import {commandActions} from "../../store/command-slice";

export default function DataManagement(): React.JSX.Element {
    const dispatch = useDispatch();
    const userEmail = useSelector((state: any) => state.user.email);
    const userRole = useSelector((state: any) => state.user.role);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);
    const navigate = useNavigate();

    console.log(userRole)

    const {
        mutate: usersFunc,
    } = useMutation({
        mutationFn: deleteAllUsers,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
                refetchType: "none"
            });
        }
    });

    const {
        mutate: objectsFunc,
    } = useMutation({
        mutationFn: deleteAllObjects,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['objects'],
                refetchType: "none"
            });
        }
    });

    const {
        mutate: commandsFunc,
    } = useMutation({
        mutationFn: deleteAllCommands,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['commands'],
                refetchType: "none"
            });
        },

    });

    function handleDeleteUsers() {
        usersFunc({email: userEmail, userSuperapp: userSuperapp});
        removeFromLocalStorage();
        dispatch(userActions.setEmail(null));
        dispatch(userActions.setRole(null));
        navigate('/superapp/admin');
    }

    function handleDeleteObjects() {
        objectsFunc({email: userEmail, userSuperapp: userSuperapp});
        navigate('/superapp/admin');
    }

    function handleDeleteCommands() {
        commandsFunc({email: userEmail, userSuperapp: userSuperapp});
        dispatch(commandActions.setCommandData(null));
        navigate('/superapp/admin');
    }

    let content;

    if (userRole === 'ADMIN') {
        content = (
            <div className="users">
                <div>
                    <h2>Delete All Users</h2>
                    <button onClick={handleDeleteUsers}>Delete All Users</button>
                </div>
                <div>
                    <h2>Delete All Objects</h2>
                    <button onClick={handleDeleteObjects}>Delete All Objects</button>
                </div>
                <div>
                    <h2>Delete All Commands</h2>
                    <button onClick={handleDeleteCommands}>Delete All Commands</button>
                </div>
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