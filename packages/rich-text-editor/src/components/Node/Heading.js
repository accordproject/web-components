import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as SCHEMA from '../../utilities/schema';

const Heading = styled.div`
  font-family: serif;
`;

Heading.propTypes = {
  type: PropTypes.oneOf(SCHEMA.HEADINGS),
};

export default Heading;
