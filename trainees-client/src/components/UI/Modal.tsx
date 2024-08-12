import React, {RefObject, useEffect, useRef} from "react";
import {createPortal} from "react-dom";

interface ModalProps {
    children: React.ReactNode
    onClose: (() => void) | undefined
}

export default function Modal({children, onClose}: ModalProps): React.JSX.Element {
    const dialog: RefObject<HTMLDialogElement> = useRef(null);


    useEffect(() => {
        const modal = dialog.current;
        modal?.showModal();


        return () => {
            modal?.close();  // needed to avoid error being thrown
            console.log("modal closed");
        };
    }, []);

    return createPortal(
        <dialog className="modal" ref={dialog} onClose={onClose}>
            {children}
        </dialog>,
        document.getElementById('modal') as HTMLElement
    );
}