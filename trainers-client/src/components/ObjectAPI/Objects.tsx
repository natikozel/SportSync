import React from "react";
import {NavLink} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useSelector} from "react-redux";

import {fetchObjects} from "../../util/http";
import ErrorBlock from "../UI/ErrorBlock";
import LoadingIndicator from "../UI/LoadingIndicator";

export interface MyObject {
    active: boolean;
    alias: string;
    createdBy: {
        userId: {
            email: string
            superapp: string
        }
    };
    creationTimestamp: string;
    objectDetails: {
        key1: string
        key2: string
        key3: string
        key4: string
    };
    objectId: {
        id: string,
        superapp: string
    };
    type: string;
}

export default function Objects(): React.JSX.Element {

    const superapp = useSelector((state: any) => state.superapp.superapp);
    const userEmail = useSelector((state: any) => state.user.email);
    const userRole = useSelector((state: any) => state.user.role);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);
    const condition = (userRole === 'SUPERAPP_USER');

    const {data, isPending, isError, error} = useQuery({
        queryKey: ['objects'],
        queryFn: ({signal}) => fetchObjects({
            signal, email: userEmail, userSuperapp: userSuperapp
        }),
        enabled: condition,
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
                        {data.map((object: MyObject) => (
                            <li key={object.objectId.id} className="user-container">
                                <NavLink to={`/superapp/objects/${superapp}/${object.objectId.id}`}>
                                    <div className="user-content">
                                        <h2 className="title-color">Object ID: <span
                                            className="category-value">{object.objectId.id}</span>
                                        </h2>
                                    </div>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </>) :
                <ErrorBlock
                    title="An error occurred"
                    message="No objects exist in the system"
                />
        );
    } else {
        content = (
            <div className="users">
                <ErrorBlock title="An error occurred"
                            message={'Only superApp users are allowed to access this command'}/>
            </div>
        );
    }

    return (
        <div className="users">
            <h1>Objects List</h1>
            {content}
        </div>
    );
}