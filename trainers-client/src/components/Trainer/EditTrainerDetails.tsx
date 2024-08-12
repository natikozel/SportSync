import React from "react";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";

import {RootState} from "../../store";
import {fetchUser, handleUpdateTrainer} from "../../util/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import TrainerForm from "./TrainerForm";

export default function EditTrainerDetails(): React.JSX.Element {
    const params = useParams();
    const navigate = useNavigate();
    const userSuperapp = useSelector((state: RootState) => state.user.userSuperapp);
    const userType: any = useSelector((state: RootState) => state.user.type);
    const superapp: any = useSelector((state: RootState) => state.superapp.superapp);
    let content;

    const {data, isPending, isError} = useQuery({
        queryKey: ['users', params.email],
        queryFn: ({signal}) => fetchUser({
            signal, email: params.email, superapp: superapp
        })
    });

    const {mutate: updateTrainerDetails} = useMutation({
            mutationFn: handleUpdateTrainer,
            onSuccess: () => {
                navigate(`/superapp/users/login/${superapp}/${params.email}`);
            }
        }
    );

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
                    message="The user does not exist in the system, please check the details you entered"/>
            </div>
        );
    }

    function handleSubmit(formData: any) {
        updateTrainerDetails({
            updateTrainerObject: formData,
            userEmail: params.email,
            userSuperapp: userSuperapp!,
            superapp: superapp,
            trainerId: userType.objectId.id
        });
    }

    if (data) {
        const inputData = {
            userData: data,
            dataType: userType
        }
        content = (
            <TrainerForm onSubmit={handleSubmit} editForm={true} inputData={inputData}/>
        );
    }

    return (
        <>
            {content}
        </>
    );
}