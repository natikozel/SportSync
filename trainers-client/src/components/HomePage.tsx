import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";

import {superappActions} from "../store/superapp-slice";

export default function HomePage(): React.JSX.Element {

    const dispatch = useDispatch();
    const superapp = useSelector((state: any) => state.superapp.superapp);
    const superappSubmitted = useSelector((state: any) => state.superapp.submitted);

    function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault()
        dispatch(superappActions.setSubmitted(true));
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        dispatch(superappActions.setSuperapp(data.superapp));
    }


    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(superappActions.setSuperapp(event.target.value));
        dispatch(superappActions.setSubmitted(false));
    }, [dispatch]);

    return (
        <>
            {/*<div className="center">*/}
            {/*    <h1>Welcome to the Super App -  {superappSubmitted ? `${superapp}` : ''}</h1>*/}
            {/*    <h3>Enjoy from the new client, I would love to receive a review!</h3>*/}
            {/*</div>*/}
            {/*<div className="form">*/}
            {/*    <p>*/}
            {/*        <label htmlFor="superapp">Please choose a SuperApp Name</label>*/}
            {/*        <input id="superapp" type="text" name="superapp" required onChange={handleInputChange}*/}
            {/*               placeholder="Enter SuperApp Name"*/}
            {/*        />*/}
            {/*    </p>*/}
            {/*    <div className="actions">*/}
            {/*        <button onClick={handleSubmit}>Submit</button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="center">
                <h1>Welcome to the Super App - {superappSubmitted ? `${superapp}` : ''}</h1>
                <h3>Enjoy from the new client, I would love to receive a review!</h3>
            </div>

            <form className="form" onSubmit={handleSubmit}>
                <div className={"margin-bottom-class"}>
                    <label htmlFor="superapp">Please choose a SuperApp Name</label>
                    <select name={"superapp"} id={"superapp"} className={"select-box"}>
                        <option value="2024a.yarinmanoah">2024a.yarinmanoah</option>
                    </select>
                </div>
                <div className="actions">
                    <button >Submit</button>
                </div>
            </form>
        </>
    );
}