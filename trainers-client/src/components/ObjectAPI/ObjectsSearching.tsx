import React from "react";
import {useSelector} from "react-redux";

import ErrorBlock from "../UI/ErrorBlock";
import SearchingBy from "../UI/SearchingBy";

export default function ObjectsSearching(): React.JSX.Element {
    const userRole = useSelector((state: any) => state.user.role);
    const condition = (userRole === 'SUPERAPP_USER') || (userRole === 'MINIAPP_USER');

    return (
        <>
            {condition ? (
                <>
                    <SearchingBy
                        title={'Search Objects By Type'}
                        labelSearch={'Object Type'}
                        idAndName={'type'}
                        placeholder={'Enter Type Object'}
                    />
                    <SearchingBy
                        title={'Search Objects By Exact Alias'}
                        labelSearch={'Object Alias'}
                        idAndName={'alias'}
                        placeholder={'Enter Alias Object'}
                    />
                    <SearchingBy
                        title={'Search Objects By Alias Pattern'}
                        labelSearch={'Object Alias Pattern'}
                        idAndName={'aliasPattern'}
                        placeholder={'Enter Alias Pattern Object'}
                    />
                </>
            ) : (
                <div className="users">
                    <ErrorBlock title="An error occurred"
                                message={'Only superApp users are allowed to access this command'}/>
                </div>)
            }
        </>
    );
}