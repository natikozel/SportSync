import {QueryClient} from "@tanstack/react-query";

export const queryClient: QueryClient = new QueryClient();

interface UserAPI {
    signal?: AbortSignal,
    email?: string,
    user?: any,
    superapp?: string,
    userSuperapp?: string
}

interface ObjectAPI {
    signal?: AbortSignal,
    id?: string,
    object?: any,
    email?: string,
    type?: string,
    alias?: string,
    searchBy?: string,
    searchValue?: string,
    superapp?: string,
    userSuperapp?: string
}

interface Commands {
    signal?: AbortSignal,
    miniAppName: any,
    commandData?: any,
    email?: string,
    superapp?: string,
    userSuperapp?: string
}

export interface MyError {
    error: Error,
    code: number,
    info: any
}

interface TrainerCreation {
    formData: any,
    userSuperApp: any
}

interface SendRequestAndReview {
    superapp: string,
    updateTrainerObject: any,
    userEmail: string,
    userSuperapp: string,
    trainerId: string,
    trainerEmail: string,
    date?: any,
    hour?: any,
    review?: any,
    traineeData?: any
}

interface RemoveRequest {
    updatedRequestObject: any,
    requestId: string,
    superapp: string,
    userEmail: string,
    userSuperapp: string
}

interface UpdateUserAndObject {
    superapp: string,
    updateTraineeObject: any,
    userEmail: any,
    userSuperapp: string,
    traineeId: string,
}

async function readableStreamToJson(response: Response) {
    const resData = await response.text();

    const temp = resData.replaceAll("data:", "").split("\n\n");
    temp.pop();

    const finalData = temp.map((item: any) => JSON.parse(item));
    return finalData;
}

function insertToLocalStorage(userEmail: string) {
    localStorage.setItem('email', userEmail);

    const expiration: Date = new Date();
    expiration.setHours(expiration.getHours() + 1);
    localStorage.setItem('expiration', expiration.toISOString());
}

export function removeFromLocalStorage() {
    localStorage.removeItem('email');
    localStorage.removeItem('expiration');
}

export async function handleTraineeCreation({formData, userSuperApp}: TrainerCreation) {
    const userData = await createNewUser(formData.userData);
    const newUserData = {
        email: formData.userData.email,
        username: formData.userData.username,
        avatar: formData.userData.avatar,
        role: "SUPERAPP_USER"
    }
    await updateUser({email: formData.userData.email, user: newUserData, superapp: userSuperApp});

    const traineeObject = {
        objectId: {
            superapp: userSuperApp,
            id: "1"
        },
        createdBy: {
            userId: {
                superapp: userSuperApp,
                email: newUserData.email
            }
        },
        type: "Trainee",
        alias: newUserData.email,
        active: true,
        objectDetails: {
            traineeData: formData.traineeData,
        }
    }
    const objectData = await createNewObject(traineeObject);
    newUserData.role = "MINIAPP_USER";
    await updateUser({email: formData.userData.email, user: newUserData, superapp: userSuperApp});

    return {
        userData,
        objectData
    };
}

export async function handleUpdateTrainee({updateTraineeObject, userEmail, userSuperapp, traineeId, superapp}: UpdateUserAndObject) {
    const newUserData = {
        email: updateTraineeObject.userData.email,
        username: updateTraineeObject.userData.username,
        avatar: updateTraineeObject.userData.avatar,
        role: "SUPERAPP_USER"
    }
    await updateUser({email: userEmail, user: newUserData, superapp: userSuperapp});
    await updateObject({object: {
        objectDetails: {
            traineeData: {
                ...updateTraineeObject.traineeData
            }
        }
        }, id: traineeId, email: userEmail, superapp: superapp, userSuperapp: userSuperapp});
    await updateUser({email: userEmail, user: {role: "MINIAPP_USER"}, superapp: userSuperapp});
}

export async function handleDateSubmit({updateTrainerObject, userEmail, userSuperapp, trainerId, trainerEmail, superapp, date, hour, traineeData}: SendRequestAndReview) {
    await updateUser({email: userEmail, user: {role: "SUPERAPP_USER"}, superapp: userSuperapp});
    await updateObject({object: updateTrainerObject, id: trainerId, email: userEmail, superapp: superapp, userSuperapp: userSuperapp});

    const requestObject = {
        type: "Request",
        alias: trainerEmail,
        active: true,
        createdBy: {
            userId: {
                superapp: superapp,
                email: userEmail
            }
        },
        objectDetails: {
            requestDetails: {
                desiredDate: date,
                desiredHour: hour,
            },
            isAccepted: "PENDING",
            traineeData: traineeData
        }
    }
    const resData = await createNewObject(requestObject);
    await updateUser({email: userEmail, user: {role: "MINIAPP_USER"}, superapp: userSuperapp});
    return resData;
}

