import BSpinner from 'react-bootstrap/Spinner';
import styles from './spinner.module.css';

function Spinner() {
  return (
          <div className={styles.spinnerContainer}>
            <BSpinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </BSpinner>
          </div>
  );
}

export default Spinner;
