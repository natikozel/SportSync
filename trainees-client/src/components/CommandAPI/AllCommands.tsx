import React from "react";
import {useQuery} from "@tanstack/react-query";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";

import ErrorBlock from "../UI/ErrorBlock";
import {fetchCommands} from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import SearchingBy from "../UI/SearchingBy";

export interface Command {
    commandId: {
        superApp: string,
        miniapp: string,
        id: string,
    },
    command: string,
    targetObject: {
        objectId: {
            superapp: string,
            id: string
        }
    },
    invocationTimestamp: string,
    invokedBy: {
        userId: {
            superapp: string,
            email: string
        }
    },
    commandAttributes: {
        key1: string
        key2: string
        key3: string
        key4: string
    }
}

export default function AllCommands(): React.JSX.Element {
    const userEmail = useSelector((state: any) => state.user.email);
    const userRole = useSelector((state: any) => state.user.role);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);
    const condition = userRole === 'ADMIN';

    const {data, isPending, isError, error} = useQuery({
        queryKey: ['commands'],
        queryFn: ({signal}) => fetchCommands({
            signal, email: userEmail, userSuperapp: userSuperapp
        }),
        enabled: userRole === 'ADMIN'
    });

    let content;

    if (isPending) {
        content = <LoadingIndicator/>;
    }

    if (isError) {
        content = (
            <ErrorBlock title="An error occurred" message={error.message}/>
        );
    }

    if (data && condition) {
        console.log(data);
        content = (data.length > 0 ?
                (<>
                    <ul className="users-list">
                        {data.map((command: Command) => (
                            <li key={command.commandId.id} className="user-container">
                                <NavLink to={`/superapp/admin/miniapp/${command.commandId.miniapp}`}>
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
    } else {
        content = (
            <div className="users">
                <ErrorBlock title="An error occurred" message={'Only admin users are allowed to access this command'}/>
            </div>
        );
    }

    return (
        <>
            {condition && (
                <>
                    <SearchingBy
                        title={'Search for a specific Mini-App'}
                        labelSearch={'MiniApp Name'}
                        idAndName={'miniApp'}
                        placeholder={'Enter MiniApp Name'}
                    />
                    <div className="users">
                        <h1>Commands List</h1>
                        {content}
                    </div>
                </>)
            }
            {!condition && (content)}
        </>
    );
}