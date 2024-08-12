import React, {useEffect} from "react";
import {Link, useParams} from 'react-router-dom';
import {useQuery} from "@tanstack/react-query";
import {useDispatch, useSelector} from "react-redux";

import {fetchObjectsBy, fetchUser} from "../../util/http";
import ErrorBlock from "../UI/ErrorBlock";
import LoadingIndicator from "../UI/LoadingIndicator";
import {userActions} from "../../store/user-slice";

export default function UserDetails(): React.JSX.Element {
    const params = useParams();
    const dispatch = useDispatch();
    const superapp = useSelector((state: any) => state.superapp.superapp);
    const userEmail = useSelector((state: any) => state.user.email);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);
    const type: string = 'type';
    const searchValue: string = 'Trainee';

    const {data, isPending, isError, isSuccess} = useQuery({
        queryKey: ['users', params.email],
        queryFn: ({signal}) => fetchUser({
            signal, email: params.email, superapp: superapp
        }),
    });

    const {data: traineesObjects} = useQuery({
        queryKey: ['objects', type, params.email],
        queryFn: ({signal}) => fetchObjectsBy({
            signal, email: userEmail, searchBy: type, searchValue: searchValue, userSuperapp: userSuperapp
        }),
        staleTime: 0
    });
    console.log(traineesObjects);
    useEffect(() => {
        if (isSuccess && data && traineesObjects?.find((i: any) => i.alias === userEmail)) {
            const specificTrainee = traineesObjects?.find((i: any) => i.alias === userEmail);
            dispatch(userActions.setEmail(data.userId.email));
            dispatch(userActions.setRole(data.role));
            dispatch(userActions.setUserSuperapp(superapp));
            dispatch(userActions.setSubmitted(true));
            dispatch(userActions.setType(specificTrainee));
        }
    }, [isSuccess, data, traineesObjects, dispatch, superapp, userEmail]);

    if (isError || !traineesObjects?.find((i: any) => i.alias === userEmail)) {
        return (
            <div className="error-container">
                <ErrorBlock
                    title="An error occurred"
                    message="The user does not exist in the system, please check the details you entered"/>
            </div>
        );
    }
    let content;

    if (isPending) {
        content = (
            <LoadingIndicator/>
        );
    }


    if (data && !!traineesObjects?.length) {
        const specificTrainee = traineesObjects.find((i: any) => i.alias === userEmail);
        console.log(specificTrainee)
        content = (
            <>
                <header>
                    <h1>Personal info</h1>
                    <nav>
                        <Link to={`/superapp/users/${superapp}/${params.email}`}>Edit</Link>
                    </nav>
                </header>
                <div id="event-details-content">
                    <div id="event-details-info">
                        <div id="event-details-description">
                            <p>User Name: <span className="category-value">{data.username}</span></p>
                            <p>E-Mail: <span className="category-value">{data.userId.email}</span></p>
                            <p>Role: <span className="category-value">{data.role}</span></p>
                            <p>Avatar: <span className="category-value">{data.avatar}</span></p>
                            <p>Full Name: <span
                                className="category-value">{specificTrainee.objectDetails.traineeData.fullName}</span>
                            </p>
                            <p>Phone-Number: <span
                                className="category-value">{specificTrainee.objectDetails.traineeData.phoneNumber}</span>
                            </p>
                            <p>Location: <span
                                className="category-value">{specificTrainee.objectDetails.traineeData.location}</span>
                            </p>
                            <p>Sport Style: <span
                                className="category-value">{specificTrainee.objectDetails.traineeData.sportStyle}</span>
                            </p>
                            <p>Year of Birth: <span
                                className="category-value">{specificTrainee.objectDetails.traineeData.yearOfBirth}</span>
                            </p>
                            <p>Health Declaration: <span
                                className="category-value">{specificTrainee.objectDetails.traineeData.isInsured.toString()}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <article id="event-details">
                {content}
            </article>
        </>
    );
}