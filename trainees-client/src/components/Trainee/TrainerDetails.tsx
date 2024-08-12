import React, {ChangeEvent, useState} from "react";
import {useNavigate, useParams} from 'react-router-dom';
import {useMutation, useQuery} from "@tanstack/react-query";
import {useSelector} from "react-redux";

import {fetchObject, handleDateSubmit, handleReviewSubmit} from "../../util/http";
import ErrorBlock from "../UI/ErrorBlock";
import LoadingIndicator from "../UI/LoadingIndicator";
import InputForm from "../UI/InputForm";
import {RootState} from "../../store";

interface HourProps {
    hour: string,
    isTaken: boolean
}

const hours: Array<HourProps> = [
    {
        hour: '08:00',
        isTaken: false
    },
    {
        hour: '09:00',
        isTaken: false
    }
    , {
        hour: '10:00',
        isTaken: false
    }, {
        hour: '11:00',
        isTaken: false
    }, {
        hour: '12:00',
        isTaken: false
    }, {
        hour: '16:00',
        isTaken: false
    }, {
        hour: '17:00',
        isTaken: false
    }, {
        hour: '18:00',
        isTaken: false
    }, {
        hour: '19:00',
        isTaken: false
    }, {
        hour: '20:00',
        isTaken: false
    }];

export default function TrainerDetails(): React.JSX.Element {
    const params = useParams();
    const navigate = useNavigate();

    const [takenHour, setTakenHour] = useState<Array<HourProps>>([]);
    const superapp = useSelector((state: any) => state.superapp.superapp);
    const userEmail = useSelector((state: any) => state.user.email);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);
    const userType: any = useSelector((state: RootState) => state.user.type);
    const objectsData = useSelector((state: any) => state.object.objectsData);

    const {data: trainerData, isPending, isError} = useQuery({
        queryKey: ['objects', params.id],
        queryFn: ({signal}) => fetchObject({
            signal, id: params.id, email: userEmail, superapp: superapp, userSuperapp: userSuperapp
        }),
    });

    const {mutate: sendRequest} = useMutation({
        mutationFn: handleDateSubmit,
    })

    const {mutate: sendReview} = useMutation({
        mutationFn: handleReviewSubmit,
    })

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

    let resultData: any;
    const specificData = objectsData.filter((object: any) => object.objectId.id === params.id);
    resultData = {...specificData[0]};

    function handleSubmitDate(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        const date = data.date;
        const hour = data.hour;
        const traineeData = userType.objectDetails.traineeData;

        const updateTrainerObject = {
            objectDetails: {
                trainerData: resultData.objectDetails.trainerData,
                schedule: [...resultData.objectDetails.schedule, {hour: hour, date: date}],
                reviewData: [...resultData.objectDetails.reviewData]
            }
        }
        const trainerId = resultData.objectId.id;
        const trainerEmail = resultData.alias;

        sendRequest({
            updateTrainerObject,
            userEmail,
            userSuperapp,
            trainerId,
            trainerEmail,
            superapp,
            date,
            hour,
            traineeData
        });
        setTakenHour((prevState) => prevState.filter((i: any) => i.hour !== data.hour))
        navigate(`/superapp/users/trainers`);
    }

    function handleDateChange(event: any) {
        const choosenDate = event.target.value;
        const schedule = trainerData.objectDetails.schedule.filter((i: any) => i.date === choosenDate);
        const finalArr = hours.filter((hour: any) =>
            !schedule.find((i: any) => i.hour === hour.hour))

        setTakenHour((prevState) => {
            return finalArr;
        })
    }

    function handleSubmitReview(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        const contentOfReview = data.review;

        const updateTrainerObject = {
            objectDetails: {
                trainerData: resultData.objectDetails.trainerData,
                schedule: [...resultData.objectDetails.schedule],
                reviewData: [...resultData.objectDetails.reviewData, {
                    reviewer: userEmail,
                    contentOfReview: contentOfReview
                }]
            }
        }
        const trainerId = resultData.objectId.id;
        const trainerEmail = resultData.alias;
        sendReview({
            updateTrainerObject,
            userEmail,
            userSuperapp,
            trainerId,
            trainerEmail,
            superapp,
            review: contentOfReview
        });
        navigate(`/superapp/users/trainers`);
    }

    if (trainerData) {
        content = (
            <>
                <div id="event-details-content">
                    <div id="event-details-info">
                        <div id="event-details-description">
                            <p>Name: <span
                                className="category-value">{resultData.objectDetails.trainerData.fullName}</span>
                            </p>
                            <p>Location: <span
                                className="category-value">{resultData.objectDetails.trainerData.location}</span>
                            </p>
                            <p>Phone-Number: <span
                                className="category-value">{resultData.objectDetails.trainerData.phoneNumber}</span>
                            </p>
                            <p>Sport Type: <span
                                className="category-value">{resultData.objectDetails.trainerData.sportStyle}</span>
                            </p>
                            <p>Population: <span
                                className="category-value">{resultData.objectDetails.trainerData.population}</span>
                            </p>
                            <p>Price: <span
                                className="category-value">{resultData.objectDetails.trainerData.price}</span>
                            </p>
                            <p>Bio: <span
                                className="category-value">{resultData.objectDetails.trainerData.bio}</span>
                            </p>
                        </div>
                    </div>
                </div>
                {userType.objectDetails.traineeData.isInsured ? (
                    <form className={"form"} onSubmit={handleSubmitDate}>
                        <p>
                            <label htmlFor={"date"}>Date</label>
                            <input id={"date"} type={"date"} name={"date"} required
                                   onChange={handleDateChange}
                            />
                        </p>
                        <div className={"margin-bottom-class"}>
                            {!!takenHour.length ? (<>
                                <label htmlFor={"hour"}>Hour</label>
                                <div className={"select-container"}>
                                    <select name={"hour"} id={"hour"} className={"select-box"}>
                                        {takenHour.map((hour: HourProps, index) => (
                                            <option key={`${index}_${hour.hour}`} value={hour.hour}>{hour.hour}</option>
                                        ))}
                                    </select>
                                </div>
                            </>) : null}
                        </div>
                        <div className={"actions"}>
                            <button>Send Request</button>
                        </div>
                    </form>) : (
                    <div className="error-container">
                        <ErrorBlock
                            title="An error occurred"
                            message="You cannot schedule a workout without signing a health declaration."/>
                    </div>
                )
                }
                <form className={"form"} onSubmit={handleSubmitReview}>
                    <InputForm label={"Review"} htmlFor_id_name={"review"} type={"text"}
                               placeholder={"Enter the Review"}/>
                    <div className={"actions"}>
                        <button>Send Review</button>
                    </div>
                </form>
            </>
        );
    }

    return (
        <>
            <header className="header-title-without-nav">
                <h1>Trainer Details</h1>
            </header>

            <article id="event-details">
                {content}
            </article>
        </>
    );
}