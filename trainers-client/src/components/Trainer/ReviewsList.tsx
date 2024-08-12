import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";

import {INITIAL_ERROR, MyErrorObj} from "./PendingRequests";
import ErrorBlock from "../UI/ErrorBlock";
import LoadingIndicator from "../UI/LoadingIndicator";
import {createNewCommand} from "../../util/http";


interface ReviewProps {
    alias: string,
    createdBy: {
        userId: {
            email: string
        }
    }
    objectId: {
        id: string,
    }
    objectDetails: {
        reviewData: string
    }
}

export default function ReviewsList(): React.JSX.Element {
    const [myReviews, setMyReviews] = useState<any>();
    const [dataIsReady, setDataIsReady] = useState<boolean>(false);
    const [errorState, setErrorState] = useState<MyErrorObj>(INITIAL_ERROR);
    const userEmail = useSelector((state: any) => state.user.email);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);
    const userType = useSelector((state: any) => state.user.type);
    let content;

    useEffect(() => {
        async function fetchMyReviews() {
            setDataIsReady(false);
            try {
                const miniappName = 'Trainers';
                const commandData = {
                    command: 'getReviewsOnMe',
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
                setMyReviews(resData);
                setDataIsReady(true);
            } catch (err: any) {
                setErrorState({
                    message: err.message || 'Failed to fetch accepted requests.',
                    haveError: true
                });
            }
        }

        fetchMyReviews();
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
                    message="Failed to fetch my reviews."/>
            </div>
        );
    }

    if (dataIsReady) {
        content = (
            <div className="users">
                <h1>My Reviews</h1>
                {myReviews.length > 0 ?
                    (<>
                        <ul className="users-list">
                            {myReviews.map((review: ReviewProps) => (
                                <li key={review.objectId.id} className="user-container-without-a">
                                    <div>
                                        <h2 className="title-color">Trainee E-Mail: <span
                                            className="category-value">{review.createdBy.userId.email}</span></h2>
                                        <h2 className="title-color">Content of Review: <span
                                            className="category-value">{review.objectDetails.reviewData}</span>
                                        </h2>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>) :
                    <ErrorBlock
                        title="An error occurred"
                        message="No review has been written by the user"
                    />
                }
            </div>
        );
    }

    console.log(myReviews)

    return (
        <>
            {content}
        </>
    );
}