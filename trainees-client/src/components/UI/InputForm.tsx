import React from "react";

interface InputFormProps {
    label: string,
    htmlFor_id_name: string,
    type: string,
    placeholder: string,
    defaultValue?: any,
}

export default function InputForm({
                                      label,
                                      htmlFor_id_name,
                                      type,
                                      placeholder,
                                      defaultValue
                                  }: InputFormProps): React.JSX.Element {

    const condition = htmlFor_id_name === 'email' || htmlFor_id_name === 'username' || htmlFor_id_name === 'avatar';

    return (
        <p>
            <label htmlFor={htmlFor_id_name}>{label}</label>
            <input id={htmlFor_id_name} type={type} name={htmlFor_id_name} required={!condition}
                   defaultValue={defaultValue}
                   placeholder={placeholder}
            />
        </p>
    );
}