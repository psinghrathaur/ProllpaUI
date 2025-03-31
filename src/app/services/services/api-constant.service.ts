import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConstantService {
  public static getJwtToken: string ="auth/ldapLogin";
  public static getUserDetailsByUsername: string ="users/getUserByUsername";
  public static getUserRoleByUserId:string ="userRoles/getUserRoleListByUserId";
  public static getRoleList :string="roles/getRoleList";
  public static getRoleByRoleId:string ="roles/getRoleByRoleId";

  //RoleOut Apis
  public static getExcelAllSheet:string ="excel/sheets";
  public static getExcelToJsonConvert:string ="excel/convertJson";
  public static getExcelToFAQ:string ="excel/convertToFAQJSON";
  public static getZipForUI:string ="excel/upload";
  public static privacyPolicy:string ="excel/privacyPolicy";
  public static uploadIndividual:string ="excel/uploadIndividual";

  constructor() { }
}
