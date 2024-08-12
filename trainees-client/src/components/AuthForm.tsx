import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {userActions} from "../store/user-slice";
import ErrorBlock from "./UI/ErrorBlock";
import {RootState} from "../store";

export default function AuthForm(): React.JSX.Element {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const superapp: any = useSelector((state: RootState) => state.superapp.superapp);

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(userActions.setEmail(event.target.value));
        dispatch(userActions.setUserSuperapp(superapp));
    }, [dispatch, superapp]);

    const userEmail = useSelector((state: any) => state.user.email);

    function handleSubmit() {
        navigate(`${superapp}/${userEmail}`);
    }

    return (
        <>
            {superapp === null ? (
                <div className="users">
                    <ErrorBlock title="An error occurred"
                                message={'Please enter the Home tab and select super app before logging in as a user'}/>
                </div>
            ) : (
                <div className="form">
                    <p>
                        <label htmlFor="miniApp">Email</label>
                        <input id="email" type="email" name="email" required
                               placeholder="Enter Your Email" onChange={handleInputChange}
                        />
                    </p>
                    <div className="actions">
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            )
            }
        </>
    );
}