import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorComponent } from './calculator.component';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatorComponent ]
    })
      .compileComponents();
  }));
  let hello: CalculatorComponent;
  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    hello = new CalculatorComponent();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should say hello Calculator', () => {
    expect(hello.sayHello('Calculator')).toBe('Hello Calculator');
  });

  it('should country codes is ru en ua', () => {
    const countries = hello.giveLangCode();
    expect(countries).toContain('ru');
    expect(countries).toContain('en');
    expect(countries).toContain('ua');
  });
});
