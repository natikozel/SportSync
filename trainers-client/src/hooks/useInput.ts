import React, {SetStateAction, useState} from "react";

export function useInput(initialValue: string, validationFunc: (value: string) => boolean) {
    const [enteredValue, setEnteredValue]: [string, React.Dispatch<SetStateAction<string>>]
        = useState(initialValue);
    const [didEdit, setDidEdit]: [boolean, React.Dispatch<SetStateAction<boolean>>]
        = useState(false);

    const valueIsInvalid = validationFunc(enteredValue)

    function handleInputChange(value: string) {
        setEnteredValue(value);
        setDidEdit(false);
    }

    function handleInputBlur() {
        setDidEdit(true);
    }

    return {
        enteredValue,
        handleInputChange,
        handleInputBlur,
        didEdit,
        valueIsInvalid
    }
}