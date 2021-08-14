
const Temp2 = () => {

    const style = {
        maxHeight: "75px",
        minHeight: "38px",
        resize: "none",
        padding: "9px",
        boxSizing: "border-box",
        fontSize: "15px"
    };
    return (
        <>
        <textarea
          style={style}
          placeholder="type some text"
          rows={1}
          defaultValue=""
        />
        </>
    )
}
export default Temp2;