import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";

function Input() {
  return (
    <div className="field">
      <label className="label">Username</label>
      <div className="control has-icons-left has-icons-right">
        <input
          className="input is-success"
          type="text"
          placeholder="Text input"
          value="bulma"
        />
        <span className="icon is-small is-left">
          <FontAwesomeIcon icon={faCoffee} />
        </span>
        <span className="icon is-small is-right">
          <FontAwesomeIcon icon={faCoffee} />
        </span>
      </div>
      <p className="help is-success">This username is available</p>
    </div>
  );
}
export default Input;
