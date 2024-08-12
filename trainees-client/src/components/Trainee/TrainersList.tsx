import React, {useEffect, useRef, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {fetchObjectsBy} from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import {objectActions} from "../../store/object-slice";

interface Trainer {
    active: boolean;
    alias: string;
    createdBy: {
        userId: {
            email: string
            superapp: string
        }
    };
    creationTimestamp: string;
    objectDetails: {
        trainerData: {
            fullName: string,
            bio: string,
            location: string,
            phoneNumber: string,
            population: string,
            price: string,
            sportStyle: string
        }
    };
    objectId: {
        id: string,
        superapp: string
    };
    type: string;
}

export default function TrainersList(): React.JSX.Element {
    const searchElement: React.MutableRefObject<HTMLInputElement | null> = useRef(null);
    const [userInput, setUserInput] = useState<string>('');
    const [trainersByLocation, setTrainersByLocation] = useState<boolean>(false);
    const dispatch = useDispatch();
    const TRAINER: string = 'Trainer';
    const searchBy: string = "type";

    const userEmail = useSelector((state: any) => state.user.email);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);
    const trainers = useSelector((state: any) => state.object.objectsData);

    const {data, isPending, isError, error, isSuccess} = useQuery({
        queryKey: ['objects', TRAINER],
        queryFn: ({signal}) => fetchObjectsBy({
            signal, email: userEmail, searchBy: searchBy, searchValue: TRAINER, userSuperapp: userSuperapp
        }),
    });

    useEffect(() => {
        if (isSuccess) {
            console.log(data)
            if (data?.length !== 0)
                dispatch(objectActions.setObjectData(data));
        }
    }, [data, dispatch, isSuccess]);

    let content;

    if (isPending) {
        content = <LoadingIndicator/>;
    }

    if (isError) {
        content = (
            <ErrorBlock title="An error occurred" message={error.message}/>
        );
    }

    if (!!trainers.length && data) {
        let displayData;
        const specificData = trainers?.filter((object: any) => object.objectDetails.trainerData.location === userInput);
        if (trainersByLocation) {
            displayData = [...specificData];
        } else {
            displayData = [...data];
        }

        content = (displayData.length > 0 ?
                (<>
                    <h1>All Trainers</h1>
                    <ul className="users-list">
                        {displayData.map((object: Trainer) => (
                            <li key={object.objectId.id} className="user-container">
                                <NavLink to={`/superapp/users/trainerDetails/${object.objectId.id}`}>
                                    <div className="user-content">
                                        <h2 className="title-color">Name: <span
                                            className="category-value">{object.objectDetails.trainerData.fullName}</span>
                                        </h2>
                                        <h2 className="title-color">Location: <span
                                            className="category-value">{object.objectDetails.trainerData.location}</span>
                                        </h2>
                                        <h2 className="title-color">Sport Style: <span
                                            className="category-value">{object.objectDetails.trainerData.sportStyle}</span>
                                        </h2>
                                    </div>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </>) :
                <ErrorBlock
                    title="An error occurred"
                    message="There are no trainers in the area you selected"
                />
        );
    } else {
        content = (
            <div className="users">
                <ErrorBlock title="An error occurred"
                            message={'Only superApp users are allowed to access this command'}/>
            </div>
        );
    }

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        console.log(searchElement.current?.value)
        setUserInput(searchElement.current ? searchElement.current.value : '');
        setTrainersByLocation(true);
    }

    function handleFlagSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        searchElement.current!.value = '';
        setTrainersByLocation(false);
    }

    return (
        <div className={"users"}>
            <h1 className="center">Search Trainer by Location</h1>
            <div className="form" >

                <label htmlFor="miniApp">Location</label>
                <input id="location" type="text" name="location" required
                       placeholder="Enter Your Location" ref={searchElement}
                />

                <div className="submitButton">
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={handleFlagSubmit}>See All Trainers</button>
                </div>
            </div>
            {content}
        </div>
    );
}