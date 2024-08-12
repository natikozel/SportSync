import React, {ChangeEvent} from "react";
import {useMutation} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";

import {handleDeactivateRequest} from "../../util/http";

export default function RequestDetail(): React.JSX.Element {
    const params = useParams();
    const userEmail = useSelector((state: any) => state.user.email);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);
    const superapp = useSelector((state: any) => state.superapp.superapp);
    const requestsObjects = useSelector((state: any) => state.object.requestsData);

    const specificRequest = requestsObjects.find((req: any) => req.objectId.id === params.id);

    const navigate = useNavigate();

    const {mutate: removeRequest} = useMutation({
        mutationFn: handleDeactivateRequest,
        onSuccess: () => {
            navigate('/superapp/users/requests');
        }
    });

    function handleSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        const requestId = specificRequest.objectId.id;
        removeRequest({
            updatedRequestObject: specificRequest,
            requestId: requestId,
            userEmail: userEmail,
            userSuperapp: userSuperapp,
            superapp: superapp
        })

    }

    let content;
    content = (
        <>
            <div id="event-details-content">
                <div id="event-details-info">
                    <div id="event-details-description">
                        <p>Trainer E-Mail: <span className="category-value">{specificRequest.alias}</span>
                        </p>
                        <p>Date: <span
                            className="category-value">{specificRequest.objectDetails.requestDetails.desiredDate}</span>
                        </p>
                        <p>Hour: <span
                            className="category-value">{specificRequest.objectDetails.requestDetails.desiredHour}</span>
                        </p>
                        <p>isAccepted: <span
                            className="category-value">{specificRequest.objectDetails.isAccepted}</span>
                        </p>
                        <p>Active: <span
                            className="category-value">{specificRequest.active.toString()}</span>
                        </p>
                    </div>
                </div>
            </div>
            <form className={"form"} onSubmit={handleSubmit}>
                <label>Click on Deactivate to remove the request</label>
                <div className={"actions"}>
                    <button>Deactivate</button>
                </div>
            </form>
        </>
    );

    return (
        <>
            <header className="header-title-without-nav">
                <h1>Request Details</h1>
            </header>

            {content}
        </>
    );
}