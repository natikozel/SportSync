import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useSelector} from "react-redux";

import UserForm from "./UserForm";
import {fetchUser, queryClient, updateUser} from "../../util/http";
import ErrorBlock from "../UI/ErrorBlock";
import LoadingIndicator from "../UI/LoadingIndicator";

export default function EditUserDetails(): React.JSX.Element {
    const params = useParams();
    const navigate = useNavigate();
    const superapp = useSelector((state: any) => state.superapp.superapp);

    const {data, isPending, isError, error} = useQuery({
        queryKey: ['users', params.email],
        queryFn: ({signal}) => fetchUser({signal, email: params.email, superapp: superapp})
    });

    const {mutate} = useMutation({
        mutationFn: updateUser,
        onMutate: async (data) => {
            const newUser = data.user;

            await queryClient.cancelQueries({queryKey: ['users', params.email]});
            const previousUser = queryClient.getQueryData(['users', params.email]);

            queryClient.setQueryData(['users', params.email], newUser);

            return {previousUser: previousUser}
        },
        onError: (error, data, context) => {
            queryClient.setQueryData(['users', params.email], context?.previousUser);
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['users', params.email]});
        }
    });

    function handleSubmit(formData: any) {
        mutate({email: params.email, user: formData, superapp: superapp});
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

    if (data) {
        content = (
            <UserForm onSubmit={handleSubmit} inputData={data} editForm={true}/>
        );
    }

    return (
        <>
            {content}
        </>
    );
}