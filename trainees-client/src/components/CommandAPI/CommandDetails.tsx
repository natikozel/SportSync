import React from "react";
import {Link, useParams} from 'react-router-dom';
import {useQuery} from "@tanstack/react-query";
import {useSelector} from "react-redux";

import {fetchSpecificCommands} from "../../util/http";
import Header from "../UI/Header";
import ErrorBlock from "../UI/ErrorBlock";
import LoadingIndicator from "../UI/LoadingIndicator";

export default function CommandDetails(): React.JSX.Element {
    const params = useParams();
    const userEmail = useSelector((state: any) => state.user.email);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);
    const userRole = useSelector((state: any) => state.user.role);
    const condition = userRole === 'ADMIN';

    const dataOfInvokeCommand = useSelector((state: any) => state.command.commandData);

    const {data, isPending, isError} = useQuery({
        queryKey: ['commands', params.miniAppName],
        queryFn: ({signal}) => fetchSpecificCommands({
            signal, miniAppName: params.miniAppName, email: userEmail, userSuperapp: userSuperapp

        }),
        enabled: condition
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

    let resultData;

    if (data && condition) {
        const specificData = data.filter((command: any) => command.commandId.id === params.commandId);
        resultData = {...specificData[0]};
        console.log(resultData);
    } else {
        resultData = dataOfInvokeCommand;
        console.log(resultData);
    }

    if (!isError) {
        content = (
            <div id="event-details-content">
                <div id="event-details-info">
                    <div id="event-details-description">
                        <div>
                            <p>
                                Command ID (superApp, miniApp, id)
                            </p>
                            <p>
                                superApp: <span className="category-value">{resultData.commandId.superapp}</span>
                            </p>
                            <p>
                                miniApp: <span className="category-value">{resultData.commandId.miniapp}</span>
                            </p>
                            <p>id: <span className="category-value">{resultData.commandId.id}</span></p>
                        </div>
                        <p>Command: <span className="category-value">{resultData.command}</span></p>
                        <div>
                            <p>
                                Target Object (ObjectID - (superApp, id))
                            </p>
                            <div>
                                <p>
                                    superApp: <span
                                    className="category-value">{resultData.targetObject.objectId.superapp}</span>
                                </p>
                                <p>id: <span
                                    className="category-value">{resultData.targetObject.objectId.id}</span>
                                </p>
                            </div>
                        </div>
                        <p>Invocation Time Stamp: <span
                            className="category-value">{resultData.invocationTimestamp}</span>
                        </p>
                        <div>
                            <p>
                                Invoked By (UserID - (superApp, email))
                            </p>
                            <div>
                                <p>
                                    superApp: <span
                                    className="category-value">{resultData.invokedBy.userId.superapp}</span>
                                </p>
                                <p>email: <span
                                    className="category-value">{resultData.invokedBy.userId.email}</span>
                                </p>
                            </div>
                        </div>
                        <div>
                            <p>
                                Command Attributes
                            </p>
                            <p>Key 1: <span className="category-value">{resultData.commandAttributes.key1}</span>
                            </p>
                            <p>Key 2: <span className="category-value">{resultData.commandAttributes.key2}</span>
                            </p>
                            <p>Key 3: <span className="category-value">{resultData.commandAttributes.key3}</span>
                            </p>
                            <p>Key 4: <span className="category-value">{resultData.commandAttributes.key4}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header title={`Commands of the MiniApp - ${params.miniAppName}`}>
                {condition && (
                    <Link to="/superapp/admin/miniapp" className="nav-item">
                        View all Commands
                    </Link>
                )}
            </Header>
            <article id="event-details">
                {content}
            </article>
        </>
    );
}