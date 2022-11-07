import { ValidatorFn, AbstractControl, FormArray, FormBuilder, FormControl } from '@angular/forms';

// Array Validators
export class cutomValidators {


    // between length
    public static betweenLength(min: number, max: number): ValidatorFn | any {
        return (control: AbstractControl) => {
            return control.value.length < min || control.value.length > max ? { betweenLength: true } : null;
        }
    }


}
