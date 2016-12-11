import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'errors',
  pure: true
})
export class ErrorsPipe implements PipeTransform {


  transform(value: any, args?: any): any {

    console.log('ErrorPipe: ' + JSON.stringify(value));

    if(value === null) {
      return null;
    }

    if(value.hasOwnProperty('required')) {
      return 'Please provide value!'
    } else if (value.hasOwnProperty('minlength')) {
      return 'Value too short, needs to be at least ' + value.minlength.requiredLength + ' but is ' + value.minlength.actualLength;
    } else if (value.hasOwnProperty('maxlength')) {
      return 'Value too long, needs to be at most ' + value.maxlength.requiredLength + ' but is ' + value.maxlength.actualLength;
    }

    return 'Unsupported validation issue, update ErrorsPipe: ' + JSON.stringify(value);
  }

}
