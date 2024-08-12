import React from "react";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";

import UserForm from "./UserForm";
import {queryClient, createNewUser} from "../../util/http";
import {userActions} from "../../store/user-slice";
import {useDispatch} from "react-redux";

export default function NewUser(): React.JSX.Element {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {mutate} = useMutation({
        mutationFn: createNewUser,
        onSuccess: (data: any) => {
            dispatch(userActions.setRole(data.role));
            dispatch(userActions.setUserSuperapp(data.userId.superapp));
            queryClient.invalidateQueries({queryKey: ['users']});
            navigate('/');
        }
    });

    function handleSubmit(formData: any) {
        mutate(formData);
    }

    return (
        <UserForm onSubmit={handleSubmit} editForm={false}/>
    );
}