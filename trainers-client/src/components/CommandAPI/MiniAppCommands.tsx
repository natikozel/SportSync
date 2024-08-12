import React from "react";
import {Link, NavLink, useParams} from 'react-router-dom';
import {useQuery} from "@tanstack/react-query";
import {useSelector} from "react-redux";

import {Command} from "./AllCommands";
import {fetchSpecificCommands} from "../../util/http";
import Header from "../UI/Header";
import ErrorBlock from "../UI/ErrorBlock";
import LoadingIndicator from "../UI/LoadingIndicator";

export default function MiniAppCommands(): React.JSX.Element {
    const params = useParams();
    const userEmail = useSelector((state: any) => state.user.email);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);

    const {data, isPending, isError} = useQuery({
        queryKey: ['commands', params.miniAppName],
        queryFn: ({signal}) => fetchSpecificCommands({
            signal, miniAppName: params.miniAppName, email: userEmail, userSuperapp: userSuperapp
        })
    });

    let content;

    if (isPending) {
        content = (
            <LoadingIndicator/>
        );
    }

    if (isError) {
        content = (
            <div className="error-container">
                <ErrorBlock
                    title="An error occurred"
                    message="The object does not exist in the system, please check the details you entered"/>
            </div>
        );
    }

    if (data) {
        console.log(data);
        content = content = (data.length > 0 ?
                (<>
                    <ul className="users-list">
                        <h2 className="center">Please click on a specific command to see her detail</h2>
                        {data.map((command: Command) => (
                            <li key={command.commandId.id} className="user-container">
                                <NavLink
                                    to={`/superapp/admin/miniapp/${command.commandId.miniapp}/${command.commandId.id}`}>
                                    <div className="user-content">
                                        <h2 className="title-color">Command ID: <span
                                            className="category-value">{command.commandId.id}</span></h2>
                                        <h2 className="title-color">MiniApp Name: <span
                                            className="category-value">{command.commandId.miniapp}</span>
                                        </h2>
                                    </div>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </>) :
                <ErrorBlock
                    title="An error occurred"
                    message="No commands exist in the system"
                />
        );
    }

    return (
        <>
            <Header title={`Commands of the MiniApp - ${params.miniAppName}`}>
                <Link to="/superapp/admin/miniapp" className="nav-item">
                    View all Commands
                </Link>
            </Header>
            <div className="users">
                {content}
            </div>
        </>
    );
}