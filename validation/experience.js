const Validator = require('validator');
const isEmpty2 = require('./is-empty');

module.exports = function validateExperienceInput(data){

    let errors = {};

    data.title = !isEmpty2(data.title) ? data.title: '';
    data.company = !isEmpty2(data.company) ? data.company : '';
    data.from = !isEmpty2(data.from) ? data.from : '';

    if(Validator.isEmpty(data.title)){
        errors.title = 'Title handle is requried';
    }

    if(Validator.isEmpty(data.company)){
        errors.company = 'company handle is requried';
    }

    if(Validator.isEmpty(data.from)){
        errors.from = 'from handle is requried';
    }

    return {
        errors,
        isValid: isEmpty2(errors)
    };
}