import React, {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {createNewCommand} from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import {objectActions} from "../../store/object-slice";

export interface MyErrorObj {
    message?: string,
    haveError: boolean
}

export const INITIAL_ERROR: MyErrorObj = {
    haveError: false
}

export default function RequestsList(): React.JSX.Element {
    const [myRequests, setMyRequests] = useState<any>();
    const [dataIsReady, setDataIsReady] = useState<boolean>(false);
    const [errorState, setErrorState] = useState<MyErrorObj>(INITIAL_ERROR);
    const dispatch = useDispatch();
    const userEmail = useSelector((state: any) => state.user.email);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);
    const userType = useSelector((state: any) => state.user.type);
    let content;

    useEffect(() => {
        async function fetchMyRequests() {
            setDataIsReady(false);
            try {
                const miniappName = 'Trainees';
                const commandData = {
                    command: 'getUserRequests',
                    targetObject: {
                        objectId: {
                            superapp: userSuperapp,
                            id: userType.objectId.id
                        }
                    },
                    invokedBy: {
                        userId: {
                            superapp: userSuperapp,
                            email: userEmail
                        }
                    },
                    commandAttributes: {
                        additionalProp1: {},
                        additionalProp2: {},
                        additionalProp3: {},
                    }
                }
                const resData = await createNewCommand({miniAppName: miniappName, commandData: commandData});
                setMyRequests(resData);
                setDataIsReady(true);
            } catch (err: any) {
                setErrorState({
                    message: err.message || 'Failed to fetch my requests.',
                    haveError: true
                });
            }
        }

        fetchMyRequests();
    }, [userEmail, userSuperapp, userType.objectId.id]);

    if (!dataIsReady) {
        content = (
            <LoadingIndicator/>
        );
    }

    if (errorState.haveError) {
        content = (
            <div className="error-container">
                <ErrorBlock
                    title="An error occurred"
                    message="Failed to fetch my requests."/>
            </div>
        );
    }

    useEffect(() => {
        if (dataIsReady) {
            dispatch(objectActions.setRequestsData(myRequests));
        }
    }, [dataIsReady, dispatch, myRequests]);

    if (dataIsReady) {
        content = (
            <div className="users">
                <h1>My Requests</h1>
                {myRequests.length > 0 ?
                    (<>
                        <ul className="users-list">
                            {myRequests.map((request: any) => (
                                <li key={request.objectId.id} className="user-container">
                                    <NavLink to={`/superapp/users/requests/requestDetail/${request.objectId.id}`}>
                                        <div className="user-content">
                                            <h2 className="title-color">Trainer E-Mail: <span
                                                className="category-value">{request.alias}</span></h2>
                                            <h2 className="title-color">Date: <span
                                                className="category-value">{request.objectDetails.requestDetails.desiredDate}</span>
                                            </h2>
                                            <h2 className="title-color">Hour: <span
                                                className="category-value">{request.objectDetails.requestDetails.desiredHour}</span>
                                            </h2>
                                            <h2 className="title-color">isAccepted: <span
                                                className="category-value">{request.objectDetails.isAccepted}</span>
                                            </h2>
                                        </div>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </>) :
                    <ErrorBlock
                        title="An error occurred"
                        message="No request was sent by the user"
                    />
                }
            </div>
        );
    }

    return (
        <>
            {content}
        </>
    );
}