import React from "react";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

import {SUPERAPP_NAME} from "../../App";
import {userActions} from "../../store/user-slice";
import TraineeForm from "./TraineeForm";
import {handleTraineeCreation, queryClient} from "../../util/http";

export default function NewTrainee(): React.JSX.Element {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {mutate: createTrainee, error} = useMutation({
        mutationFn: handleTraineeCreation,
        onSuccess: (data: any) => {
            console.log(data)
            dispatch(userActions.setRole(data.userData.role));
            dispatch(userActions.setUserSuperapp(data.userData.userId.superapp));
            dispatch(userActions.setType(data.objectData));
            queryClient.invalidateQueries({queryKey: ['users']});
            navigate('/superapp/users/login');
        }
    });

    function handleSubmit(formData: any) {
        createTrainee({formData: formData, userSuperApp: SUPERAPP_NAME});
    }

    return (
        <TraineeForm onSubmit={handleSubmit} editForm={false} errMsg={error?.message}/>
    );
}