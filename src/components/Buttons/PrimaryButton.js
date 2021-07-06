import style from "./PrimaryButton.module.css"
import React  from 'react';
const PrimaryButton = ({heading}) => {
    return(
        <div className={style.mainDiv} dangerouslySetInnerHTML={{ __html: heading }}>
        </div>
    )
}

export default PrimaryButton;