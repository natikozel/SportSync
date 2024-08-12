import React from "react";
import {NavLink, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useDispatch, useSelector} from "react-redux";

import {fetchObjectsBy} from "../../util/http";
import ErrorBlock from "../UI/ErrorBlock";
import LoadingIndicator from "../UI/LoadingIndicator";
import {objectActions} from "../../store/object-slice";

export interface Object {
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

export default function SearchingResults(): React.JSX.Element {
    const params = useParams();
    const dispatch = useDispatch();

    const superapp = useSelector((state: any) => state.superapp.superapp);
    const userEmail = useSelector((state: any) => state.user.email);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);
    const searchBy = useSelector((state: any) => state.search.searchBy);
    const searchValue = useSelector((state: any) => state.search.searchValue);

    const {data, isPending, isError, error, isSuccess} = useQuery({
        queryKey: ['objects', params.searchBy],
        queryFn: ({signal}) => fetchObjectsBy({
            signal, email: userEmail, searchBy: searchBy, searchValue: searchValue, userSuperapp: userSuperapp
        }),
    });

    if (isSuccess) {
        console.log(data)
        if (data?.length !== 0)
            dispatch(objectActions.setObjectData(data));
    }

    let content;

    if (isPending) {
        content = <LoadingIndicator/>;
    }

    if (isError) {
        content = (
            <ErrorBlock title="An error occurred" message={error.message}/>
        );
    }

    if (data) {
        console.log(data);
        content = (data.length > 0 ?
                (<>
                    <ul className="users-list">
                        {data.map((object: Object) => (
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