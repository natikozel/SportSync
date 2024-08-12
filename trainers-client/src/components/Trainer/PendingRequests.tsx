import React, {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {createNewCommand} from "../../util/http";
import ErrorBlock from "../UI/ErrorBlock";
import {RootState} from "../../store";
import {objectActions} from "../../store/object-slice";
import LoadingIndicator from "../UI/LoadingIndicator";

export interface RequestProps {
    objectId: {
        id: string
    }
    createdBy: {
        userId: {
            email: string
        }
    }
    objectDetails: {
        requestDetails: {
            desiredDate: string,
            desiredHour: string
        },
        isAccepted: string
    }
}

export interface MyErrorObj {
    message?: string,
    haveError: boolean
}

export const INITIAL_ERROR: MyErrorObj = {
    haveError: false
}

export default function PendingRequests(): React.JSX.Element {
    const dispatch = useDispatch();
    const [pendingRequests, setPendingRequests] = useState<any>();
    const [dataIsReady, setDataIsReady] = useState<boolean>(false);
    const [errorState, setErrorState] = useState<MyErrorObj>(INITIAL_ERROR);
    const userEmail: any = useSelector((state: RootState) => state.user.email);
    const userSuperapp: any = useSelector((state: RootState) => state.user.userSuperapp);
    const userType: any = useSelector((state: RootState) => state.user.type);
    let content;

    useEffect(() => {
        async function fetchPendingRequests() {
            setDataIsReady(false);
            try {
                const miniappName = 'Trainers';
                const commandData = {
                    command: 'getMyPendingRequests',
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
                setPendingRequests(resData);
                setDataIsReady(true);
            } catch (err: any) {
                setErrorState({
                    message: err.message || 'Failed to fetch pending requests.',
                    haveError: true
                });
            }
        }

        fetchPendingRequests();
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
                    message="Failed to fetch pending requests."/>
            </div>
        );
    }

    useEffect(() => {
        if (dataIsReady) {
            dispatch(objectActions.setRequestsData(pendingRequests));
        }
    }, [dataIsReady, dispatch, pendingRequests]);

    if (dataIsReady) {
        content = (
            <div className="users">
                <h1>My Pending Requests</h1>
                {pendingRequests.length > 0 ?
                    (<>
                        <ul className="users-list">
                            {pendingRequests.map((request: RequestProps) => (
                                <li key={request.objectId.id} className="user-container">
                                    <NavLink to={`/superapp/users/requests/details/${request.objectId.id}`}>
                                        <div className="user-content">
                                            <h2 className="title-color">Trainee E-Mail: <span
                                                className="category-value">{request.createdBy.userId.email}</span></h2>
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