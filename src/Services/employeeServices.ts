import {
  unauthorizedError,
  unprocessableError,
} from "../Middlewares/handleErrorsMiddleware.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

export async function employeeIdValidation(
  employeeId: number,
  companyId: number
) {
  if (!employeeId) {
    throw unprocessableError("The id must be a number!");
  }

  const employee = await employeeRepository.findById(employeeId);
  if (!employee) {
    throw unprocessableError("There ins't an employee with this id!");
  }

  if (employee.companyId !== companyId) {
    throw unauthorizedError("This employee doesn't work ion your company!");
  }

  return employee;
}
