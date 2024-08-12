import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";

import {RequestProps, MyErrorObj, INITIAL_ERROR} from "./PendingRequests";
import {createNewCommand} from "../../util/http";
import ErrorBlock from "../UI/ErrorBlock";
import {RootState} from "../../store";
import LoadingIndicator from "../UI/LoadingIndicator";

export default function AcceptedRequests(): React.JSX.Element {
    const [acceptedRequests, setAcceptedRequests] = useState<any>();
    const [dataIsReady, setDataIsReady] = useState<boolean>(false);
    const [errorState, setErrorState] = useState<MyErrorObj>(INITIAL_ERROR);
    const userEmail: any = useSelector((state: RootState) => state.user.email);
    const userSuperapp: any = useSelector((state: RootState) => state.user.userSuperapp);
    const userType: any = useSelector((state: RootState) => state.user.type);
    let content;

    useEffect(() => {
        async function fetchAcceptedRequests() {
            setDataIsReady(false);
            try {
                const miniappName = 'Trainers';
                const commandData = {
                    command: 'getMyAcceptedRequests',
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
                setAcceptedRequests(resData);
                setDataIsReady(true);
            } catch (err: any) {
                setErrorState({
                    message: err.message || 'Failed to fetch accepted requests.',
                    haveError: true
                });
            }
        }

        fetchAcceptedRequests();
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
                    message="Failed to fetch accepted requests."/>
            </div>
        );
    }

    if (dataIsReady) {
        content = (
            <div className="users">
                <h1>My Accepted Requests</h1>
                {acceptedRequests.length > 0 ?
                    (<>
                        <ul className="users-list">
                            {acceptedRequests.map((request: RequestProps) => (
                                <li key={request.objectId.id} className="user-container-without-a">
                                    <div>
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