import { FormGroup } from "@angular/forms";

export function passwordMismatch(
    controlName: string,
    matchingControlName: string
): any {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.passwordMismatch) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ passwordMismatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}


export const StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;