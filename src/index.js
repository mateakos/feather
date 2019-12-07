import logMessage from './js/logger'
import './css/style.css'

logMessage('Welcome to Salesforce CTI')

// Needed for Hot Module Replacement
if(typeof(module.hot) !== 'undefined') {
    module.hot.accept() // eslint-disable-line no-undef  
}