import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

function PasswordInput({ value, error, onChange, confirm = false }) {
  const id = (confirm ? "confirm-" : "") + "password-" + Date.now();
  return (
    <div className="field">
      <label className="label" htmlFor={id}>
        {confirm ? "Confirm Password" : "Password"}
      </label>
      <div className="control has-icons-left has-icons-right">
        <input
          id={id}
          className={`input ${error ? "is-danger" : "is-success"}`}
          type="password"
          placeholder="Please just not 12345 ok?"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="icon is-small is-left">
          <FontAwesomeIcon icon={faLock} />
        </span>
        <span className="icon is-small is-right">
          <FontAwesomeIcon icon={error ? faTimes : faCheck} />
        </span>
      </div>
      {error ? (
        <p className="help is-danger">{error}</p>
      ) : (
        <p className="help is-success">
          This looks like a valid password to me
        </p>
      )}
    </div>
  );
}
export default PasswordInput;
