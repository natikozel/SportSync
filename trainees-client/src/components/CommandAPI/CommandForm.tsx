import React from 'react';
import {useNavigate, useNavigation} from 'react-router-dom';
import {useSelector} from "react-redux";
// import {useQuery} from "@tanstack/react-query";

// import {fetchObjects} from "../../util/http";

interface CommandFormProps {
    inputData?: any;
    onSubmit: (data: any) => void;
    children?: React.ReactNode;
    editForm: boolean;
}

export default function CommandForm({inputData, onSubmit, editForm}: CommandFormProps): React.JSX.Element {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const superapp = useSelector((state: any) => state.superapp.superapp);
    const isSubmitting = navigation.state === 'submitting';

    // const {data, isPending, isError, error} = useQuery({
    //     queryKey: ['objects'],
    //     queryFn: ({signal}) => fetchObjects({signal, email: userEmail}),
    //     enabled: condition,
    // });

    function cancelHandler() {
        navigate('/');
    }

    function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.target);

        // const keyArray: Array<FormDataEntryValue> = formData.getAll("key");
        const valueOfFormData: any = Object.fromEntries(formData);
        console.log(valueOfFormData)

        const commandData = {
            commandId: {
                superApp: superapp,
                miniApp: "dummyApp",
                id: "17"
            },
            command: valueOfFormData.command,
            targetObject: {
                objectId: {
                    superapp: superapp,
                    id: valueOfFormData.objectId
                }
            },
            invokedBy: {
                userId: {
                    superapp: superapp,
                    email: valueOfFormData.email
                }
            },
            commandAttributes: {
                key1: formData.get("key1"),
                key2: formData.get("key2"),
                key3: formData.get("key3"),
                key4: formData.get("key4")
            }
        }

        console.log({...commandData});

        if (valueOfFormData.command.toString().trim() === '' ||
            !valueOfFormData.email.toString().includes('@')) {
            console.log("The data received is incorrect, please try again.");
            return;
        }
        // If it arrived here, then the data is correct

        if (onSubmit) {
            onSubmit({...commandData});
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <p>
                <label htmlFor="email">Email User</label>
                <input id="email" type="email" name="email" required
                       placeholder="Enter Your Email"
                />
            </p>
            <p>
                <label htmlFor="command">Command</label>
                <input id="command" type="text" name="command" required
                       placeholder="Enter Command"
                />
            </p>
            <p>
                <label htmlFor="commandAttributes">Command Attributes</label>
            </p>
            <p>
                <label htmlFor="key1">Key 1</label>
                <input id="key1" type="text" name="key1" required
                       placeholder="Enter Attribute"
                />
            </p>
            <p>
                <label htmlFor="key2">Key 2</label>
                <input id="key2" type="text" name="key2"
                       placeholder="Enter Attribute"
                />
            </p>
            <p>
                <label htmlFor="key3">Key 3</label>
                <input id="key3" type="text" name="key3"
                       placeholder="Enter Attribute"
                />
            </p>
            <p>
                <label htmlFor="key1">Key 4</label>
                <input id="key4" type="text" name="key4"
                       placeholder="Enter Attribute"
                />
            </p>

            <p>
                <label htmlFor="objectId">Object ID</label>
                <input id="objectId" type="text" name="objectId" required
                       placeholder="Enter ObjectId"
                />
            </p>

            {/*<p>*/}
            {/*    <label htmlFor="role">Object</label>*/}
            {/*    <select className="dropdown" id="role" name="role"*/}
            {/*            required>*/}
            {/*        <option value="ADMIN">Admin</option>*/}
            {/*        <option value="SUPERAPP_USER">SuperApp User</option>*/}
            {/*        <option value="MINIAPP_USER">MiniApp User</option>*/}
            {/*    </select>*/}
            {/*</p>*/}
            <div className="actions">
                <button type="button" onClick={cancelHandler}>
                    Cancel
                </button>
                <button disabled={isSubmitting}>{isSubmitting ? 'Submitting..' : 'Save'}</button>
            </div>
        </form>
    );
}