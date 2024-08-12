import React from "react";
import {useParams} from 'react-router-dom';
import {useQuery} from "@tanstack/react-query";
import {useSelector} from "react-redux";

import {fetchObject} from "../../util/http";
import ErrorBlock from "../UI/ErrorBlock";
import LoadingIndicator from "../UI/LoadingIndicator";
import {RootState} from "../../store";

export default function TraineeDetails(): React.JSX.Element {
    const params = useParams();

    const superapp = useSelector((state: any) => state.superapp.superapp);
    const userEmail = useSelector((state: any) => state.user.email);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);

    const {data: traineeData, isPending, isError} = useQuery({
        queryKey: ['objects', params.id],
        queryFn: ({signal}) => fetchObject({
            signal, id: params.id, email: userEmail, superapp: superapp, userSuperapp: userSuperapp
        }),
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

    if (traineeData) {
        content = (
            <>
                <div id="event-details-content">
                    <div id="event-details-info">
                        <div id="event-details-description">
                            <p>Name: <span
                                className="category-value">{traineeData.objectDetails.traineeData.fullName}</span>
                            </p>
                            <p>Year of Birth: <span
                                className="category-value">{traineeData.objectDetails.traineeData.yearOfBirth}</span>
                            </p>
                            <p>Location: <span
                                className="category-value">{traineeData.objectDetails.traineeData.location}</span>
                            </p>
                            <p>Phone-Number: <span
                                className="category-value">{traineeData.objectDetails.traineeData.phoneNumber}</span>
                            </p>
                            <p>Sport Type: <span
                                className="category-value">{traineeData.objectDetails.traineeData.sportStyle}</span>
                            </p>
                            <p>Health Declaration: <span
                                className="category-value">{traineeData.objectDetails.traineeData.isInsured.toString()}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </>
        );
    }


    return (
        <>
            <header className="header-title-without-nav">
                <h1>Trainee Details</h1>
            </header>

            <article id="event-details">
                {content}
            </article>
        </>
    );
}