import { isValidPhoneNumber } from 'libphonenumber-js';

import { ElementRef } from '@angular/core';
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

export function observeCountryCodeChanges(
  elementRef: ElementRef,
  handleCountryCodeMutations: (mutations: MutationRecord[]) => void
) {
  const countryCodeElement =
    elementRef.nativeElement.querySelector('#countryCode');

  const config = {
    attributes: true,
    attributeFilter: ['class'],
    subtree: true,
  };

  new MutationObserver(handleCountryCodeMutations).observe(
    countryCodeElement,
    config
  );
}

export function handleCountryCodeMutations(
  mutations: MutationRecord[],
  getSearchInput: (element: Element) => HTMLInputElement | null
) {
  for (const mutation of mutations) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      const searchInput = getSearchInput(mutation.target as Element);
      if (searchInput) {
        searchInput.focus();
        return;
      }
    }
  }
}

export function getSearchInput(element: Element): HTMLInputElement | null {
  const ipvHideDiv = element.querySelector('div.ipv_hide');
  if (!ipvHideDiv) {
    return element.querySelector(
      'div > div:nth-child(2) > ul > li.searchBox > input'
    );
  }
  return null;
}
