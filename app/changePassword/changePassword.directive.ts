import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[validatePassword][formControlName],[validatePassword] [formControl], [validatePassword][ngModel]',
    providers: [{
        provide: NG_VALIDATORS, useExisting: forwardRef(() => PasswordValidator), multi: true
    }
    ]

})

export class PasswordValidator implements Validator {
    constructor( @Attribute('validatePassword') public validatePassword: string,
        @Attribute('reverse') public reverse: string) { }

    private get isReverse() {
        if (!this.reverse) return false;
        return this.reverse === 'true' ? true : false;
    }

    validate(confPsswd: AbstractControl): { [key: string]: any } {
        //self value
        let confirmPassword = confPsswd.value;
        //control value
        let password = confPsswd.root.get(this.validatePassword);
        //value not equal
        if (password && confirmPassword !== password.value && !this.isReverse) {
            return {
                validatePassword: false
            }
        }

        //error msg disappers when password field is retyped
        if (password && confirmPassword === password.value && this.isReverse) {
            delete password.errors['validatePassword'];
            if (!Object.keys(password.errors).length) password.setErrors(null);
        }

        //new validation when password field has new value
        if (password && confirmPassword !== password.value && this.isReverse) {
            password.setErrors({ validatePassword: false });
        }

        return null;

    }



}
