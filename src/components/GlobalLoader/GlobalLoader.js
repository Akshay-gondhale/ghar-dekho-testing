import style from "./GlobalLoader.module.css"
const GlobalLoader = () => {
    return (
        <>
            <div className={style.mainDiv}>
                <div className={style.centerDiv}>
                    <p className={style.logo}><span className={style.logo_span}>Ghar</span>Dekho</p>
                    <div className="spinner-border text-dark" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GlobalLoader;