export async function handleReviewSubmit({updateTrainerObject, userEmail, userSuperapp, trainerId, trainerEmail, superapp, review}: SendRequestAndReview) {
    await updateUser({email: userEmail, user: {role: "SUPERAPP_USER"}, superapp: userSuperapp});
    await updateObject({object: updateTrainerObject, id: trainerId, email: userEmail, superapp: superapp, userSuperapp: userSuperapp});

    const reviewObject = {
        type: "Review",
        alias: trainerEmail,
        active: true,
        createdBy: {
            userId: {
                superapp: superapp,
                email: userEmail
            }
        },
        objectDetails: {
            reviewData: review
        }
    }
    await createNewObject(reviewObject);
    await updateUser({email: userEmail, user: {role: "MINIAPP_USER"}, superapp: userSuperapp});
}

export async function handleDeactivateRequest({updatedRequestObject, requestId, userEmail, userSuperapp, superapp}: RemoveRequest) {
    await updateUser({email: userEmail, user: {role: "SUPERAPP_USER"}, superapp: userSuperapp});
    await updateObject({object: {active: false}, id: requestId, email: userEmail, superapp: superapp, userSuperapp: userSuperapp});
    let url: string = `http://localhost:8085/superapp/objects/search/byType/Trainer?userSuperapp=${userSuperapp}&userEmail=${userEmail}`;
    const trainer = (await readableStreamToJson((await fetch(url)))).find((i: any) => i.alias === updatedRequestObject.alias);
    console.log(trainer)
    const trainerId = trainer.objectId.id;
    await updateObject({object: {
        objectDetails: {
            ...trainer.objectDetails,
            schedule: [
                ...trainer.objectDetails.schedule.filter((i: any) => i.hour !== updatedRequestObject.objectDetails.requestDetails.desiredHour)
            ]
        }
        }, id: trainerId, email: userEmail, superapp: superapp, userSuperapp: userSuperapp});
    await updateUser({email: userEmail, user: {role: "MINIAPP_USER"}, superapp: userSuperapp});
}

export async function createNewUser(userData: any) {
    const response = await fetch(`http://localhost:8085/superapp/users`, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        // const errorObj: MyError = {
        //     error: new Error('An error occurred while fetching the users'),
        //     code: response.status,
        //     info: await response.json(),
        // }
       throw await response.json();
    }

    const resData = await response.json();
    console.log(resData)
    return resData;
}

export async function fetchUsers({signal, email, userSuperapp}: UserAPI) {
    let url: string = `http://localhost:8085/superapp/admin/users?userSuperapp=${userSuperapp}&userEmail=${email}`;

    const response = await fetch(url, {signal: signal});

    if (!response.ok) {
        const errorObj: MyError = {
            error: new Error('An error occurred while fetching the users'),
            code: response.status,
            info: await response.text(),
        }
        throw errorObj;
    }

    const finalData = readableStreamToJson(response);

    return finalData;
}

export async function fetchUser({signal, email, superapp}: UserAPI) {

    let url: string = `http://localhost:8085/superapp/users/login/${superapp}/${email}`;

    const response = await fetch(url, {signal: signal});

    if (!response.ok) {
        const errorObj: MyError = {
            error: new Error('An error occurred while fetching the users'),
            code: response.status,
            info: await response.json(),
        }
        throw errorObj;
    }

    const resData = await response.json();

    insertToLocalStorage(resData.userId.email);

    return resData;
}

export async function updateUser({user, email, superapp}: UserAPI) {
    let url: string = `http://localhost:8085/superapp/users/${superapp}/${email}`;

    console.log(user)
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorObj: MyError = {
            error: new Error('An error occurred while updating the user'),
            code: response.status,
            info: await response.json(),
        }
        throw errorObj;
    }
}

export async function deleteAllUsers({email, userSuperapp}: UserAPI) {

    let url: string = `http://localhost:8085/superapp/admin/users?userSuperapp=${userSuperapp}&userEmail=${email}`;


    const response = await fetch(url, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorObj: MyError = {
            error: new Error('An error occurred while deleting the event'),
            code: response.status,
            info: await response.json(),
        }
        throw errorObj;
    }
    removeFromLocalStorage();
    return response.json();
}

export async function deleteAllObjects({email, userSuperapp}: UserAPI) {

    let url: string = `http://localhost:8085/superapp/admin/objects?userSuperapp=${userSuperapp}&userEmail=${email}`;

    const response = await fetch(url, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorObj: MyError = {
            error: new Error('An error occurred while deleting the event'),
            code: response.status,
            info: await response.json(),
        }
        throw errorObj;
    }

    return response.json();
}

