import React, {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";

import {createNewCommand} from "../../util/http";
import {RootState} from "../../store";
import {INITIAL_ERROR, MyErrorObj} from "./PendingRequests";
import ErrorBlock from "../UI/ErrorBlock";
import LoadingIndicator from "../UI/LoadingIndicator";

interface TraineeProps {
    alias: string,
    objectId: {
        id: string
    }
    objectDetails: {
        traineeData: {
            fullName: string,
            location: string,
            phoneNumber: string,
            sportStyle: string,
            yearOfBirth: string
        }
    }
}

export default function TraineesList(): React.JSX.Element {
    const [acceptedRequests, setAcceptedRequests] = useState<any>();
    const [dataIsReady, setDataIsReady] = useState<boolean>(false);
    const [errorState, setErrorState] = useState<MyErrorObj>(INITIAL_ERROR);
    const userEmail = useSelector((state: any) => state.user.email);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);
    const userType: any = useSelector((state: RootState) => state.user.type);
    let content;

    useEffect(() => {
        async function fetchTrainees() {
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

                let finalData = resData.filter((item: any, index: any) =>
                    index === resData.findIndex((i: any) => i.createdBy.userId.email === item.createdBy.userId.email))
                setAcceptedRequests(finalData);
                setDataIsReady(true);
            } catch (err: any) {
                setErrorState({
                    message: err.message || 'Failed to fetch accepted requests.',
                    haveError: true
                });
            }
        }

        fetchTrainees();
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
                <h1>My Trainees</h1>
                {acceptedRequests.length > 0 ?
                    (<>
                        <ul className="users-list">
                            {acceptedRequests.map((trainee: TraineeProps) => (
                                <li key={trainee.objectId.id} className="user-container">
                                    <NavLink to={`/superapp/users/traineeDetails/${trainee.objectId.id}`}>
                                        <div className="user-content">
                                            <h2 className="title-color">Full Name: <span
                                                className="category-value">{trainee.objectDetails.traineeData.fullName}</span>
                                            </h2>
                                            <h2 className="title-color">Phone-Number: <span
                                                className="category-value">{trainee.objectDetails.traineeData.phoneNumber}</span>
                                            </h2>
                                            <h2 className="title-color">Birth-Year: <span
                                                className="category-value">{trainee.objectDetails.traineeData.yearOfBirth}</span>
                                            </h2>
                                            <h2 className="title-color">Sport-Style: <span
                                                className="category-value">{trainee.objectDetails.traineeData.sportStyle}</span>
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
    }

    console.log(acceptedRequests)

    return (
        <>
            {content}
        </>
    );
}