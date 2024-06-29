import { isValidPhoneNumber } from 'libphonenumber-js';

import { FormGroup } from '@angular/forms';

export function invalidPhoneNumber(): any {
  return (formGroup: FormGroup) => {
    const phoneNumber = formGroup.controls.phoneNumber;
    const countryCode = formGroup.controls.countryCode;

    if (phoneNumber.errors && !phoneNumber.errors.invalidPhoneNumber) {
      return;
    }

    if (isValidPhoneNumber(phoneNumber.value, countryCode.value)) {
      phoneNumber.setErrors(null);
    } else {
      phoneNumber.setErrors({ invalidPhoneNumber: true });
    }
  };
}
