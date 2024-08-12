import React from "react";
import {useMutation} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";

import {handleStatusRequest} from "../../util/http";

export default function RequestDetail(): React.JSX.Element {
    const params = useParams();
    const navigate = useNavigate();
    const userEmail = useSelector((state: any) => state.user.email);
    const userSuperapp = useSelector((state: any) => state.user.userSuperapp);
    const superapp = useSelector((state: any) => state.superapp.superapp);
    const requestsObjects = useSelector((state: any) => state.object.requestsData);
    const specificRequest = requestsObjects.find((req: any) => req.objectId.id === params.id);

    const {mutate: updateStatusRequest} = useMutation({
        mutationFn: handleStatusRequest,
        onSuccess: () => {
            navigate('/superapp/users/requests/pending');
        }
    });

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        const requestId = specificRequest.objectId.id;
        const decisionRequest = event.currentTarget.value;
        const updatedRequest = {
            objectDetails: {
                requestDetails: {
                    desiredDate: specificRequest.objectDetails.requestDetails.desiredDate,
                    desiredHour: specificRequest.objectDetails.requestDetails.desiredHour
                },
                isAccepted: decisionRequest,
                traineeData: specificRequest.objectDetails.traineeData
            }
        }
        updateStatusRequest({
            updatedRequestObject: updatedRequest,
            requestId: requestId,
            userEmail: userEmail,
            userSuperapp: userSuperapp,
            superapp: superapp
        });
    }

    let content;
    content = (
        <>
            <div id="event-details-content">
                <div id="event-details-info">
                    <div id="event-details-description">
                        <p>Trainee E-Mail: <span className="category-value">{specificRequest.createdBy.userId.email}</span>
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
            <div className={"form-actions"}>
                <label>Click Accept or Reject to change the request status</label>
                <div className={"new-actions"}>
                    <button value="ACCEPTED" onClick={handleSubmit}>Accept</button>
                    <button value="DENIED" onClick={handleSubmit}>Reject</button>
                </div>
            </div>
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