export async function deleteAllCommands({email, userSuperapp}: UserAPI) {

    let url: string = `http://localhost:8085/superapp/admin/miniapp?userSuperapp=${userSuperapp}&userEmail=${email}`;

    const response = await fetch(url, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorObj: MyError = {
            error: new Error('An error occurred while deleting the event'),
            code: response.status,
            info: await response.json(),
        }
        throw errorObj;
    }

    return response.json();
}

export async function fetchObjects({signal, email, userSuperapp}: ObjectAPI) {
    let url: string = `http://localhost:8085/superapp/objects?userSuperapp=${userSuperapp}&userEmail=${email}`;

    const response = await fetch(url, {signal: signal});

    if (!response.ok) {
        const errorObj: MyError = {
            error: new Error('An error occurred while fetching the objects'),
            code: response.status,
            info: await response.json(),
        }
        throw errorObj;
    }

    const finalData = readableStreamToJson(response);

    return finalData;
}

export async function createNewObject(objectData: any) {

    const response = await fetch(`http://localhost:8085/superapp/objects`, {
        method: 'POST',
        body: JSON.stringify(objectData),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorObj: MyError = {
            error: new Error('An error occurred while fetching the objects'),
            code: response.status,
            info: await response.json(),
        }
        throw errorObj;
    }

    const resData = await response.json();
    console.log(resData)
    return resData;
}

export async function fetchObject({signal, id, email, superapp, userSuperapp}: ObjectAPI) {

    let url: string = `http://localhost:8085/superapp/objects/${superapp}/${id}?userSuperapp=${userSuperapp}&userEmail=${email}`;

    const response = await fetch(url, {signal: signal});

    if (!response.ok) {
        const errorObj: MyError = {
            error: new Error('An error occurred while fetching the users'),
            code: response.status,
            info: await response.json(),
        }
        throw errorObj;
    }

    const resData = await response.json();
    console.log(resData)
    return resData;
}

export async function updateObject({object, id, email, superapp, userSuperapp}: ObjectAPI) {
    let url: string = `http://localhost:8085/superapp/objects/${superapp}/${id}?userSuperapp=${userSuperapp}&userEmail=${email}`;
    console.log(object)
    console.log(id)
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(object),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorObj: MyError = {
            error: new Error('An error occurred while updating the object'),
            code: response.status,
            info: await response.json(),
        }
        throw errorObj;
    }
}

export async function createNewCommand({miniAppName, commandData}: Commands) {
    const response = await fetch(`http://localhost:8085/superapp/miniapp/${miniAppName}`, {
        method: 'POST',
        body: JSON.stringify(commandData),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorObj: MyError = {
            error: new Error('An error occurred while fetching the users'),
            code: response.status,
            info: await response.json(),
        }
        throw errorObj;
    }

    const resData = await response.json();

    return resData;
}

export async function fetchCommands({signal, email, userSuperapp}: UserAPI) {
    let url: string = `http://localhost:8085/superapp/admin/miniapp?userSuperapp=${userSuperapp}&userEmail=${email}`;

    const response = await fetch(url, {signal: signal});

    if (!response.ok) {
        const errorObj: MyError = {
            error: new Error('An error occurred while fetching the commands'),
            code: response.status,
            info: await response.json(),
        }
        throw errorObj;
    }

    const finalData = readableStreamToJson(response);

    return finalData;
}

export async function fetchSpecificCommands({signal, miniAppName, email, userSuperapp}: Commands) {
    let url: string = `http://localhost:8085/superapp/admin/miniapp/${miniAppName}?userSuperapp=${userSuperapp}&userEmail=${email}`;

    const response = await fetch(url, {signal: signal});

    if (!response.ok) {
        const errorObj: MyError = {
            error: new Error('An error occurred while fetching the commands'),
            code: response.status,
            info: await response.json(),
        }
        throw errorObj;
    }

    const finalData = readableStreamToJson(response);

    return finalData;
}

export async function fetchObjectsBy({signal, email, searchBy, searchValue, userSuperapp}: ObjectAPI) {

    let by;
    if (searchBy === 'type') {
        by = 'byType';
    } else if (searchBy === 'alias') {
        by = 'byAlias'
    } else {
        by = 'byAliasPattern'
    }

    let url: string = `http://localhost:8085/superapp/objects/search/${by}/${searchValue}?userSuperapp=${userSuperapp}&userEmail=${email}`;

    const response = await fetch(url, {signal: signal});

    if (!response.ok) {
        const errorObj: MyError = {
            error: new Error('An error occurred while fetching the commands'),
            code: response.status,
            info: await response.json(),
        }
        throw errorObj;
    }

    const finalData = readableStreamToJson(response);
    return finalData;
}