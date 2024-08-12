import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {QueryClientProvider} from "@tanstack/react-query";

import {queryClient} from "./util/http";
import {loaderEmailUser} from "./util/auth";
import RootLayout from "./components/RootsLayout/RootLayout";
import RootAdminLayout from "./components/RootsLayout/RootAdminLayout"
import RootUsersLayout from "./components/RootsLayout/RootUsersLayout";
import RootObjectsLayout from "./components/RootsLayout/RootObjectsLayout";
import HomePage from "./components/HomePage";
import AuthForm from "./components/AuthForm";
import Users from "./components/UserAPI/Users";
import UserDetails from "./components/UserAPI/UserDetails";
import Objects from "./components/ObjectAPI/Objects";
import NewObject from "./components/ObjectAPI/NewObject";
import ObjectDetails from "./components/ObjectAPI/ObjectDetails";
import EditObjectDetails from "./components/ObjectAPI/EditObjectDetails";
import ObjectsSearching from "./components/ObjectAPI/ObjectsSearching";
import SearchingResults from "./components/ObjectAPI/SearchingResults";
import InvokeCommand from "./components/CommandAPI/InvokeCommand";
import Command from "./components/CommandAPI/Command";
import AllCommands from "./components/CommandAPI/AllCommands";
import MiniAppCommands from "./components/CommandAPI/MiniAppCommands";
import CommandDetails from "./components/CommandAPI/CommandDetails";
import DataManagement from "./components/AdminAPI/DataManagement";
import ErrorBlock from "./components/UI/ErrorBlock";

import NewTrainee from "./components/Trainee/NewTrainee";
import EditTraineeDetails from "./components/Trainee/EditTraineeDetails";
import TrainersList from "./components/Trainee/TrainersList";
import RequestsList from "./components/Trainee/RequestsList";
import TrainerDetails from "./components/Trainee/TrainerDetails";
import RequestDetail from "./components/Trainee/RequestDetail";
import ReviewsList from "./components/Trainee/ReviewsList";

export const SUPERAPP_NAME: string = '2024a.yarinmanoah'

const router = createBrowserRouter([
    {
        path: '/',
        id: 'root',
        element: <RootLayout/>,
        loader: loaderEmailUser,
        children: [
            {index: true, element: <HomePage/>},
            {path: 'errorPage', element: <ErrorBlock title={"An error occurred"} message={"ObjectId does not exist"}/>},
            {
                path: 'superapp',
                children: [
                    {
                        path: 'users',
                        element: <RootUsersLayout/>,
                        children: [
                            {
                                index: true,
                                element: <NewTrainee/>
                            },
                            {
                                path: 'trainers',
                                element: <TrainersList/>
                            },
                            {
                                path: 'trainerDetails/:id',
                                element: <TrainerDetails/>
                            },
                            {
                                path: 'requests',
                                children: [
                                    {
                                        index: true,
                                        element: <RequestsList/>
                                    },
                                    {
                                        path: 'requestDetail/:id',
                                        element: <RequestDetail/>
                                    }
                                ]
                            },
                            {
                                path: 'reviews',
                                element: <ReviewsList/>
                            },
                            {
                                path: 'login',
                                element: <AuthForm/>
                            },
                            {
                                path: `login/${SUPERAPP_NAME}/:email`,
                                element: <UserDetails/>
                            },
                            {
                                path: `${SUPERAPP_NAME}/:email`,
                                element: <EditTraineeDetails/>
                            }
                        ]
                    },
                    {
                        path: 'admin',
                        element: <RootAdminLayout/>,
                        children: [
                            {
                                path: 'users',
                                element: <Users/>,
                            },
                            {
                                path: 'miniapp',
                                children: [
                                    {
                                        index: true,
                                        element: <AllCommands/>
                                    },
                                    {
                                        path: ':miniAppName',
                                        children: [
                                            {
                                                index: true,
                                                element: <MiniAppCommands/>,
                                            },
                                            {
                                                path: ':commandId',
                                                element: <CommandDetails/>
                                            }
                                        ]
                                    },
                                ]
                            },
                            {
                                path: 'deletion',
                                element: <DataManagement/>
                            }
                        ]
                    },
                    {
                        path: 'objects',
                        element: <RootObjectsLayout/>,
                        children: [
                            {
                                index: true,
                                element: <Objects/>
                            },
                            {
                                path: 'create',
                                element: <NewObject/>
                            },
                            {
                                path: `${SUPERAPP_NAME}/:id`,
                                element: <ObjectDetails/>
                            },
                            {
                                path: `${SUPERAPP_NAME}/:id/edit`,
                                element: <EditObjectDetails/>
                            },
                            {
                                path: `search`,
                                children: [
                                    {
                                        index: true,
                                        element: <ObjectsSearching/>,
                                    },
                                    {
                                        path: ':searchBy',
                                        element: <SearchingResults/>
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        path: 'miniapp',
                        children: [
                            {
                                index: true,
                                element: <Command/>
                            },
                            {
                                path: `:miniAppName`,
                                element: <InvokeCommand/>
                            }
                        ]
                    },
                ]
            }
        ]
    }
]);

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    );
}
