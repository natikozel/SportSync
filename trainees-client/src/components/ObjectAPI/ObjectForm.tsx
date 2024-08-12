import React from 'react';
import {useNavigate, useNavigation} from 'react-router-dom';

import {SUPERAPP_NAME} from "../../App";
import {useSelector} from "react-redux";
import ErrorBlock from "../UI/ErrorBlock";

interface ObjectFormProps {
    inputData?: any;
    onSubmit: (data: any) => void;
    children?: React.ReactNode;
    editForm: boolean;
}

export default function ObjectForm({inputData, onSubmit, editForm}: ObjectFormProps): React.JSX.Element {
    const userRole = useSelector((state: any) => state.user.role);
    const navigate = useNavigate();
    const navigation = useNavigation();

    const isSubmitting = navigation.state === 'submitting';

    function cancelHandler() {
        navigate('/');
    }

    function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.target);

        // const keyArray: Array<FormDataEntryValue> = formData.getAll("key");
        const data: any = Object.fromEntries(formData);


        const objectData = {
            objectId: {
                superapp: SUPERAPP_NAME,
                id: "1"
            },
            createdBy: {
                userId: {
                    superapp: SUPERAPP_NAME,
                    email: data.email
                }
            },
            type: data.type,
            alias: data.alias,
            active: data.active,
            objectDetails: {
                key1: formData.get("key1"),
                key2: formData.get("key2"),
                key3: formData.get("key3"),
                key4: formData.get("key4")
            }
        }

        console.log({...objectData});

        if (data.type.toString().trim() === '' || data.alias.toString().trim() === '' ||
            !data.email.toString().includes('@')) {
            console.log("The data received is incorrect, please try again.");
            return;
        }

        // If it arrived here, then the data is correct

        if (onSubmit) {
            onSubmit({...objectData});
        }
    }

    return (
        <>
            {userRole === 'SUPERAPP_USER' && (
                <form className="form" onSubmit={handleSubmit}>
                    <p>
                        <label htmlFor="email">Email User</label>
                        <input id="email" type="email" name="email" required
                               defaultValue={inputData ? inputData.createdBy.userId.email : ''}
                               placeholder="Enter Your Email"
                        />
                    </p>
                    <p>
                        <label htmlFor="type">Type</label>
                        <input id="type" type="text" name="type" required
                               defaultValue={inputData ? inputData.type : ''}
                               placeholder="Enter Type"
                        />
                    </p>
                    <p>
                        <label htmlFor="alias">Alias</label>
                        <input id="alias" type="text" name="alias" required
                               defaultValue={inputData ? inputData.alias : ''}
                               placeholder="Enter Alias"
                        />
                    </p>
                    <p>
                        <label htmlFor="active">Active</label>
                        <select className="dropdown" id="active" name="active" required>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </p>
                    <p>
                        <label htmlFor="objectDetails">Object Details</label>
                    </p>
                    <p>
                        <label htmlFor="key1">Key 1</label>
                        <input id="key1" type="text" name="key1" required
                               defaultValue={inputData ? inputData.objectDetails.key1 : ''}
                               placeholder="Enter Object Detail"
                        />
                    </p>
                    <p>
                        <label htmlFor="key2">Key 2</label>
                        <input id="key2" type="text" name="key2"
                               defaultValue={inputData ? inputData.objectDetails.key2 : ''}
                               placeholder="Enter Object Detail"
                        />
                    </p>
                    <p>
                        <label htmlFor="key3">Key 3</label>
                        <input id="key3" type="text" name="key3"
                               defaultValue={inputData ? inputData.objectDetails.key3 : ''}
                               placeholder="Enter Object Detail"
                        />
                    </p>
                    <p>
                        <label htmlFor="key1">Key 4</label>
                        <input id="key4" type="text" name="key4"
                               defaultValue={inputData ? inputData.objectDetails.key4 : ''}
                               placeholder="Enter Object Detail"
                        />
                    </p>

                    <div className="actions">
                        <button type="button" onClick={cancelHandler}>
                            Cancel
                        </button>
                        <button disabled={isSubmitting}>{isSubmitting ? 'Submitting..' : 'Save'}</button>
                    </div>
                </form>)
            }
            {userRole !== 'SUPERAPP_USER' && (
                <div className="users">
                    <ErrorBlock title="An error occurred"
                                message={'Only superApp users are allowed to access this command'}/>
                </div>
            )}
        </>

    );
}