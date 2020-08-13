import { configureActions } from '@storybook/addon-actions';
import 'semantic-ui-css/semantic.min.css';

configureActions({
  depth: 100,
  // Limit the number of items logged into the actions panel
  limit: 20,
});