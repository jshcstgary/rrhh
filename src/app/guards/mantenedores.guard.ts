import { CanActivateFn, UrlTree } from '@angular/router';
import { PageCodes } from '../enums/codes.enum';
import { Observable } from 'rxjs';

export const mantenedoresGuard = (pageCode: PageCodes): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  console.log(pageCode);
  
  return true;
};

const validateRoute: CanActivateFn = (route, state) => {
  return true;
};
