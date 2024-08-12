import React from "react";
import {useMutation} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {createNewCommand, queryClient} from "../../util/http";
import CommandForm from "./CommandForm";
import ErrorBlock from "../UI/ErrorBlock";
import {commandActions} from "../../store/command-slice";

export default function InvokeCommand(): React.JSX.Element {
    const dispatch = useDispatch();
    const userRole = useSelector((state: any) => state.user.role);
    const params = useParams();
    const navigate = useNavigate();

    const {mutate} = useMutation({
        mutationFn: createNewCommand,
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({queryKey: ['commands']}).then(
                () => {
                    console.log(data);
                    if (!!data.length) {
                        dispatch(commandActions.setCommandData(data[0]));
                        return navigate(`/superapp/admin/miniapp/${data![0].commandId.miniapp}/${data![0].commandId.id}`)
                    } else {
                        navigate(`/errorPage`);
                    }
                }
            );
        }
    });

    function handleSubmit(formData: any) {

        mutate({miniAppName: params.miniAppName, commandData: formData});
    }


    let content;

    if (userRole === 'MINIAPP_USER') {
        content = (
            <>
                <h1 className="center">Invoke a Command</h1>
                <CommandForm onSubmit={handleSubmit} editForm={false}/>
            </>
        );
    } else {
        content = (
            <div className="users">
                <ErrorBlock title="An error occurred"
                            message={'Only MINIAPP_USER users are allowed to access this command'}/>
            </div>
        );
    }

    return (
        <>
            {content}
        </>
    );
}