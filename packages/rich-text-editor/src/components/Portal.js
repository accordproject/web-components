import ReactDOM from 'react-dom';

const Portal = ({ children }) => ReactDOM.createPortal(children, document.body);

export default Portal;
