import React from "react";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

import ObjectForm from "./ObjectForm";
import {createNewObject, queryClient} from "../../util/http";
import {objectActions} from "../../store/object-slice";

export default function NewObject(): React.JSX.Element {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {mutate} = useMutation({
        mutationFn: createNewObject,
        onSuccess: (data) => {
            dispatch(objectActions.setObjectData(data));
            console.log(data)
            queryClient.invalidateQueries({queryKey: ['objects']});
            navigate('/');
        }
    });

    function handleSubmit(formData: any) {
        mutate(formData);
    }

    return (
        <ObjectForm onSubmit={handleSubmit} editForm={false}/>
    );
}