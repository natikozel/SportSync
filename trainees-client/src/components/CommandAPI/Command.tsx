import React, {useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from "react-redux";

import ErrorBlock from "../UI/ErrorBlock";

export default function Command(): React.JSX.Element {
    const userRole = useSelector((state: any) => state.user.role);
    const miniAppName = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    function handleSubmit() {
        navigate(`${miniAppName.current?.value}`);
    }

    let content;

    if (userRole === 'MINIAPP_USER') {
        content = (
            <>
                <h2 className="center">To invoke a new command, please choose MiniApp</h2>
                <div className="form">
                    <p>
                        <label htmlFor="miniApp">MiniApp Name</label>
                        <input id="miniApp" type="text" name="miniApp" required ref={miniAppName}
                               placeholder="Enter MiniApp Name"
                        />
                    </p>
                    <div className="actions">
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
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