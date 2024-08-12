import React from "react";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

import TrainerForm from "./TrainerForm";
import {handleTrainerCreation, queryClient} from "../../util/http";
import {SUPERAPP_NAME} from "../../App";
import {userActions} from "../../store/user-slice";

export default function NewTrainer(): React.JSX.Element {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {mutate: createTrainer, error} = useMutation({
        mutationFn: handleTrainerCreation,
        onSuccess: (data: any) => {
            dispatch(userActions.setRole(data.userData.role));
            dispatch(userActions.setUserSuperapp(data.userData.userId.superapp));
            dispatch(userActions.setType(data.objectData));
            queryClient.invalidateQueries({queryKey: ['users']});
            navigate('/superapp/users/login');
        }
    });

    function handleSubmit(formData: any) {
        createTrainer({formData: formData, userSuperApp: SUPERAPP_NAME});
    }

    return (
        <TrainerForm onSubmit={handleSubmit} editForm={false} errMsg={error?.message}/>
    );
}