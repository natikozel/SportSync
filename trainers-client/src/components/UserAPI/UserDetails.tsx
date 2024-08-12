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
    const searchValue: string = 'Trainer';

    const {data, isPending, isError, isSuccess} = useQuery({
        queryKey: ['users', params.email],
        queryFn: ({signal}) => fetchUser({
            signal, email: params.email, superapp: superapp
        })
    });

    const {data: trainersObjects, isSuccess: fetchObjects} = useQuery({
        queryKey: ['objects', type, params.email],
        queryFn: ({signal}) => fetchObjectsBy({
            signal, email: userEmail, searchBy: type, searchValue: searchValue, userSuperapp: userSuperapp
        }),
    });



    useEffect(() => {
        if (isSuccess && data && trainersObjects?.find((i: any) => i.alias === userEmail)) {
            const specificTrainer = trainersObjects.find((i: any) => i.alias === userEmail);
            dispatch(userActions.setEmail(data.userId.email));
            dispatch(userActions.setRole(data.role));
            dispatch(userActions.setUserSuperapp(superapp));
            dispatch(userActions.setSubmitted(true));
            dispatch(userActions.setType(specificTrainer));
        }
    }, [data, dispatch, isSuccess, superapp, trainersObjects, userEmail]);


    if (isError || !trainersObjects?.find((i: any) => i.alias === userEmail)) {
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


    console.log(trainersObjects)
    if (data && !!trainersObjects?.length && fetchObjects) {
        const specificTrainer = trainersObjects.find((i: any) => i.alias === userEmail);
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
                                className="category-value">{specificTrainer.objectDetails.trainerData.fullName}</span>
                            </p>
                            <p>Phone-Number: <span
                                className="category-value">{specificTrainer.objectDetails.trainerData.phoneNumber}</span>
                            </p>
                            <p>Location: <span
                                className="category-value">{specificTrainer.objectDetails.trainerData.location}</span>
                            </p>
                            <p>Sport Style: <span
                                className="category-value">{specificTrainer.objectDetails.trainerData.sportStyle}</span>
                            </p>
                            <p>Price: <span
                                className="category-value">{specificTrainer.objectDetails.trainerData.price}</span>
                            </p>
                            <p>Population: <span
                                className="category-value">{specificTrainer.objectDetails.trainerData.population}</span>
                            </p>
                            <p>Bio: <span
                                className="category-value">{specificTrainer.objectDetails.trainerData.bio}</span>
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