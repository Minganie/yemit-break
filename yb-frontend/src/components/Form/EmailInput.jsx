import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

function EmailInput({ value, error, onChange }) {
  return (
    <div className="field">
      <label className="label">Email</label>
      <div className="control has-icons-left has-icons-right">
        <input
          className={`input ${error ? "is-danger" : "is-success"}`}
          type="text"
          placeholder="your.email@gmail.com"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
        <span className="icon is-small is-left">
          <FontAwesomeIcon icon={faEnvelope} />
        </span>
        <span className="icon is-small is-right">
          <FontAwesomeIcon icon={error ? faTimes : faCheck} />
        </span>
      </div>
      {error ? (
        <p className="help is-danger">{error}</p>
      ) : (
        <p className="help is-success">This looks like a valid email to me</p>
      )}
    </div>
  );
}
export default EmailInput;
