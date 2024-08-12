import React, {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {searchActions} from "../../store/search-slice";

interface SearchingProps {
    title: string,
    labelSearch: string,
    idAndName: string,
    placeholder: string,
}

export default function SearchingBy({title, labelSearch, idAndName, placeholder}: SearchingProps): React.JSX.Element {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const searchValue = useSelector((state: any) => state.search.searchValue);

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(searchActions.setSearchBy(idAndName));
        dispatch(searchActions.setSearchValue(event.target.value));
    }, [dispatch, idAndName]);

    function handleSubmit() {
        navigate(`${searchValue}`);
    }

    return (
        <>
            <h1 className="center">{title}</h1>
            <div className="form">
                <p>
                    <label htmlFor="miniApp">{labelSearch}</label>
                    <input id={idAndName} type="text" name={idAndName} required
                           placeholder={placeholder} onChange={handleInputChange}
                    />
                </p>
                <div className="actions">
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </>
    );
}