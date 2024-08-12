import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useSelector} from "react-redux";

import ObjectForm from "./ObjectForm";
import {fetchObject, queryClient, updateObject} from "../../util/http";
import ErrorBlock from "../UI/ErrorBlock";
import LoadingIndicator from "../UI/LoadingIndicator";

export default function EditObjectDetails(): React.JSX.Element {
    const superapp = useSelector((state: any) => state.superapp.superapp);
    const userEmail = useSelector((state: any) => state.user.email);
    const userRole = useSelector((state: any) => state.user.role);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);
    const condition = userRole === 'SUPERAPP_USER';

    const params = useParams();
    const navigate = useNavigate();

    const {data, isPending, isError, error} = useQuery({
        queryKey: ['objects', params.id],
        queryFn: ({signal}) => fetchObject({
            signal, id: params.id, email: userEmail, userSuperapp: userSuperapp
        }),
        enabled: condition
    });

    const {mutate} = useMutation({
        mutationFn: updateObject,
        onMutate: async (data) => {
            const newObject = data.object;

            await queryClient.cancelQueries({queryKey: ['objects', params.id]});
            const previousObject = queryClient.getQueryData(['objects', params.id]);

            queryClient.setQueryData(['objects', params.id], newObject);

            return {previousUser: previousObject}
        },
        onError: (error, data, context) => {
            queryClient.setQueryData(['objects', params.id], context?.previousUser);
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['objects', params.id]});
        }

    });

    function handleSubmit(formData: any) {
        mutate({id: params.id, object: formData, email: userEmail, superapp: superapp, userSuperapp: userSuperapp});
        navigate('/');
    }

    let content;

    if (isPending) {
        content = <LoadingIndicator/>;
    }

    if (isError) {
        content = (
            <ErrorBlock title="An error occurred" message={error.message}/>
        );
    }

    if (data && condition) {
        content = (
            <ObjectForm onSubmit={handleSubmit} inputData={data} editForm={true}/>
        );
    } else {
        content = (
            <div className="users">
                <ErrorBlock title="An error occurred"
                            message={'Only superApp users are allowed to access this command'}/>
            </div>
        );
    }

    return (
        <>
            {content}
        </>
    );
}