import React from "react";
import {Link, useParams} from 'react-router-dom';
import {useQuery} from "@tanstack/react-query";
import {useSelector} from "react-redux";

import {fetchObject} from "../../util/http";
import Header from "../UI/Header";
import ErrorBlock from "../UI/ErrorBlock";
import LoadingIndicator from "../UI/LoadingIndicator";

export default function ObjectDetails(): React.JSX.Element {
    const params = useParams();

    const userEmail = useSelector((state: any) => state.user.email);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);
    const userRole = useSelector((state: any) => state.user.role);
    const superapp = useSelector((state: any) => state.superapp.superapp);
    const condition = (userRole === 'SUPERAPP_USER');
    const objectsData = useSelector((state: any) => state.object.objectsData);

    const {data, isPending, isError} = useQuery({
        queryKey: ['objects', params.id],
        queryFn: ({signal}) => fetchObject({
            signal, id: params.id, email: userEmail, superapp: superapp, userSuperapp: userSuperapp
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
        console.log(data)
        content = (
            <>
                {condition && (
                    <header>
                        <h1>Object Info</h1>
                        <nav>
                            <Link to={`/superapp/objects/${superapp}/${params.id}/edit`}>Edit</Link>
                        </nav>
                    </header>
                )}
                <div id="event-details-content">
                    <div id="event-details-info">
                        <div id="event-details-description">
                            <div>
                                <p>
                                    ObjectID (id, superApp)
                                </p>
                                <p>id: <span className="category-value">{data.objectId.id}</span></p>
                                <p>superApp: <span className="category-value">{data.objectId.superapp}</span></p>
                            </div>
                            <p>Type: <span className="category-value">{data.type}</span></p>
                            <p>Alias: <span className="category-value">{data.alias}</span></p>
                            <p>Active: <span className="category-value">{data.active.toString()}</span>
                            </p>
                            <p>Creation Time Stamp: <span
                                className="category-value">{data.creationTimestamp}</span>
                            </p>
                            <div>
                                <p>
                                    CreatedBy (UserId - superApp, Email)
                                </p>
                                <div>
                                    <p>superApp: <span
                                        className="category-value">{data.createdBy.userId.superapp}</span>
                                    </p>
                                    <p>Email: <span
                                        className="category-value">{data.createdBy.userId.email}</span>
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p>
                                    Object Details
                                </p>
                                <p>Key 1: <span className="category-value">{data.objectDetails.key1}</span></p>
                                <p>Key 2: <span className="category-value">{data.objectDetails.key2}</span></p>
                                <p>Key 3: <span className="category-value">{data.objectDetails.key3}</span></p>
                                <p>Key 4: <span className="category-value">{data.objectDetails.key4}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );

    } else if(!condition) {
        console.log(objectsData)
        const specificData = objectsData.filter((object: any) => object.objectId.id === params.id);
        console.log(specificData)
        resultData = {...specificData[0]};
        console.log(resultData);

        content = (
            <>
                {condition && (
                    <header>
                        <h1>Object Info</h1>
                        <nav>
                            <Link to={`/superapp/objects/${superapp}/${params.id}/edit`}>Edit</Link>
                        </nav>
                    </header>
                )}
                <div id="event-details-content">
                    <div id="event-details-info">
                        <div id="event-details-description">
                            <div>
                                <p>
                                    ObjectID (id, superApp)
                                </p>
                                <p>id: <span className="category-value">{resultData.objectId.id}</span></p>
                                <p>superApp: <span className="category-value">{resultData.objectId.superapp}</span></p>
                            </div>
                            <p>Type: <span className="category-value">{resultData.type}</span></p>
                            <p>Alias: <span className="category-value">{resultData.alias}</span></p>
                            <p>Active: <span className="category-value">{resultData.active.toString()}</span>
                            </p>
                            <p>Creation Time Stamp: <span
                                className="category-value">{resultData.creationTimestamp}</span>
                            </p>
                            <div>
                                <p>
                                    CreatedBy (UserId - superApp, Email)
                                </p>
                                <div>
                                    <p>superApp: <span
                                        className="category-value">{resultData.createdBy.userId.superapp}</span>
                                    </p>
                                    <p>Email: <span
                                        className="category-value">{resultData.createdBy.userId.email}</span>
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p>
                                    Object Details
                                </p>
                                <p>Key 1: <span className="category-value">{resultData.objectDetails.key1}</span></p>
                                <p>Key 2: <span className="category-value">{resultData.objectDetails.key2}</span></p>
                                <p>Key 3: <span className="category-value">{resultData.objectDetails.key3}</span></p>
                                <p>Key 4: <span className="category-value">{resultData.objectDetails.key4}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );

    }


        // content = (
        //     <>
        //         {condition && (
        //             <header>
        //                 <h1>Object Info</h1>
        //                 <nav>
        //                     <Link to={`/superapp/objects/${superapp}/${params.id}/edit`}>Edit</Link>
        //                 </nav>
        //             </header>
        //         )}
        //         <div id="event-details-content">
        //             <div id="event-details-info">
        //                 <div id="event-details-description">
        //                     <div>
        //                         <p>
        //                             ObjectID (id, superApp)
        //                         </p>
        //                         <p>id: <span className="category-value">{resultData.objectId.id}</span></p>
        //                         <p>superApp: <span className="category-value">{resultData.objectId.superapp}</span></p>
        //                     </div>
        //                     <p>Type: <span className="category-value">{resultData.type}</span></p>
        //                     <p>Alias: <span className="category-value">{resultData.alias}</span></p>
        //                     <p>Active: <span className="category-value">{resultData.active.toString()}</span>
        //                     </p>
        //                     <p>Creation Time Stamp: <span
        //                         className="category-value">{resultData.creationTimestamp}</span>
        //                     </p>
        //                     <div>
        //                         <p>
        //                             CreatedBy (UserId - superApp, Email)
        //                         </p>
        //                         <div>
        //                             <p>superApp: <span
        //                                 className="category-value">{resultData.createdBy.userId.superapp}</span>
        //                             </p>
        //                             <p>Email: <span
        //                                 className="category-value">{resultData.createdBy.userId.email}</span>
        //                             </p>
        //                         </div>
        //                     </div>
        //                     <div>
        //                         <p>
        //                             Object Details
        //                         </p>
        //                         <p>Key 1: <span className="category-value">{resultData.objectDetails.key1}</span></p>
        //                         <p>Key 2: <span className="category-value">{resultData.objectDetails.key2}</span></p>
        //                         <p>Key 3: <span className="category-value">{resultData.objectDetails.key3}</span></p>
        //                         <p>Key 4: <span className="category-value">{resultData.objectDetails.key4}</span></p>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </>
        // );


    return (
        <>
            <Header title={"Object Detail"}>
                {condition && (
                    <Link to="/superapp/objects" className="nav-item">
                        View all Objects
                    </Link>
                )}
            </Header>
            <article id="event-details">
                {content}
            </article>
        </>
    );
}