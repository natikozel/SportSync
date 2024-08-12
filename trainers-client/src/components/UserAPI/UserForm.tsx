import React from "react";
import {useNavigate, useNavigation} from 'react-router-dom';

interface UserFormProps {
    inputData?: any;
    onSubmit: (data: any) => void;
    children?: React.ReactNode;
    editForm: boolean;
}

export default function UserForm({inputData, onSubmit, editForm}: UserFormProps): React.JSX.Element {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    function cancelHandler() {
        navigate('/');
    }

    function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        // if (data.username.toString().trim() === '' || data.avatar.toString().trim() === '' ||
        //     !data.email.toString().includes('@')) {
        //     console.log("The data received is incorrect, please try again.");
        //     return;
        // }
        // If it arrived here, then the data is correct

        if (onSubmit) {
            onSubmit({...data});
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            {!editForm && <p>
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" name="email" required
                       defaultValue={inputData ? inputData.userId.email : ''}
                       placeholder="Enter Your Email"
                />
            </p>}
            {editForm && <p className="user-detail">Updating user details</p>}
            <p>
                <label htmlFor="username">User Name</label>
                <input id="username" type="text" name="username" required
                       defaultValue={inputData ? inputData.username : ''}
                       placeholder="Enter User Name"
                />
            </p>
            <p>
                <label htmlFor="avatar">Avatar</label>
                <input id="avatar" type="text" name="avatar" required
                       defaultValue={inputData ? inputData.avatar : ''}
                       placeholder="Enter Your Avatar"
                />
            </p>
            <p>
                <label htmlFor="role">Role</label>
                <select className="dropdown" id="role" name="role" defaultValue={inputData ? inputData.role : ''}
                        required>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPERAPP_USER">SuperApp User</option>
                    <option value="MINIAPP_USER">MiniApp User</option>
                </select>
            </p>
            <div className="actions">
                <button type="button" onClick={cancelHandler}>
                    Cancel
                </button>
                <button disabled={isSubmitting}>{isSubmitting ? 'Submitting..' : 'Save'}</button>
            </div>
        </form>
    );
}