import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'profileImg'
})
export class ProfileImgPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(!value)
    {
      value = '../../assets/images/blank-user.jpg';
    }
    return value;
  }

}
