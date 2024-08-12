import React from "react";
import {useNavigate, useNavigation} from 'react-router-dom';
import {useSelector} from "react-redux";

import InputForm from "../UI/InputForm";
import {RootState} from "../../store";

interface TraineeFormProps {
    inputData?: any;
    onSubmit: (data: any) => void;
    children?: React.ReactNode;
    editForm: boolean;
    errMsg?: string
}

export default function TrainerForm({inputData, onSubmit, editForm, errMsg}: TraineeFormProps): React.JSX.Element {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';
    const userEmail: any = useSelector((state: RootState) => state.user.email);
    const userType = useSelector((state: any) => state.user.type);
    let updateTrainerData: any;

    function cancelHandler() {
        navigate('/');
    }

    function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        const userData = {
            email: editForm ? userEmail : data.email,
            username: data.username,
            avatar: data.avatar,
            role: "MINIAPP_USER"
        }

        const trainerData = {
            fullName: data.fullName,
            location: data.location,
            phoneNumber: data.phoneNumber,
            sportStyle: data.sportStyle,
            price: data.price,
            population: data.population,
            bio: data.bio
        }
        console.log(userData);
        console.log(trainerData);

        const createTrainerData = {
            userData,
            trainerData
        }
        if (userType) {
            updateTrainerData = {
                userData,
                trainerData,
                reviewData: [
                    ...userType.objectDetails.reviewData
                ],
                schedule: [
                    ...userType.objectDetails.schedule
                ]
            }
        }


        // if (data.username.toString().trim() === '' || data.avatar.toString().trim() === '' ||
        //     !data.email.toString().includes('@')) {
        //     console.log("The data received is incorrect, please try again.");
        //     return;
        // }

        // If it arrived here, then the data is correct
        if (onSubmit) {
            if (userType) {
                onSubmit({...updateTrainerData});
            } else {
                onSubmit({...createTrainerData});
            }
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            {!!errMsg ?
                <h4 style={{color: "red", margin: 0, textAlign: "center", fontSize: "20px"}}>{errMsg}</h4> : null}
            {!editForm &&
                <InputForm label={"E-mail"} htmlFor_id_name={"email"} type={"email"} placeholder={"Enter Your Email"}
                           defaultValue={inputData ? inputData.userData.userId.email : ''}/>}
            {editForm && <p className="user-detail">Updating user details</p>}
            <InputForm label={"User Name"} htmlFor_id_name={"username"} type={"text"} placeholder={"Enter User Name"}
                       defaultValue={inputData ? inputData.userData.username : ''}/>
            <InputForm label={"Avatar"} htmlFor_id_name={"avatar"} type={"text"} placeholder={"Enter Your Avatar"}
                       defaultValue={inputData ? inputData.userData.avatar : ''}/>
            <InputForm label={"Full Name"} htmlFor_id_name={"fullName"} type={"text"}
                       placeholder={"Enter Your Full Name"}
                       defaultValue={inputData ? inputData.dataType.objectDetails.trainerData.fullName : ''}/>
            <InputForm label={"Location"} htmlFor_id_name={"location"} type={"text"} placeholder={"Enter Your Location"}
                       defaultValue={inputData ? inputData.dataType.objectDetails.trainerData.location : ''}/>
            <InputForm label={"Phone-Number"} htmlFor_id_name={"phoneNumber"} type={"tel"}
                       placeholder={"Enter Your Phone-Number"}
                       defaultValue={inputData ? inputData.dataType.objectDetails.trainerData.phoneNumber : ''}/>
            <InputForm label={"Sport Style"} htmlFor_id_name={"sportStyle"} type={"text"}
                       placeholder={"Enter Your Sport Style"}
                       defaultValue={inputData ? inputData.dataType.objectDetails.trainerData.sportStyle : ''}/>
            <InputForm label={"Price"} htmlFor_id_name={"price"} type={"number"}
                       placeholder={"Enter Your Training Price"}
                       defaultValue={inputData ? inputData.dataType.objectDetails.trainerData.price : ''}/>
            <InputForm label={"Population"} htmlFor_id_name={"population"} type={"text"}
                       placeholder={"Enter Your Target Population"}
                       defaultValue={inputData ? inputData.dataType.objectDetails.trainerData.population : ''}/>
            <p>
                <label htmlFor={"bio"}>Bio</label>
                <textarea id={"bio"} name={"bio"} rows={3} cols={50}
                          defaultValue={inputData ? inputData.dataType.objectDetails.trainerData.bio : ''}/>
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