import { createContext, useState, useContext } from "react";

const UtilContext = createContext();

export function UtilData({ children }) {
    const [showSDash, setShowSDash] = useState(false);
    const switschSDash = () => {
        if (showSDash) {
            setShowSDash(false);
            document.body.style.overflow = '';
            
        } else if (!showSDash) {
            setShowSDash(true);
            window.matchMedia("(max-width: 1000px)").matches
            ? document.body.style.overflow = 'hidden'
            : document.body.style.overflow = ''
        }
    };
    const [showPost, setShowPost] = useState(false);
    const [showComment, setShowComment] = useState(false);
    
    const handleShowComment = () => {
        if (showComment) {
            document.body.style.overflow = '';
        } else if (!showComment) {
            document.body.style.overflow = 'hidden';
        }
    }

    const handleCreatePost = () => {
        if (showPost) {
            document.body.style.overflow = '';
        } else if (!showPost) {
            document.body.style.overflow = 'hidden';
        }
    }

    return (
        <UtilContext.Provider value={{
            switschSDash,
            showSDash,
            setShowSDash,
            showComment,
            setShowComment,
            handleShowComment,
            showPost,
            setShowPost,
            handleCreatePost,
        }}>
            {children}
        </UtilContext.Provider>
    )
}

export function useUtilData() {
    return useContext(UtilContext);
};