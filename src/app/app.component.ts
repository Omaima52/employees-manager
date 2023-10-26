import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  //we can use this variable inside of the template, we can access this variable inside the html file 
  public employees!: Employee[]; // it's gonna hold all the employyes coming from the backend 
  title: any;
  public editEmployee!: Employee;
  public deleteEmployee!: Employee;

  //Injedct the service
  constructor(private employeeService: EmployeeService ){}


  ngOnInit(){
    this.getEmployees();
  }

  public getEmployees() : void{
    //getEmployees service method returns an Observable so we need to subscribe into that Observable 
    //So that we can be notofied whenever some data comes back from the server either an employee we requested or an error
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;

      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    );
  }

  public onAddEmployee(addForm: NgForm): void{
    document.getElementById('add-employee-form')?.click();
    //the value on the form is gonna be a JSON representation of every single one of the inputs
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
        addForm.reset();
      }
    ); 
  }

  public onUpdateEmployee(employee: Employee): void{
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    ); 
  }

  public onDeleteEmployee(employeeId: number): void{
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    ); 
  }

  public searchEmployees(key: string): void{
    console.log(key);
    const results : Employee[] = [];//to hold all the employees whose name or email or jobTitle or .. match the key
    for(const employee of this.employees){
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
      employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
      employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
      employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ){ // means if the employee is present
        results.push(employee);
      }
    }
    this.employees = results;
    if(results.length === 0 || !key){
      this.getEmployees();
    }
  }


  public onOpenModal(employee : Employee, mode: string): void {
    const container = document.getElementById('main-container');

    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if(mode === 'add'){
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if(mode === 'update'){
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if(mode === 'delete'){
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }

    container?.appendChild(button);
    button.click();
  }

  

}
